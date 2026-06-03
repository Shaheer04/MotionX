import os
import base64
import asyncio
from celery import Celery
import time
from scraper import capture_screenshots
from ai_engine import generate_storyboard
from config import settings

celery_app = Celery(
    "worker",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

@celery_app.task(bind=True)
def generate_video_task(self, url: str):
    self.update_state(state='PROCESSING', meta={'step': 'Starting pipeline'})
    print(f"Starting job for URL: {url}")
    
    try:
        # Step 1: Scrape website
        self.update_state(state='PROCESSING', meta={'step': 'Scraping website with Playwright'})
        print("Capturing screenshots...")
        screenshots = asyncio.run(capture_screenshots(url))
        
        if not screenshots:
            raise Exception("Failed to capture any screenshots.")
        
        # Step 2: Generate Storyboard with Gemini
        self.update_state(state='PROCESSING', meta={'step': 'Generating storyboard with Gemini'})
        print("Generating storyboard...")
        storyboard = generate_storyboard(screenshots)
        print("Storyboard generated successfully!")
        
        # Step 3: Save images to disk and inject URLs into storyboard
        base_url = os.environ.get("BACKEND_URL", "http://localhost:8000")
        screenshot_urls = []
        image_dir = os.path.join(os.path.dirname(__file__), "static", "images")
        os.makedirs(image_dir, exist_ok=True)
        
        for idx, b64_str in enumerate(screenshots):
            img_data = base64.b64decode(b64_str)
            filename = f"{self.request.id}_{idx}.png"
            filepath = os.path.join(image_dir, filename)
            with open(filepath, "wb") as f:
                f.write(img_data)
            screenshot_urls.append(f"{base_url}/images/{filename}")
            
        storyboard["screenshot_urls"] = screenshot_urls
        
        # Step 4: Remotion rendering
        self.update_state(state='PROCESSING', meta={'step': 'Rendering video with Remotion'})
        print("Rendering video...")
        
        # Write storyboard to a temp json file
        import json
        import subprocess
        
        props_file = f"/tmp/props_{self.request.id}.json"
        with open(props_file, 'w') as f:
            json.dump(storyboard, f)
            
        # Save directly to the static directory
        output_filename = f"output_{self.request.id}.mp4"
        output_file = os.path.join(os.path.dirname(__file__), "static", "videos", output_filename)
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        
        # Call Remotion CLI
        remotion_dir = os.path.join(os.path.dirname(__file__), "remotion-engine")
        cmd = ["npx", "remotion", "render", "src/index.ts", "Main", output_file, "--props", props_file]
        
        process = subprocess.Popen(cmd, cwd=remotion_dir, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = process.communicate()
        
        if process.returncode != 0:
            raise Exception(f"Remotion rendering failed: {stderr.decode()}")
        print("Video rendered successfully to", output_file)
        
        # Return the public URL served by FastAPI
        base_url = os.environ.get("BACKEND_URL", "http://localhost:8000")
        video_url = f"{base_url}/videos/{output_filename}"
            
        return {
            "video_url": video_url,
            "storyboard": storyboard
        }
        
    except Exception as e:
        print(f"Task failed: {e}")
        raise

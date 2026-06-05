import os
import json
import base64
from google import genai
from pydantic import BaseModel, Field
from config import settings

if settings.GEMINI_API_KEY:
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
else:
    client = genai.Client()

class Scene(BaseModel):
    title: str = Field(description="Short title for the scene")
    copy_text: str = Field(description="The marketing copy to display in the video")
    screenshot_index: int = Field(description="The index of the screenshot to use as background (always 0)")
    duration_seconds: float = Field(description="Duration of the scene in seconds. MUST be exactly 1.2, 1.8, 2.4, 4.8, or 6.0 for 100 BPM sync.")
    animation_type: str = Field(description="Type of animation: 'slide-in', 'typewriter', 'blur-fade', 'gradient-wipe', or 'punch-in'")

class VideoPlan(BaseModel):
    product_name: str
    tagline: str
    brand_color_primary: str = Field(description="Vibrant bright foreground/text hex color (e.g. white, neon green, bright blue) providing maximum contrast against a dark black background.")
    scenes: list[Scene] = Field(description="List of 8-10 fast-paced scenes for the video")

def generate_storyboard(screenshots_base64: list[str]) -> dict:
    """
    Sends the screenshots to Gemini 2.5 Flash to generate a storyboard.
    """
    parts = []
    for i, b64 in enumerate(screenshots_base64):
        image_bytes = base64.b64decode(b64)
        parts.append(
            genai.types.Part.from_bytes(
                data=image_bytes,
                mime_type='image/png',
            )
        )
        parts.append(f"Screenshot Index: {i}")

    prompt = (
        "You are an expert, top-tier SaaS video marketing producer and copywriter. "
        "I have provided screenshots of a SaaS product's website. "
        "Analyze the visual design and determine a primary brand color: "
        "brand_color_primary: A vibrant, bright color (like pure white, neon green, bright blue) that provides maximum contrast against a pitch black background. You may extract this from the product's primary accents. "
        "Write a storyboard for a 20-second high-energy, high-converting promotional video. "
        "The copywriting MUST be exceptional—professional, punchy, and designed to hook the viewer instantly. Use strong action verbs and emotional triggers. "
        "The video relies on fast-paced 'Kinetic Typography'. You must generate exactly 8 to 10 very short scenes. "
        "Each scene should have 1 to 4 words MAX of this high-converting marketing copy. "
        "Specify which screenshot index should be used as the background (always use 0). "
        "CRITICAL TEMPO INSTRUCTION: The video is perfectly synced to a 100 BPM music track (1 beat = 0.6 seconds). "
        "To ensure every transition lands flawlessly on a drum beat, EVERY scene duration MUST be an exact multiple of 0.6 seconds! "
        "Most text scenes MUST be exactly 1.2, 1.8, or 2.4 seconds long. "
        "The 'punch-in' UI reveal scene MUST be exactly 4.8 or 6.0 seconds long to allow time for the slow scroll. DO NOT use any other decimals."
        "Also, strictly recommend an animation type ('slide-in', 'typewriter', 'blur-fade', 'gradient-wipe', or 'punch-in') for each scene. "
        "IMPORTANT: You MUST rely primarily on text animation ('slide-in', 'typewriter', 'blur-fade', 'gradient-wipe'). You may ONLY use the 'punch-in' animation for a maximum of 1 or 2 scenes near the climax of the video to reveal the UI."
    )
    parts.append(prompt)

    response = client.models.generate_content(
        model=settings.GEMINI_MODEL_NAME,
        contents=parts,
        config=genai.types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=VideoPlan,
            temperature=0.7,
        ),
    )
    
    return json.loads(response.text)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import os
from worker import generate_video_task

app = FastAPI(title="PromoGen API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("static/videos", exist_ok=True)
app.mount("/videos", StaticFiles(directory="static/videos"), name="videos")

class VideoRequest(BaseModel):
    url: str

@app.post("/api/generate")
async def generate_video(req: VideoRequest):
    # Queue the task in Celery
    task = generate_video_task.delay(req.url)
    return {"job_id": task.id, "status": "queued"}

@app.get("/api/jobs/{job_id}/status")
async def get_job_status(job_id: str):
    # Fetch status from Celery (or later PostgreSQL)
    from worker import celery_app
    task_result = celery_app.AsyncResult(job_id)
    
    if task_result.state == 'PENDING':
        return {"job_id": job_id, "status": "pending"}
    elif task_result.state != 'FAILURE':
        return {
            "job_id": job_id,
            "status": task_result.state.lower(),
            "result": task_result.result if task_result.state == 'SUCCESS' else None
        }
    else:
        return {"job_id": job_id, "status": "failed", "error": str(task_result.info)}

@app.get("/health")
async def health_check():
    return {"status": "ok"}

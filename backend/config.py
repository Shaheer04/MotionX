import os
from dotenv import load_dotenv

# Load variables from .env file into os.environ
load_dotenv()

class Settings:
    # App Settings
    APP_NAME: str = "PromoGen API"
    
    # Gemini AI
    GEMINI_API_KEY: str = os.environ.get("GEMINI_API_KEY", "")
    GEMINI_MODEL_NAME: str = os.environ.get("GEMINI_MODEL_NAME", "gemini-2.5-flash")
    
    # Redis / Celery
    REDIS_URL: str = os.environ.get("REDIS_URL", "redis://localhost:6379/0")
    
    # Cloudflare R2 / S3
    R2_ENDPOINT_URL: str = os.environ.get("R2_ENDPOINT_URL", "")
    R2_ACCESS_KEY_ID: str = os.environ.get("R2_ACCESS_KEY_ID", "")
    R2_SECRET_ACCESS_KEY: str = os.environ.get("R2_SECRET_ACCESS_KEY", "")
    R2_BUCKET_NAME: str = os.environ.get("R2_BUCKET_NAME", "promogen-videos")

# Global settings instance to import across the app
settings = Settings()

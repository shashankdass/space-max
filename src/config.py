"""Application configuration using Pydantic settings."""

from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Settings loaded from environment variables and .env file."""

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost/space_rental"

    # Security
    SECRET_KEY: str = "your-secret-key-will-be-generated"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS - Updated for Vercel deployment
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8080",
        "https://*.vercel.app",
        "https://space-max.vercel.app",  # Replace with your actual domain
    ]

    # App
    DEBUG: bool = False
    ENVIRONMENT: str = "production"

    # File Storage - Vercel Blob
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    BLOB_READ_WRITE_TOKEN: str = ""  # Vercel Blob token
    
    # Legacy upload dir (kept for backward compatibility)
    UPLOAD_DIR: str = "uploads"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()



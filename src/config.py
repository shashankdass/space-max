"""Application configuration using Pydantic settings."""

from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Settings loaded from environment variables and .env file."""

    # Database
    DATABASE_URL: str = (
        "postgresql+asyncpg://user:password@localhost:5432/space_rental"
    )

    # Security (placeholders for future auth)
    SECRET_KEY: str = "change-me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8080",
    ]

    # App
    DEBUG: bool = True
    ENVIRONMENT: str = "development"

    # Uploads
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    UPLOAD_DIR: str = "uploads"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()



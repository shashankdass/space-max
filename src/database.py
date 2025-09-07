"""Database configuration and lifecycle management."""

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import text

from src.config import settings


class Base(DeclarativeBase):
    """Declarative base for ORM models."""


# Engine and session factory
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    future=True,
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db() -> AsyncSession:
    """FastAPI dependency to provide a database session."""
    async with AsyncSessionLocal() as session:
        yield session


async def init_db() -> None:
    """Create database tables on startup if they do not exist."""
    # Import models here so metadata is registered
    from src.models.space import Space  # noqa: F401

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)



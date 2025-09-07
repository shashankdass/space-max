"""FastAPI application entrypoint for Space Rental API."""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.config import settings
from src.database import init_db
from src.routers import spaces


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    yield
    # Shutdown


app = FastAPI(
    title="Space Rental API",
    description="APIs for renting private spaces like garages and backyards",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(spaces.router, prefix="/api/v1", tags=["spaces"])


@app.get("/")
async def root() -> dict:
    return {"message": "Space Rental API running", "version": "0.1.0"}


@app.get("/health")
async def health() -> dict:
    return {"status": "ok"}



"""Vercel serverless function entry point for FastAPI backend."""

from src.main import app

# Vercel expects a handler function
def handler(request, response):
    return app(request, response)

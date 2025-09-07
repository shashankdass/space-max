# Space Rental API — Initial Backend Setup

## Overview
- FastAPI backend scaffolded with async SQLAlchemy and modular structure.
- Local development uses SQLite via aiosqlite.
- Core Spaces APIs implemented: GET /spaces, POST /spaces, PUT /spaces/{id}.

## Project Structure
```
src/
  config.py
  database.py
  main.py
  models/
    space.py
  schemas/
    space.py
  services/
    space_service.py
  routers/
    spaces.py
infra/
  Dockerfile
requirements.txt
```

## Dependencies
- FastAPI, Uvicorn
- SQLAlchemy 2.x (asyncio), aiosqlite
- Pydantic v2, pydantic-settings
- Alembic (migrations; not initialized yet)

## Environment
- Default dev DB: SQLite; set via env var
```
DATABASE_URL=sqlite+aiosqlite:////absolute/path/to/space_rental.db
```

## Local Run
1) Create venv and install deps
```
python3 -m venv .venv
./.venv/bin/pip install -r requirements.txt
```
2) Start API (use 8001 if 8000 busy)
```
DATABASE_URL=sqlite+aiosqlite:////$(pwd)/space_rental.db \
  ./.venv/bin/python -m uvicorn src.main:app --host 127.0.0.1 --port 8001
```
3) Verify
```
curl http://127.0.0.1:8001/health
```

## API Endpoints
- GET `/api/v1/spaces`
- POST `/api/v1/spaces`
- PUT `/api/v1/spaces/{id}`

Docs: `/docs`

### Examples
Create
```
curl -X POST http://127.0.0.1:8001/api/v1/spaces \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Cozy Garage",
    "description": "Secure private garage space...",
    "space_type": "garage",
    "location": "Downtown",
    "address": "123 Main St",
    "city": "Austin",
    "state": "TX",
    "zip_code": "73301",
    "country": "US",
    "price_per_hour": 10.5
  }'
```
List
```
curl 'http://127.0.0.1:8001/api/v1/spaces?page=1&per_page=10'
```
Update
```
curl -X PUT http://127.0.0.1:8001/api/v1/spaces/1 \
  -H 'Content-Type: application/json' \
  -d '{"price_per_hour": 12}'
```

## Achievements
- DB initialized; tables auto-created on startup.
- CRUD service and validation in place.
- Endpoints return typed responses and proper codes.
- CORS enabled for local frontends.
- Dockerfile ready for container runs.

## Next Steps
- Initialize Alembic migrations.
- Add auth and ownership.
- Seed data + pytest/httpx tests.
- Error middleware and structured logging.

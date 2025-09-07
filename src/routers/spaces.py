"""Spaces API router."""

import logging
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.schemas.space import (
    SpaceCreate,
    SpaceListResponse,
    SpaceQueryParams,
    SpaceResponse,
    SpaceUpdate,
)
from src.services.space_service import SpaceService, _parse_json_field

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/spaces", response_model=SpaceListResponse)
async def get_spaces(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    space_type: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    min_price: Optional[Decimal] = Query(None, ge=0),
    max_price: Optional[Decimal] = Query(None, ge=0),
    is_available: Optional[bool] = Query(None),
    search: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    params = SpaceQueryParams(
        page=page,
        per_page=per_page,
        space_type=space_type,
        city=city,
        state=state,
        min_price=min_price,
        max_price=max_price,
        is_available=is_available,
        search=search,
    )

    service = SpaceService(db)
    spaces, total = await service.get_spaces(params)

    items = []
    for s in spaces:
        items.append(
            SpaceResponse(
                id=s.id,
                title=s.title,
                description=s.description,
                space_type=s.space_type,
                location=s.location,
                address=s.address,
                city=s.city,
                state=s.state,
                zip_code=s.zip_code,
                country=s.country,
                price_per_hour=s.price_per_hour,
                price_per_day=s.price_per_day,
                price_per_week=s.price_per_week,
                price_per_month=s.price_per_month,
                area_sqft=s.area_sqft,
                max_capacity=s.max_capacity,
                amenities=_parse_json_field(s.amenities),
                is_available=s.is_available,
                available_from=s.available_from,
                available_until=s.available_until,
                photos=_parse_json_field(s.photos),
                created_at=s.created_at,
                updated_at=s.updated_at,
            )
        )

    total_pages = (total + per_page - 1) // per_page
    return SpaceListResponse(
        spaces=items,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=total_pages,
    )


@router.post("/spaces", response_model=SpaceResponse, status_code=status.HTTP_201_CREATED)
async def create_space(space_data: SpaceCreate, db: AsyncSession = Depends(get_db)):
    service = SpaceService(db)
    space = await service.create_space(space_data)
    return SpaceResponse(
        id=space.id,
        title=space.title,
        description=space.description,
        space_type=space.space_type,
        location=space.location,
        address=space.address,
        city=space.city,
        state=space.state,
        zip_code=space.zip_code,
        country=space.country,
        price_per_hour=space.price_per_hour,
        price_per_day=space.price_per_day,
        price_per_week=space.price_per_week,
        price_per_month=space.price_per_month,
        area_sqft=space.area_sqft,
        max_capacity=space.max_capacity,
        amenities=_parse_json_field(space.amenities),
        is_available=space.is_available,
        available_from=space.available_from,
        available_until=space.available_until,
        photos=_parse_json_field(space.photos),
        created_at=space.created_at,
        updated_at=space.updated_at,
    )


@router.put("/spaces/{space_id}", response_model=SpaceResponse)
async def update_space(space_id: int, space_data: SpaceUpdate, db: AsyncSession = Depends(get_db)):
    service = SpaceService(db)
    space = await service.update_space(space_id, space_data)
    if not space:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Space not found")
    return SpaceResponse(
        id=space.id,
        title=space.title,
        description=space.description,
        space_type=space.space_type,
        location=space.location,
        address=space.address,
        city=space.city,
        state=space.state,
        zip_code=space.zip_code,
        country=space.country,
        price_per_hour=space.price_per_hour,
        price_per_day=space.price_per_day,
        price_per_week=space.price_per_week,
        price_per_month=space.price_per_month,
        area_sqft=space.area_sqft,
        max_capacity=space.max_capacity,
        amenities=_parse_json_field(space.amenities),
        is_available=space.is_available,
        available_from=space.available_from,
        available_until=space.available_until,
        photos=_parse_json_field(space.photos),
        created_at=space.created_at,
        updated_at=space.updated_at,
    )



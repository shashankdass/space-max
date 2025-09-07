"""Service layer for Space domain operations."""

import json
import logging
from typing import List, Optional, Tuple

from sqlalchemy import and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.space import Space
from src.schemas.space import SpaceCreate, SpaceQueryParams, SpaceUpdate

logger = logging.getLogger(__name__)


def _parse_json_field(json_str: Optional[str]) -> List[str]:
    if not json_str:
        return []
    try:
        return json.loads(json_str)
    except json.JSONDecodeError:
        return []


class SpaceService:
    """Encapsulates business logic for Spaces."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create_space(self, data: SpaceCreate) -> Space:
        amenities_json = json.dumps(data.amenities) if data.amenities else None
        photos_json = json.dumps(data.photos) if data.photos else None

        space = Space(
            title=data.title,
            description=data.description,
            space_type=data.space_type,
            location=data.location,
            address=data.address,
            city=data.city,
            state=data.state,
            zip_code=data.zip_code,
            country=data.country,
            price_per_hour=data.price_per_hour,
            price_per_day=data.price_per_day,
            price_per_week=data.price_per_week,
            price_per_month=data.price_per_month,
            area_sqft=data.area_sqft,
            max_capacity=data.max_capacity,
            amenities=amenities_json,
            is_available=data.is_available,
            available_from=data.available_from,
            available_until=data.available_until,
            photos=photos_json,
        )

        self.db.add(space)
        await self.db.commit()
        await self.db.refresh(space)
        return space

    async def get_space_by_id(self, space_id: int) -> Optional[Space]:
        result = await self.db.execute(select(Space).where(Space.id == space_id))
        return result.scalar_one_or_none()

    async def get_spaces(self, query: SpaceQueryParams) -> Tuple[List[Space], int]:
        filters = []
        if query.space_type:
            filters.append(Space.space_type == query.space_type)
        if query.city:
            filters.append(Space.city.ilike(f"%{query.city}%"))
        if query.state:
            filters.append(Space.state.ilike(f"%{query.state}%"))
        if query.min_price is not None:
            filters.append(Space.price_per_hour >= query.min_price)
        if query.max_price is not None:
            filters.append(Space.price_per_hour <= query.max_price)
        if query.is_available is not None:
            filters.append(Space.is_available == query.is_available)
        if query.search:
            filters.append(
                or_(
                    Space.title.ilike(f"%{query.search}%"),
                    Space.description.ilike(f"%{query.search}%"),
                    Space.location.ilike(f"%{query.search}%"),
                )
            )

        base_stmt = select(Space)
        count_stmt = select(func.count(Space.id))
        if filters:
            base_stmt = base_stmt.where(and_(*filters))
            count_stmt = count_stmt.where(and_(*filters))

        total = (await self.db.execute(count_stmt)).scalar_one()

        offset = (query.page - 1) * query.per_page
        stmt = base_stmt.order_by(Space.created_at.desc()).offset(offset).limit(query.per_page)
        result = await self.db.execute(stmt)
        spaces = result.scalars().all()
        return list(spaces), int(total)

    async def update_space(self, space_id: int, data: SpaceUpdate) -> Optional[Space]:
        space = await self.get_space_by_id(space_id)
        if not space:
            return None

        updates = data.model_dump(exclude_unset=True)
        for field, value in updates.items():
            if field in {"amenities", "photos"} and value is not None:
                setattr(space, field, json.dumps(value))
            else:
                setattr(space, field, value)

        await self.db.commit()
        await self.db.refresh(space)
        return space

    async def delete_space(self, space_id: int) -> bool:
        space = await self.get_space_by_id(space_id)
        if not space:
            return False
        await self.db.delete(space)
        await self.db.commit()
        return True



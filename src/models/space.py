"""SQLAlchemy ORM model for Space."""

from datetime import datetime
from typing import Optional

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Integer,
    Numeric,
    String,
    Text,
)
from sqlalchemy.sql import func

from src.database import Base


class Space(Base):
    __tablename__ = "spaces"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=False)
    space_type = Column(String(50), nullable=False)
    location = Column(String(200), nullable=False)
    address = Column(Text, nullable=False)
    city = Column(String(100), nullable=False, index=True)
    state = Column(String(50), nullable=False)
    zip_code = Column(String(20), nullable=False)
    country = Column(String(50), default="US")

    price_per_hour = Column(Numeric(10, 2), nullable=False)
    price_per_day = Column(Numeric(10, 2), nullable=True)
    price_per_week = Column(Numeric(10, 2), nullable=True)
    price_per_month = Column(Numeric(10, 2), nullable=True)

    area_sqft = Column(Integer, nullable=True)
    max_capacity = Column(Integer, nullable=True)
    amenities = Column(Text, nullable=True)  # JSON-encoded list

    is_available = Column(Boolean, default=True, index=True)
    available_from = Column(DateTime, nullable=True)
    available_until = Column(DateTime, nullable=True)

    photos = Column(Text, nullable=True)  # JSON-encoded list

    # Placeholder for future user relation
    host_id = Column(Integer, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self) -> str:  # pragma: no cover - debug helper
        return f"<Space id={self.id} title={self.title!r} type={self.space_type!r}>"



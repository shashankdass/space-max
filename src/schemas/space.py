"""Pydantic v2 schemas for Space API."""

from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel, Field, field_validator, model_validator


class SpaceBase(BaseModel):
    title: str = Field(..., min_length=5, max_length=200)
    description: str = Field(..., min_length=20, max_length=2000)
    space_type: str = Field(..., description="garage, backyard, etc.")
    location: str = Field(..., min_length=5, max_length=200)
    address: str = Field(..., min_length=10, max_length=500)
    city: str = Field(..., min_length=2, max_length=100)
    state: str = Field(..., min_length=2, max_length=50)
    zip_code: str = Field(..., min_length=5, max_length=20)
    country: str = Field(default="US", max_length=50)

    price_per_hour: Optional[Decimal] = Field(None, gt=0)
    price_per_day: Optional[Decimal] = Field(None, gt=0)
    price_per_week: Optional[Decimal] = Field(None, gt=0)
    price_per_month: Optional[Decimal] = Field(None, gt=0)

    area_sqft: Optional[int] = Field(None, ge=0)
    max_capacity: Optional[int] = Field(None, gt=0)
    amenities: Optional[List[str]] = Field(default_factory=list)

    is_available: bool = True
    available_from: Optional[datetime] = None
    available_until: Optional[datetime] = None

    photos: Optional[List[str]] = Field(default_factory=list)

    @field_validator("space_type")
    @classmethod
    def validate_space_type(cls, value: str) -> str:
        allowed = {
            "garage",
            "backyard",
            "basement",
            "attic",
            "warehouse",
            "parking_space",
            "other",
        }
        lowered = value.lower()
        if lowered not in allowed:
            raise ValueError(f"space_type must be one of: {', '.join(sorted(allowed))}")
        return lowered

    @model_validator(mode='after')
    def validate_exactly_one_price(self):
        """Ensure exactly one price field is provided and greater than 0."""
        price_fields = [
            self.price_per_hour,
            self.price_per_day, 
            self.price_per_week,
            self.price_per_month
        ]
        
        provided_prices = [price for price in price_fields if price and price > 0]
        
        if len(provided_prices) == 0:
            raise ValueError("Exactly one price field (hour, day, week, or month) must be provided and greater than 0")
        elif len(provided_prices) > 1:
            raise ValueError("Only one price field can be set. Please provide either hourly, daily, weekly, or monthly pricing, not multiple.")
        
        return self


class SpaceCreate(SpaceBase):
    pass


class SpaceUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=5, max_length=200)
    description: Optional[str] = Field(None, min_length=20, max_length=2000)
    space_type: Optional[str] = None
    location: Optional[str] = Field(None, min_length=5, max_length=200)
    address: Optional[str] = Field(None, min_length=10, max_length=500)
    city: Optional[str] = Field(None, min_length=2, max_length=100)
    state: Optional[str] = Field(None, min_length=2, max_length=50)
    zip_code: Optional[str] = Field(None, min_length=5, max_length=20)
    country: Optional[str] = Field(None, max_length=50)

    price_per_hour: Optional[Decimal] = Field(None, gt=0)
    price_per_day: Optional[Decimal] = Field(None, gt=0)
    price_per_week: Optional[Decimal] = Field(None, gt=0)
    price_per_month: Optional[Decimal] = Field(None, gt=0)

    area_sqft: Optional[int] = Field(None, ge=0)
    max_capacity: Optional[int] = Field(None, gt=0)
    amenities: Optional[List[str]] = None
    is_available: Optional[bool] = None
    available_from: Optional[datetime] = None
    available_until: Optional[datetime] = None
    photos: Optional[List[str]] = None

    @field_validator("space_type")
    @classmethod
    def validate_space_type(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None
        allowed = {
            "garage",
            "backyard",
            "basement",
            "attic",
            "warehouse",
            "parking_space",
            "other",
        }
        lowered = value.lower()
        if lowered not in allowed:
            raise ValueError(f"space_type must be one of: {', '.join(sorted(allowed))}")
        return lowered


class SpaceResponse(BaseModel):
    id: int
    title: str = Field(..., min_length=5, max_length=200)
    description: str = Field(..., min_length=20, max_length=2000)
    space_type: str = Field(..., description="garage, backyard, etc.")
    location: str = Field(..., min_length=5, max_length=200)
    address: str = Field(..., min_length=10, max_length=500)
    city: str = Field(..., min_length=2, max_length=100)
    state: str = Field(..., min_length=2, max_length=50)
    zip_code: str = Field(..., min_length=5, max_length=20)
    country: str = Field(default="US", max_length=50)

    price_per_hour: Optional[Decimal] = Field(None, gt=0)
    price_per_day: Optional[Decimal] = Field(None, gt=0)
    price_per_week: Optional[Decimal] = Field(None, gt=0)
    price_per_month: Optional[Decimal] = Field(None, gt=0)

    area_sqft: Optional[int] = Field(None, ge=0)
    max_capacity: Optional[int] = Field(None, gt=0)
    amenities: Optional[List[str]] = Field(default_factory=list)

    is_available: bool = True
    available_from: Optional[datetime] = None
    available_until: Optional[datetime] = None

    photos: Optional[List[str]] = Field(default_factory=list)
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SpaceListResponse(BaseModel):
    spaces: List[SpaceResponse]
    total: int
    page: int
    per_page: int
    total_pages: int


class SpaceQueryParams(BaseModel):
    page: int = Field(default=1, ge=1)
    per_page: int = Field(default=10, ge=1, le=100)
    space_type: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    min_price: Optional[Decimal] = Field(default=None, ge=0)
    max_price: Optional[Decimal] = Field(default=None, ge=0)
    is_available: Optional[bool] = None
    search: Optional[str] = None



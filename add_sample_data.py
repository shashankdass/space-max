#!/usr/bin/env python3
"""Script to add sample data to the database for testing."""

import asyncio
import json
from datetime import datetime
from decimal import Decimal

from sqlalchemy.ext.asyncio import AsyncSession
from src.database import AsyncSessionLocal, init_db
from src.models.space import Space


async def add_sample_spaces():
    """Add sample spaces to the database."""
    
    # Initialize database tables
    await init_db()
    
    sample_spaces = [
        {
            "title": "Spacious 2-Car Garage in Downtown",
            "description": "Perfect for storage or workshop. Clean, dry, and secure garage space with easy access. Great for car storage, workshop, or storage needs.",
            "space_type": "garage",
            "location": "Downtown District",
            "address": "123 Main Street",
            "city": "San Francisco",
            "state": "CA",
            "zip_code": "94102",
            "country": "US",
            "price_per_hour": Decimal("15.00"),
            "price_per_day": Decimal("120.00"),
            "price_per_week": Decimal("800.00"),
            "price_per_month": Decimal("3000.00"),
            "area_sqft": 400,
            "max_capacity": 4,
            "amenities": json.dumps(["Security Camera", "WiFi", "Parking", "Electricity"]),
            "is_available": True,
            "available_from": datetime(2024, 1, 1),
            "available_until": datetime(2024, 12, 31),
            "photos": json.dumps([]),
        },
        {
            "title": "Beautiful Backyard for Events",
            "description": "Large, well-maintained backyard perfect for parties, gatherings, or outdoor events. Includes seating area and garden space.",
            "space_type": "backyard",
            "location": "Residential Area",
            "address": "456 Oak Avenue",
            "city": "Los Angeles",
            "state": "CA",
            "zip_code": "90210",
            "country": "US",
            "price_per_hour": Decimal("25.00"),
            "price_per_day": Decimal("200.00"),
            "price_per_week": Decimal("1200.00"),
            "price_per_month": Decimal("4500.00"),
            "area_sqft": 800,
            "max_capacity": 50,
            "amenities": json.dumps(["Outdoor Seating", "Garden", "Restroom Access", "Parking"]),
            "is_available": True,
            "available_from": datetime(2024, 1, 1),
            "available_until": datetime(2024, 12, 31),
            "photos": json.dumps([]),
        },
        {
            "title": "Secure Basement Storage",
            "description": "Dry, secure basement space perfect for storage. Climate controlled and easily accessible. Great for seasonal items or business inventory.",
            "space_type": "basement",
            "location": "Suburban Area",
            "address": "789 Pine Street",
            "city": "Seattle",
            "state": "WA",
            "zip_code": "98101",
            "country": "US",
            "price_per_hour": Decimal("10.00"),
            "price_per_day": Decimal("80.00"),
            "price_per_week": Decimal("500.00"),
            "price_per_month": Decimal("1800.00"),
            "area_sqft": 300,
            "max_capacity": 2,
            "amenities": json.dumps(["Climate Control", "Security", "Easy Access"]),
            "is_available": False,
            "available_from": datetime(2024, 1, 1),
            "available_until": datetime(2024, 12, 31),
            "photos": json.dumps([]),
        },
        {
            "title": "Modern Warehouse Space",
            "description": "Large warehouse space with loading dock access. Perfect for business operations, storage, or events. High ceilings and excellent lighting.",
            "space_type": "warehouse",
            "location": "Industrial District",
            "address": "321 Industrial Blvd",
            "city": "Chicago",
            "state": "IL",
            "zip_code": "60601",
            "country": "US",
            "price_per_hour": Decimal("50.00"),
            "price_per_day": Decimal("400.00"),
            "price_per_week": Decimal("2500.00"),
            "price_per_month": Decimal("9000.00"),
            "area_sqft": 2000,
            "max_capacity": 100,
            "amenities": json.dumps(["Loading Dock", "High Ceilings", "Security", "Parking", "Restrooms"]),
            "is_available": True,
            "available_from": datetime(2024, 1, 1),
            "available_until": datetime(2024, 12, 31),
            "photos": json.dumps([]),
        },
        {
            "title": "Cozy Attic Studio",
            "description": "Charming attic space perfect for creative work, small meetings, or quiet storage. Natural light and rustic charm.",
            "space_type": "attic",
            "location": "Historic District",
            "address": "555 Heritage Lane",
            "city": "Boston",
            "state": "MA",
            "zip_code": "02101",
            "country": "US",
            "price_per_hour": Decimal("20.00"),
            "price_per_day": Decimal("150.00"),
            "price_per_week": Decimal("900.00"),
            "price_per_month": Decimal("3200.00"),
            "area_sqft": 250,
            "max_capacity": 8,
            "amenities": json.dumps(["Natural Light", "WiFi", "Heating", "Quiet"]),
            "is_available": True,
            "available_from": datetime(2024, 1, 1),
            "available_until": datetime(2024, 12, 31),
            "photos": json.dumps([]),
        },
        {
            "title": "Premium Parking Space",
            "description": "Covered parking space in prime downtown location. Perfect for daily commuters or event parking.",
            "space_type": "parking_space",
            "location": "Financial District",
            "address": "777 Business Plaza",
            "city": "New York",
            "state": "NY",
            "zip_code": "10001",
            "country": "US",
            "price_per_hour": Decimal("8.00"),
            "price_per_day": Decimal("45.00"),
            "price_per_week": Decimal("250.00"),
            "price_per_month": Decimal("900.00"),
            "area_sqft": 200,
            "max_capacity": 1,
            "amenities": json.dumps(["Covered", "Security", "24/7 Access", "EV Charging"]),
            "is_available": True,
            "available_from": datetime(2024, 1, 1),
            "available_until": datetime(2024, 12, 31),
            "photos": json.dumps([]),
        }
    ]
    
    async with AsyncSessionLocal() as session:
        # Check if we already have data
        from sqlalchemy import text
        existing_count = await session.execute(
            text("SELECT COUNT(*) FROM spaces")
        )
        count = existing_count.scalar()
        
        if count > 0:
            print(f"Database already has {count} spaces. Skipping sample data insertion.")
            return
        
        # Add sample spaces
        for space_data in sample_spaces:
            space = Space(**space_data)
            session.add(space)
        
        await session.commit()
        print(f"Added {len(sample_spaces)} sample spaces to the database.")


if __name__ == "__main__":
    asyncio.run(add_sample_spaces())

#!/usr/bin/env python3
"""
Database initialization script.
Run this to create all tables and ensure the database schema is up to date.
"""
import asyncio
import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import create_tables
from app.services.subscription_service import SubscriptionService
from app.core.database import get_db

async def init_database():
    """Initialize the database with all required tables and default data."""
    try:
        print("Creating database tables...")
        await create_tables()
        print("✓ Database tables created successfully")
        
        # Initialize default subscription plans
        print("Initializing default subscription plans...")
        db = next(get_db())
        try:
            SubscriptionService.initialize_default_plans(db)
            print("✓ Default subscription plans initialized")
        finally:
            db.close()
        
        print("✓ Database initialization completed successfully!")
        
    except Exception as e:
        print(f"✗ Database initialization failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(init_database())
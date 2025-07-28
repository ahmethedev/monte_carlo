"""
Migration: Add terms acceptance fields to users table
Date: 2025-01-28
"""

from sqlalchemy import text

def upgrade(connection):
    """Add terms and privacy acceptance fields to users table"""
    connection.execute(text("""
        ALTER TABLE users 
        ADD COLUMN terms_accepted BOOLEAN DEFAULT FALSE NOT NULL;
    """))
    
    connection.execute(text("""
        ALTER TABLE users 
        ADD COLUMN privacy_accepted BOOLEAN DEFAULT FALSE NOT NULL;
    """))
    
    connection.execute(text("""
        ALTER TABLE users 
        ADD COLUMN terms_accepted_at TIMESTAMP WITH TIME ZONE NULL;
    """))
    
    connection.execute(text("""
        ALTER TABLE users 
        ADD COLUMN privacy_accepted_at TIMESTAMP WITH TIME ZONE NULL;
    """))

def downgrade(connection):
    """Remove terms and privacy acceptance fields from users table"""
    connection.execute(text("""
        ALTER TABLE users 
        DROP COLUMN IF EXISTS terms_accepted;
    """))
    
    connection.execute(text("""
        ALTER TABLE users 
        DROP COLUMN IF EXISTS privacy_accepted;
    """))
    
    connection.execute(text("""
        ALTER TABLE users 
        DROP COLUMN IF EXISTS terms_accepted_at;
    """))
    
    connection.execute(text("""
        ALTER TABLE users 
        DROP COLUMN IF EXISTS privacy_accepted_at;
    """))
from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class PortfolioEntry(Base):
    __tablename__ = "portfolio_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    asset_symbol = Column(String, nullable=False, index=True)
    amount = Column(Float, nullable=False)
    purchase_price = Column(Float, nullable=False)
    purchase_date = Column(DateTime(timezone=True), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="portfolio_entries")

class AssetPrice(Base):
    __tablename__ = "asset_prices"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, unique=True, nullable=False, index=True)
    current_price = Column(Float, nullable=False)
    price_change_24h = Column(Float, nullable=True)
    price_change_percent_24h = Column(Float, nullable=True)
    market_cap = Column(Float, nullable=True)
    volume_24h = Column(Float, nullable=True)
    last_updated = Column(DateTime(timezone=True), server_default=func.now())
    
class MarketIndex(Base):
    __tablename__ = "market_indices"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, unique=True, nullable=False, index=True)  # BTC, NASDAQ, BIST100
    name = Column(String, nullable=False)
    current_value = Column(Float, nullable=False)
    change_percent = Column(Float, nullable=True)
    last_updated = Column(DateTime(timezone=True), server_default=func.now())

class PortfolioSnapshot(Base):
    __tablename__ = "portfolio_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    total_value = Column(Float, nullable=False)
    total_invested = Column(Float, nullable=False)
    profit_loss = Column(Float, nullable=False)
    profit_loss_percent = Column(Float, nullable=False)
    snapshot_date = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="portfolio_snapshots")
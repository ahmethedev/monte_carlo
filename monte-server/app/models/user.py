from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    simulations = relationship("SimulationRecord", back_populates="user")
    subscriptions = relationship("UserSubscription", back_populates="user")
    trading_data = relationship("TradingData", back_populates="user")
    trading_analyses = relationship("TradingAnalysis", back_populates="user")
    portfolio_entries = relationship("PortfolioEntry", back_populates="user")
    portfolio_snapshots = relationship("PortfolioSnapshot", back_populates="user")

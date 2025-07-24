from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Text, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum

class TradingSide(enum.Enum):
    BUY = "BUY"
    SELL = "SELL"

class TradingPlatform(enum.Enum):
    BINANCE = "BINANCE"
    BYBIT = "BYBIT"
    OKEX = "OKEX"
    KUCOIN = "KUCOIN"

class TradingData(Base):
    __tablename__ = "trading_data"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Trade Details
    symbol = Column(String, nullable=False)  # BTCUSDT, ETHUSDT etc.
    side = Column(Enum(TradingSide), nullable=False)  # BUY/SELL
    quantity = Column(Float, nullable=False)
    price = Column(Float, nullable=False)
    quote_quantity = Column(Float, nullable=False)  # quantity * price
    
    # Fees and Costs
    commission = Column(Float, default=0.0)
    commission_asset = Column(String)  # BNB, USDT etc.
    
    # Timing
    trade_time = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Platform Info
    platform = Column(Enum(TradingPlatform), nullable=False)
    trade_id = Column(String)  # Platform specific trade ID
    order_id = Column(String)  # Platform specific order ID
    
    # Additional Data (JSON format for platform-specific fields)
    extra_data = Column(Text)  # JSON string for extra platform-specific data
    
    # Relationships
    user = relationship("User", back_populates="trading_data")

class TradingAnalysis(Base):
    __tablename__ = "trading_analysis"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Analysis Results
    analysis_text = Column(Text, nullable=False)  # LLM generated analysis
    metrics = Column(Text)  # JSON string with calculated metrics
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    data_period_start = Column(DateTime(timezone=True))
    data_period_end = Column(DateTime(timezone=True))
    total_trades_analyzed = Column(Integer)
    
    # Relationships
    user = relationship("User", back_populates="trading_analyses")
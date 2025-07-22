from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON, Boolean, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class SimulationRecord(Base):
    __tablename__ = "simulations"
    
    id = Column(Integer, primary_key=True, index=True)
    simulation_id = Column(String, unique=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    
    # Relationship
    user = relationship("User", back_populates="simulations")
    
    # Simulation parameters
    initial_balance = Column(Float, nullable=False)
    risk_per_trade_percent = Column(Float, nullable=False)
    risk_reward_ratio = Column(Float, nullable=False)
    max_trades_per_day = Column(Integer, nullable=False)
    monthly_cashout_percent = Column(Float, default=0.0)
    win_rate = Column(Float, nullable=False)
    simulation_days = Column(Integer, nullable=False)
    
    # Results
    final_balance = Column(Float, nullable=True)
    total_pnl = Column(Float, nullable=True)
    max_drawdown = Column(Float, nullable=True)
    total_trades = Column(Integer, nullable=True)
    win_rate_actual = Column(Float, nullable=True)
    sharpe_ratio = Column(Float, nullable=True)
    profit_factor = Column(Float, nullable=True)
    
    # Detailed results (JSON)
    daily_results = Column(JSON, nullable=True)
    metrics = Column(JSON, nullable=True)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_completed = Column(Boolean, default=False)
    
    def to_dict(self):
        return {
            "id": self.id,
            "simulation_id": self.simulation_id,
            "name": self.name,
            "description": self.description,
            "initial_balance": self.initial_balance,
            "risk_per_trade_percent": self.risk_per_trade_percent,
            "risk_reward_ratio": self.risk_reward_ratio,
            "max_trades_per_day": self.max_trades_per_day,
            "monthly_cashout_percent": self.monthly_cashout_percent,
            "win_rate": self.win_rate,
            "simulation_days": self.simulation_days,
            "final_balance": self.final_balance,
            "total_pnl": self.total_pnl,
            "max_drawdown": self.max_drawdown,
            "total_trades": self.total_trades,
            "win_rate_actual": self.win_rate_actual,
            "sharpe_ratio": self.sharpe_ratio,
            "profit_factor": self.profit_factor,
            "daily_results": self.daily_results,
            "metrics": self.metrics,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "is_completed": self.is_completed
        }


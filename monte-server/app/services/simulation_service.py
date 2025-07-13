from sqlalchemy.orm import Session
from app.models.simulation import SimulationRecord
from typing import List, Dict, Optional
from datetime import datetime

class SimulationService:
    def __init__(self, db: Session):
        self.db = db
    
    async def create_simulation(self, data: Dict) -> SimulationRecord:
        """Create a new simulation record"""
        simulation = SimulationRecord(
            simulation_id=data["simulation_id"],
            name=data.get("name"),
            description=data.get("description"),
            initial_balance=data["initial_balance"],
            risk_per_trade_percent=data["risk_per_trade_percent"],
            risk_reward_ratio=data["risk_reward_ratio"],
            max_trades_per_day=data["max_trades_per_day"],
            monthly_cashout_percent=data.get("monthly_cashout_percent", 0.0),
            win_rate=data["win_rate"],
            simulation_days=data["simulation_days"]
        )
        
        self.db.add(simulation)
        self.db.commit()
        self.db.refresh(simulation)
        return simulation
    
    async def save_simulation(self, data: Dict) -> SimulationRecord:
        """Save complete simulation results"""
        simulation = self.db.query(SimulationRecord).filter(
            SimulationRecord.simulation_id == data["simulation_id"]
        ).first()
        
        if not simulation:
            simulation = await self.create_simulation(data)
        
        # Update with results
        metrics = data.get("metrics", {})
        simulation.final_balance = metrics.get("final_balance")
        simulation.total_pnl = metrics.get("total_pnl")
        simulation.max_drawdown = metrics.get("max_drawdown")
        simulation.total_trades = metrics.get("total_trades")
        simulation.win_rate_actual = metrics.get("overall_win_rate")
        simulation.sharpe_ratio = metrics.get("sharpe_ratio")
        simulation.profit_factor = metrics.get("profit_factor")
        simulation.daily_results = data.get("daily_results", [])
        simulation.metrics = metrics
        simulation.is_completed = True
        simulation.updated_at = datetime.now()
        
        self.db.commit()
        self.db.refresh(simulation)
        return simulation
    
    async def get_simulation(self, simulation_id: str) -> Optional[SimulationRecord]:
        """Get simulation by ID"""
        return self.db.query(SimulationRecord).filter(
            SimulationRecord.simulation_id == simulation_id
        ).first()
    
    async def get_all_simulations(self) -> List[SimulationRecord]:
        """Get all saved simulations"""
        return self.db.query(SimulationRecord).order_by(
            SimulationRecord.created_at.desc()
        ).all()
    
    async def delete_simulation(self, simulation_id: str) -> bool:
        """Delete simulation"""
        simulation = await self.get_simulation(simulation_id)
        if simulation:
            self.db.delete(simulation)
            self.db.commit()
            return True
        return False
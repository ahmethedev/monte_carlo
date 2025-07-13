from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import asyncio
import json
from datetime import datetime
import uuid
from contextlib import asynccontextmanager
from app.core.monte_carlo_simulator import (
    MonteCarloTradingSimulator, 
    TradeParameters, 
    DailyResult, 
    SimulationMetrics
)
from app.core.database import get_db, create_tables
from app.models.simulation import SimulationRecord
from app.services.simulation_service import SimulationService

# Pydantic models for API
class SimulationRequest(BaseModel):
    initial_balance: float = Field(..., gt=0, description="Initial trading balance")
    risk_per_trade_percent: float = Field(..., gt=0, le=10, description="Risk per trade as percentage of balance")
    risk_reward_ratio: float = Field(..., gt=0, description="Risk to reward ratio")
    max_trades_per_day: int = Field(..., gt=0, le=50, description="Maximum trades per day")
    monthly_cashout_percent: float = Field(0, ge=0, le=100, description="Monthly profit realization percentage")
    win_rate: float = Field(0.55, gt=0, lt=1, description="Expected win rate")
    simulation_days: int = Field(365, gt=0, le=1095, description="Number of days to simulate")
    
    class Config:
        schema_extra = {
            "example": {
                "initial_balance": 10000,
                "risk_per_trade_percent": 1.0,
                "risk_reward_ratio": 2.0,
                "max_trades_per_day": 3,
                "monthly_cashout_percent": 10.0,
                "win_rate": 0.55,
                "simulation_days": 365
            }
        }

class SimulationResponse(BaseModel):
    simulation_id: str
    status: str
    message: str

class DailyResultResponse(BaseModel):
    date: datetime
    starting_balance: float
    ending_balance: float
    trades_taken: int
    wins: int
    losses: int
    daily_pnl: float
    win_rate: float
    cumulative_pnl: float
    drawdown: float
    max_drawdown_to_date: float

class SimulationMetricsResponse(BaseModel):
    total_trades: int
    total_wins: int
    total_losses: int
    overall_win_rate: float
    total_pnl: float
    max_drawdown: float
    max_drawdown_duration: int
    longest_winning_streak: int
    longest_losing_streak: int
    total_cashout: float
    final_balance: float
    sharpe_ratio: float
    profit_factor: float
    average_win: float
    average_loss: float
    largest_win: float
    largest_loss: float

class SimulationControlRequest(BaseModel):
    action: str  # "pause", "resume", "stop", "speed_up", "slow_down"

# Global simulation manager
class SimulationManager:
    def __init__(self):
        self.active_simulations: Dict[str, Dict] = {}
        self.websocket_connections: Dict[str, WebSocket] = {}
    
    async def start_simulation(self, simulation_id: str, params: TradeParameters, websocket: WebSocket):
        """Start a new simulation"""
        simulator = MonteCarloTradingSimulator(params)
        
        self.active_simulations[simulation_id] = {
            "simulator": simulator,
            "status": "running",
            "speed": 1.0,
            "current_day": 0,
            "task": None
        }
        
        self.websocket_connections[simulation_id] = websocket
        
        # Create progress callback
        async def progress_callback(day: int, daily_result: DailyResult):
            self.active_simulations[simulation_id]["current_day"] = day
            
            # Send real-time update to frontend
            await websocket.send_json({
                "type": "daily_update",
                "day": day,
                "data": {
                    "date": daily_result.date.isoformat(),
                    "starting_balance": daily_result.starting_balance,
                    "ending_balance": daily_result.ending_balance,
                    "trades_taken": daily_result.trades_taken,
                    "wins": daily_result.wins,
                    "losses": daily_result.losses,
                    "daily_pnl": daily_result.daily_pnl,
                    "win_rate": daily_result.win_rate,
                    "cumulative_pnl": daily_result.cumulative_pnl,
                    "drawdown": daily_result.drawdown,
                    "max_drawdown_to_date": daily_result.max_drawdown_to_date
                }
            })
            
            # Respect simulation speed
            speed = self.active_simulations[simulation_id]["speed"]
            if speed < 1.0:
                await asyncio.sleep(0.1 / speed)
            elif speed > 1.0:
                await asyncio.sleep(0.001)  # Faster simulation
        
        # Start simulation task
        task = asyncio.create_task(simulator.run_simulation(progress_callback))
        self.active_simulations[simulation_id]["task"] = task
        
        try:
            daily_results, metrics = await task
            
            # Send final results
            await websocket.send_json({
                "type": "simulation_complete",
                "daily_results": [
                    {
                        "date": r.date.isoformat(),
                        "starting_balance": r.starting_balance,
                        "ending_balance": r.ending_balance,
                        "trades_taken": r.trades_taken,
                        "wins": r.wins,
                        "losses": r.losses,
                        "daily_pnl": r.daily_pnl,
                        "win_rate": r.win_rate,
                        "cumulative_pnl": r.cumulative_pnl,
                        "drawdown": r.drawdown,
                        "max_drawdown_to_date": r.max_drawdown_to_date
                    } for r in daily_results
                ],
                "metrics": {
                    "total_trades": metrics.total_trades,
                    "total_wins": metrics.total_wins,
                    "total_losses": metrics.total_losses,
                    "overall_win_rate": metrics.overall_win_rate,
                    "total_pnl": metrics.total_pnl,
                    "max_drawdown": metrics.max_drawdown,
                    "max_drawdown_duration": metrics.max_drawdown_duration,
                    "longest_winning_streak": metrics.longest_winning_streak,
                    "longest_losing_streak": metrics.longest_losing_streak,
                    "total_cashout": metrics.total_cashout,
                    "final_balance": metrics.final_balance,
                    "sharpe_ratio": metrics.sharpe_ratio,
                    "profit_factor": metrics.profit_factor,
                    "average_win": metrics.average_win,
                    "average_loss": metrics.average_loss,
                    "largest_win": metrics.largest_win,
                    "largest_loss": metrics.largest_loss
                }
            })
            
        except asyncio.CancelledError:
            await websocket.send_json({
                "type": "simulation_stopped",
                "message": "Simulation was cancelled"
            })
        finally:
            # Clean up
            if simulation_id in self.active_simulations:
                del self.active_simulations[simulation_id]
            if simulation_id in self.websocket_connections:
                del self.websocket_connections[simulation_id]
    
    async def control_simulation(self, simulation_id: str, action: str):
        """Control running simulation"""
        if simulation_id not in self.active_simulations:
            raise HTTPException(status_code=404, detail="Simulation not found")
        
        simulation = self.active_simulations[simulation_id]
        
        if action == "pause":
            simulation["status"] = "paused"
            if simulation["task"]:
                simulation["task"].cancel()
        elif action == "resume":
            simulation["status"] = "running"
            # Resume logic would be more complex in real implementation
        elif action == "stop":
            simulation["status"] = "stopped"
            if simulation["task"]:
                simulation["task"].cancel()
        elif action == "speed_up":
            simulation["speed"] = min(simulation["speed"] * 2, 10.0)
        elif action == "slow_down":
            simulation["speed"] = max(simulation["speed"] / 2, 0.1)
        
        return {"status": "success", "new_speed": simulation["speed"]}

# Initialize simulation manager
simulation_manager = SimulationManager()

# Lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await create_tables()
    yield
    # Shutdown
    pass

# Create FastAPI app
app = FastAPI(
    title="Trading Monte Carlo Simulator",
    description="Professional trading simulation and analysis platform",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# API Routes
@app.get("/")
async def root():
    return {"message": "Trading Monte Carlo Simulator API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}

@app.post("/simulation/start", response_model=SimulationResponse)
async def start_simulation(request: SimulationRequest):
    """Start a new Monte Carlo simulation"""
    simulation_id = str(uuid.uuid4())
    
    # Convert request to TradeParameters
    params = TradeParameters(
        initial_balance=request.initial_balance,
        risk_per_trade_percent=request.risk_per_trade_percent,
        risk_reward_ratio=request.risk_reward_ratio,
        max_trades_per_day=request.max_trades_per_day,
        monthly_cashout_percent=request.monthly_cashout_percent,
        win_rate=request.win_rate,
        simulation_days=request.simulation_days
    )
    
    return SimulationResponse(
        simulation_id=simulation_id,
        status="created",
        message="Simulation created. Connect via WebSocket to start."
    )

@app.post("/simulation/{simulation_id}/control")
async def control_simulation(simulation_id: str, control: SimulationControlRequest):
    """Control running simulation"""
    result = await simulation_manager.control_simulation(simulation_id, control.action)
    return result

@app.get("/simulation/{simulation_id}/status")
async def get_simulation_status(simulation_id: str):
    """Get current simulation status"""
    if simulation_id not in simulation_manager.active_simulations:
        raise HTTPException(status_code=404, detail="Simulation not found")
    
    simulation = simulation_manager.active_simulations[simulation_id]
    return {
        "simulation_id": simulation_id,
        "status": simulation["status"],
        "speed": simulation["speed"],
        "current_day": simulation["current_day"]
    }

@app.websocket("/simulation/{simulation_id}/ws")
async def websocket_endpoint(websocket: WebSocket, simulation_id: str):
    """WebSocket endpoint for real-time simulation updates"""
    await websocket.accept()
    
    try:
        # Wait for start message
        data = await websocket.receive_json()
        if data.get("type") != "start_simulation":
            await websocket.send_json({"error": "Expected start_simulation message"})
            return
        
        # Get simulation parameters
        params_data = data.get("params")
        if not params_data:
            await websocket.send_json({"error": "Missing simulation parameters"})
            return
        
        params = TradeParameters(**params_data)
        
        # Start simulation
        await simulation_manager.start_simulation(simulation_id, params, websocket)
        
    except WebSocketDisconnect:
        print(f"WebSocket disconnected for simulation {simulation_id}")
    except Exception as e:
        await websocket.send_json({"error": str(e)})
    finally:
        # Clean up
        if simulation_id in simulation_manager.active_simulations:
            simulation = simulation_manager.active_simulations[simulation_id]
            if simulation["task"]:
                simulation["task"].cancel()

# Database routes (for saving/loading simulations)
@app.get("/simulations")
async def get_saved_simulations(db=Depends(get_db)):
    """Get saved simulation records"""
    service = SimulationService(db)
    return await service.get_all_simulations()

@app.post("/simulations/save")
async def save_simulation(data: dict, db=Depends(get_db)):
    """Save simulation results to database"""
    service = SimulationService(db)
    return await service.save_simulation(data)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
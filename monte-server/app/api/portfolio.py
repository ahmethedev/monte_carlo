from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from app.core.database import get_db
from app.services.portfolio_service import PortfolioService
from app.services.auth_service import get_current_user
from app.models.user import User

router = APIRouter(prefix="/portfolio", tags=["portfolio"])

# Pydantic models for request/response
class PortfolioEntryCreate(BaseModel):
    asset_symbol: str = Field(..., min_length=1, max_length=10)
    amount: float = Field(..., gt=0)
    purchase_price: float = Field(..., gt=0)
    purchase_date: datetime
    notes: Optional[str] = None

class PortfolioEntryUpdate(BaseModel):
    asset_symbol: Optional[str] = None
    amount: Optional[float] = Field(None, gt=0)
    purchase_price: Optional[float] = Field(None, gt=0)
    purchase_date: Optional[datetime] = None
    notes: Optional[str] = None

class PortfolioEntryResponse(BaseModel):
    id: int
    asset_symbol: str
    amount: float
    purchase_price: float
    purchase_date: datetime
    notes: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class PortfolioSummaryResponse(BaseModel):
    total_invested: float
    current_value: float
    total_profit_loss: float
    total_profit_loss_percent: float
    number_of_assets: int
    last_updated: str

class AssetAllocationResponse(BaseModel):
    asset: str
    total_amount: float
    total_invested: float
    current_value: float
    current_price: float
    profit_loss: float
    profit_loss_percent: float
    percentage_of_portfolio: float

class PerformanceDataResponse(BaseModel):
    date: str
    portfolio_value: float
    btc_price: Optional[float]
    nasdaq_value: Optional[float]
    bist_value: Optional[float]

@router.post("/entries", response_model=PortfolioEntryResponse)
async def create_portfolio_entry(
    entry_data: PortfolioEntryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new portfolio entry"""
    portfolio_service = PortfolioService(db)
    
    try:
        entry = portfolio_service.create_portfolio_entry(
            user_id=current_user.id,
            asset_symbol=entry_data.asset_symbol,
            amount=entry_data.amount,
            purchase_price=entry_data.purchase_price,
            purchase_date=entry_data.purchase_date,
            notes=entry_data.notes
        )
        return entry
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error creating portfolio entry: {str(e)}"
        )

@router.get("/entries", response_model=List[PortfolioEntryResponse])
async def get_portfolio_entries(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all portfolio entries for the current user"""
    portfolio_service = PortfolioService(db)
    entries = portfolio_service.get_user_portfolio_entries(current_user.id)
    return entries

@router.put("/entries/{entry_id}", response_model=PortfolioEntryResponse)
async def update_portfolio_entry(
    entry_id: int,
    entry_data: PortfolioEntryUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a portfolio entry"""
    portfolio_service = PortfolioService(db)
    
    # Filter out None values
    update_data = {k: v for k, v in entry_data.dict().items() if v is not None}
    
    entry = portfolio_service.update_portfolio_entry(
        entry_id=entry_id,
        user_id=current_user.id,
        **update_data
    )
    
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio entry not found"
        )
    
    return entry

@router.delete("/entries/{entry_id}")
async def delete_portfolio_entry(
    entry_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a portfolio entry"""
    portfolio_service = PortfolioService(db)
    
    success = portfolio_service.delete_portfolio_entry(
        entry_id=entry_id,
        user_id=current_user.id
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio entry not found"
        )
    
    return {"message": "Portfolio entry deleted successfully"}

@router.get("/summary", response_model=PortfolioSummaryResponse)
async def get_portfolio_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get portfolio summary with current values"""
    portfolio_service = PortfolioService(db)
    
    try:
        summary = portfolio_service.get_portfolio_summary(current_user.id)
        return summary
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching portfolio summary: {str(e)}"
        )

@router.get("/allocation", response_model=List[AssetAllocationResponse])
async def get_portfolio_allocation(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get portfolio asset allocation"""
    portfolio_service = PortfolioService(db)
    
    try:
        allocation = portfolio_service.get_portfolio_allocation(current_user.id)
        return allocation
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching portfolio allocation: {str(e)}"
        )

@router.get("/performance", response_model=List[PerformanceDataResponse])
async def get_portfolio_performance(
    days: int = 30,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get portfolio performance data"""
    portfolio_service = PortfolioService(db)
    performance = portfolio_service.get_portfolio_performance(current_user.id, days)
    return performance

@router.post("/snapshot")
async def create_portfolio_snapshot(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a portfolio snapshot for historical tracking"""
    portfolio_service = PortfolioService(db)
    
    try:
        snapshot = portfolio_service.create_portfolio_snapshot(current_user.id)
        return {
            "message": "Portfolio snapshot created successfully",
            "snapshot_id": snapshot.id,
            "total_value": snapshot.total_value
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error creating portfolio snapshot: {str(e)}"
        )

@router.get("/assets/{symbol}/price")
async def get_asset_price(
    symbol: str,
    db: Session = Depends(get_db)
):
    """Get current price for an asset"""
    portfolio_service = PortfolioService(db)
    price = portfolio_service.get_current_asset_price(symbol)
    
    if price is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Price not found for asset: {symbol}"
        )
    
    return {
        "symbol": symbol.upper(),
        "current_price": price,
        "last_updated": datetime.now().isoformat()
    }
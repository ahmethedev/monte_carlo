from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from app.core.database import get_db
from app.services.auth_service import get_current_user
from app.models.user import User
from app.utils.decorators import pro_required

router = APIRouter(prefix="/journal", tags=["journal"])

# Pydantic models
class JournalEntryCreate(BaseModel):
    title: str
    content: str
    trade_date: Optional[datetime] = None
    symbol: Optional[str] = None
    entry_price: Optional[float] = None
    exit_price: Optional[float] = None
    position_size: Optional[float] = None
    pnl: Optional[float] = None
    notes: Optional[str] = None

class JournalEntryResponse(BaseModel):
    id: int
    title: str
    content: str
    trade_date: Optional[datetime]
    symbol: Optional[str]
    entry_price: Optional[float]
    exit_price: Optional[float]
    position_size: Optional[float]
    pnl: Optional[float]
    notes: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]

@router.get("/entries", response_model=List[JournalEntryResponse])
@pro_required("journal")
async def get_journal_entries(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all journal entries for the current user (Pro feature)"""
    # Journal entries implementation will be added later
    # For now, return empty list with pro access confirmed
    return []

@router.post("/entries", response_model=JournalEntryResponse)
@pro_required("journal")
async def create_journal_entry(
    entry: JournalEntryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new journal entry (Pro feature)"""
    # Journal entry creation implementation will be added later
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Journal entry creation not yet implemented"
    )

@router.get("/subscription-info")
async def get_subscription_info(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get subscription information for journal access"""
    from app.services.subscription_service import SubscriptionService
    
    has_journal_access = SubscriptionService.has_feature_access(db, current_user.id, "journal")
    user_plan = SubscriptionService.get_user_plan(db, current_user.id)
    subscription = SubscriptionService.get_user_subscription(db, current_user.id)
    
    return {
        "has_journal_access": has_journal_access,
        "current_plan": user_plan,
        "subscription_status": subscription.status if subscription else "free",
        "expires_at": subscription.expires_at.isoformat() if subscription and subscription.expires_at else None
    }
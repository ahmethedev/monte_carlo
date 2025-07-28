from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime
from app.core.database import get_db
from app.services.auth_service import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user
)
from app.models.user import User
from app.models.subscription import SubscriptionPlan
from app.services.subscription_service import SubscriptionService
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["auth"])

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    terms_accepted: bool = False
    privacy_accepted: bool = False

class Token(BaseModel):
    access_token: str
    token_type: str

@router.post("/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user_by_email = db.query(User).filter(User.email == user.email).first()
    if existing_user_by_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    existing_user_by_username = db.query(User).filter(User.username == user.username).first()
    if existing_user_by_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    hashed_password = get_password_hash(user.password)
    current_time = datetime.utcnow() if user.terms_accepted and user.privacy_accepted else None
    
    db_user = User(
        username=user.username, 
        email=user.email, 
        hashed_password=hashed_password,
        terms_accepted=user.terms_accepted,
        privacy_accepted=user.privacy_accepted,
        terms_accepted_at=current_time if user.terms_accepted else None,
        privacy_accepted_at=current_time if user.privacy_accepted else None
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/token", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me")
async def read_users_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Subscription bilgilerini al
    subscription = SubscriptionService.get_user_subscription(db, current_user.id)
    
    plan_name = "free"
    plan_display_name = "Free Plan"
    subscription_status = "inactive"
    
    if subscription:
        plan = db.query(SubscriptionPlan).filter(
            SubscriptionPlan.id == subscription.plan_id
        ).first()
        if plan:
            plan_name = plan.name
            plan_display_name = plan.display_name
        subscription_status = subscription.status
    
    return {
        "username": current_user.username, 
        "email": current_user.email,
        "subscription": {
            "plan": plan_name,
            "plan_display_name": plan_display_name,
            "status": subscription_status,
            "is_pro": plan_name == "pro" and subscription_status == "active"
        }
    }

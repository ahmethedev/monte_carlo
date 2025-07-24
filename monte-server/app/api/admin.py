from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta
from typing import Optional

from app.core.database import get_db
from app.models.user import User
from app.models.subscription import SubscriptionPlan, UserSubscription
from app.services.subscription_service import SubscriptionService

router = APIRouter(prefix="/admin", tags=["admin"])

@router.post("/make-user-pro")
async def make_user_pro(
    username: str, 
    trial_days: int = 0,
    db: Session = Depends(get_db)
):
    """
    Bir kullanıcıyı manuel olarak Pro yapar (test amaçlı)
    """
    
    # Kullanıcıyı bul
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User '{username}' not found"
        )
    
    # Pro planını bul
    pro_plan = db.query(SubscriptionPlan).filter(
        SubscriptionPlan.name == "pro"
    ).first()
    
    if not pro_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pro plan not found"
        )
    
    # Mevcut aktif subscription'ları iptal et
    existing_subscriptions = db.query(UserSubscription).filter(
        UserSubscription.user_id == user.id,
        UserSubscription.status == "active"
    ).all()
    
    for sub in existing_subscriptions:
        sub.status = "cancelled"
    
    # Yeni Pro subscription oluştur
    expires_at = None
    if trial_days > 0:
        expires_at = datetime.now(timezone.utc) + timedelta(days=trial_days)
    
    new_subscription = UserSubscription(
        user_id=user.id,
        plan_id=pro_plan.id,
        status="active",
        expires_at=expires_at,
        stripe_customer_id=f"test_customer_{user.id}",
        stripe_subscription_id=f"test_sub_{user.id}_{datetime.now().timestamp()}"
    )
    
    db.add(new_subscription)
    db.commit()
    db.refresh(new_subscription)
    
    return {
        "message": f"User '{username}' successfully upgraded to Pro",
        "user_id": user.id,
        "plan": "pro",
        "status": "active",
        "expires_at": expires_at.isoformat() if expires_at else None,
        "trial_days": trial_days if trial_days > 0 else None
    }

@router.post("/make-user-free")
async def make_user_free(
    username: str,
    db: Session = Depends(get_db)
):
    """
    Bir kullanıcıyı Free plana döndürür
    """
    
    # Kullanıcıyı bul
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User '{username}' not found"
        )
    
    # Tüm aktif subscription'ları iptal et
    existing_subscriptions = db.query(UserSubscription).filter(
        UserSubscription.user_id == user.id,
        UserSubscription.status == "active"
    ).all()
    
    for sub in existing_subscriptions:
        sub.status = "cancelled"
    
    db.commit()
    
    return {
        "message": f"User '{username}' downgraded to Free plan",
        "user_id": user.id,
        "plan": "free",
        "status": "inactive"
    }

@router.get("/user-subscription/{username}")
async def get_user_subscription_admin(
    username: str,
    db: Session = Depends(get_db)
):
    """
    Kullanıcının subscription durumunu admin olarak görüntüle
    """
    
    # Kullanıcıyı bul
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User '{username}' not found"
        )
    
    # Subscription'ı bul
    subscription = SubscriptionService.get_user_subscription(db, user.id)
    
    if not subscription:
        return {
            "username": username,
            "user_id": user.id,
            "plan": "free",
            "status": "inactive",
            "created_at": user.created_at.isoformat(),
            "subscription": None
        }
    
    # Plan bilgisini al
    plan = db.query(SubscriptionPlan).filter(
        SubscriptionPlan.id == subscription.plan_id
    ).first()
    
    return {
        "username": username,
        "user_id": user.id,
        "plan": plan.name if plan else "unknown",
        "plan_display_name": plan.display_name if plan else "Unknown",
        "status": subscription.status,
        "created_at": user.created_at.isoformat(),
        "subscription": {
            "id": subscription.id,
            "starts_at": subscription.starts_at.isoformat(),
            "expires_at": subscription.expires_at.isoformat() if subscription.expires_at else None,
            "stripe_customer_id": subscription.stripe_customer_id,
            "stripe_subscription_id": subscription.stripe_subscription_id,
            "created_at": subscription.created_at.isoformat(),
            "updated_at": subscription.updated_at.isoformat() if subscription.updated_at else None
        }
    }

@router.get("/users")
async def list_users(
    limit: int = 10,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """
    Tüm kullanıcıları listele
    """
    
    users = db.query(User).offset(offset).limit(limit).all()
    total_users = db.query(User).count()
    
    user_list = []
    for user in users:
        subscription = SubscriptionService.get_user_subscription(db, user.id)
        plan_name = "free"
        status = "inactive"
        
        if subscription:
            plan = db.query(SubscriptionPlan).filter(
                SubscriptionPlan.id == subscription.plan_id
            ).first()
            plan_name = plan.name if plan else "unknown"
            status = subscription.status
        
        user_list.append({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "plan": plan_name,
            "status": status,
            "created_at": user.created_at.isoformat()
        })
    
    return {
        "users": user_list,
        "total": total_users,
        "has_more": offset + limit < total_users
    }
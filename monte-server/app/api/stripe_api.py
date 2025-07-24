import os
import json
import stripe
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from typing import Dict, Any

from app.core.database import get_db
from app.models.user import User
from app.models.subscription import SubscriptionPlan
from app.services.auth_service import get_current_user
from app.services.stripe_service import StripeService
from app.services.subscription_service import SubscriptionService

router = APIRouter(prefix="/stripe", tags=["stripe"])

# Stripe webhook endpoint secret
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

@router.post("/create-checkout-session")
async def create_checkout_session(
    plan_name: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Stripe Checkout session oluştur"""
    
    if plan_name not in ['pro']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid plan name"
        )
    
    try:
        # Success ve cancel URL'leri (frontend'den gelecek)
        success_url = f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/subscription/success?session_id={{CHECKOUT_SESSION_ID}}"
        cancel_url = f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/subscription/cancel"
        
        checkout_data = StripeService.create_checkout_session(
            db=db,
            user_id=current_user.id,
            plan_name=plan_name,
            success_url=success_url,
            cancel_url=cancel_url,
            trial_days=14  # 14 günlük trial
        )
        
        return {
            "checkout_url": checkout_data["checkout_url"],
            "session_id": checkout_data["session_id"]
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Checkout session creation failed: {str(e)}"
        )

@router.post("/create-portal-session")
async def create_portal_session(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Customer portal session oluştur (subscription management)"""
    
    try:
        # User'ın Stripe customer ID'sini al
        subscription = SubscriptionService.get_user_subscription(db, current_user.id)
        
        if not subscription or not subscription.stripe_customer_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No active subscription found"
            )
        
        return_url = f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/subscription"
        
        portal_url = StripeService.create_customer_portal_session(
            customer_id=subscription.stripe_customer_id,
            return_url=return_url
        )
        
        return {"portal_url": portal_url}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Portal session creation failed: {str(e)}"
        )

@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    db: Session = Depends(get_db)
):
    """Stripe webhook endpoint"""
    
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    
    if not STRIPE_WEBHOOK_SECRET:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Webhook secret not configured"
        )
    
    try:
        # Webhook signature'ını doğrula
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid payload"
        )
    except stripe.error.SignatureVerificationError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid signature"
        )
    
    # Webhook event'ini handle et
    success = StripeService.handle_webhook_event(event, db)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Webhook processing failed"
        )
    
    return {"status": "success"}

@router.get("/subscription-status")
async def get_subscription_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Kullanıcının subscription durumunu getir"""
    
    try:
        subscription = SubscriptionService.get_user_subscription(db, current_user.id)
        
        if not subscription:
            return {
                "plan": "free",
                "status": "inactive",
                "expires_at": None,
                "trial_end": None,
                "cancel_at_period_end": False
            }
        
        # Stripe'dan güncel bilgileri al (sadece gerçek Stripe subscription'lar için)
        stripe_details = None
        if subscription.stripe_subscription_id and not subscription.stripe_subscription_id.startswith("test_sub_"):
            stripe_details = StripeService.get_subscription_details(
                subscription.stripe_subscription_id
            )
        
        plan = db.query(SubscriptionPlan).filter(
            SubscriptionPlan.id == subscription.plan_id
        ).first()
        
        return {
            "plan": plan.name if plan else "free",
            "plan_display_name": plan.display_name if plan else "Free Plan",
            "status": subscription.status,
            "expires_at": subscription.expires_at.isoformat() if subscription.expires_at else None,
            "trial_end": stripe_details.get("trial_end").isoformat() if stripe_details and stripe_details.get("trial_end") else None,
            "cancel_at_period_end": stripe_details.get("cancel_at_period_end", False) if stripe_details else False,
            "current_period_end": stripe_details.get("current_period_end").isoformat() if stripe_details and stripe_details.get("current_period_end") else None
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get subscription status: {str(e)}"
        )

@router.post("/cancel-subscription")
async def cancel_subscription(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Subscription'ı iptal et"""
    
    try:
        subscription = SubscriptionService.get_user_subscription(db, current_user.id)
        
        if not subscription or not subscription.stripe_subscription_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No active subscription found"
            )
        
        # Stripe'da iptal et (period sonunda)
        success = StripeService.cancel_subscription(subscription.stripe_subscription_id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to cancel subscription"
            )
        
        return {"message": "Subscription will be cancelled at the end of the current period"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Subscription cancellation failed: {str(e)}"
        )

@router.get("/plans")
async def get_subscription_plans(db: Session = Depends(get_db)):
    """Mevcut subscription planlarını getir"""
    
    try:
        plans = db.query(SubscriptionPlan).filter(
            SubscriptionPlan.is_active == True
        ).all()
        
        return {
            "plans": [
                {
                    "id": plan.id,
                    "name": plan.name,
                    "display_name": plan.display_name,
                    "price": float(plan.price),
                    "features": plan.features
                }
                for plan in plans
            ]
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get subscription plans: {str(e)}"
        )
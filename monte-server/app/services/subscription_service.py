from datetime import datetime, timezone
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.models.user import User
from app.models.subscription import SubscriptionPlan, UserSubscription

class SubscriptionService:
    
    @staticmethod
    def get_user_subscription(db: Session, user_id: int) -> Optional[UserSubscription]:
        """Get user's active subscription"""
        return db.query(UserSubscription).filter(
            and_(
                UserSubscription.user_id == user_id,
                UserSubscription.status == "active"
            )
        ).order_by(UserSubscription.created_at.desc()).first()
    
    @staticmethod
    def has_pro_access(db: Session, user_id: int) -> bool:
        """Check if user has pro access"""
        subscription = SubscriptionService.get_user_subscription(db, user_id)
        
        if not subscription:
            return False
        
        # Check if subscription is active and not expired
        if subscription.status != "active":
            return False
            
        if subscription.expires_at and subscription.expires_at < datetime.now(timezone.utc):
            # Mark as expired
            subscription.status = "expired"
            db.commit()
            return False
            
        # Check if it's a pro plan
        plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.id == subscription.plan_id).first()
        return plan and plan.name == "pro"
    
    @staticmethod
    def get_user_plan(db: Session, user_id: int) -> str:
        """Get user's current plan name"""
        subscription = SubscriptionService.get_user_subscription(db, user_id)
        
        if not subscription:
            return "free"
            
        plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.id == subscription.plan_id).first()
        return plan.name if plan else "free"
    
    @staticmethod
    def has_feature_access(db: Session, user_id: int, feature: str) -> bool:
        """Check if user has access to a specific feature"""
        subscription = SubscriptionService.get_user_subscription(db, user_id)
        
        if not subscription:
            # Default free plan features
            free_features = {"basic_simulation": True}
            return free_features.get(feature, False)
        
        plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.id == subscription.plan_id).first()
        if not plan or not plan.features:
            return False
            
        return plan.features.get(feature, False)
    
    @staticmethod
    def create_subscription(
        db: Session, 
        user_id: int, 
        plan_name: str,
        stripe_subscription_id: Optional[str] = None,
        stripe_customer_id: Optional[str] = None,
        expires_at: Optional[datetime] = None
    ) -> UserSubscription:
        """Create a new subscription for user"""
        
        # Get the plan
        plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.name == plan_name).first()
        if not plan:
            raise ValueError(f"Plan '{plan_name}' not found")
        
        # Cancel any existing active subscriptions
        existing_subscriptions = db.query(UserSubscription).filter(
            and_(
                UserSubscription.user_id == user_id,
                UserSubscription.status == "active"
            )
        ).all()
        
        for sub in existing_subscriptions:
            sub.status = "cancelled"
        
        # Create new subscription
        subscription = UserSubscription(
            user_id=user_id,
            plan_id=plan.id,
            status="active",
            expires_at=expires_at,
            stripe_subscription_id=stripe_subscription_id,
            stripe_customer_id=stripe_customer_id
        )
        
        db.add(subscription)
        db.commit()
        db.refresh(subscription)
        
        return subscription
    
    @staticmethod
    def initialize_default_plans(db: Session):
        """Initialize default subscription plans"""
        
        # Check if plans already exist
        existing_plans = db.query(SubscriptionPlan).count()
        if existing_plans > 0:
            return
        
        # Create free plan
        free_plan = SubscriptionPlan(
            name="free",
            display_name="Free Plan",
            price=0.00,
            features={
                "basic_simulation": True,
                "simulations_per_month": 10,
                "journal": False,
                "unlimited_simulations": False,
                "export_data": False
            }
        )
        
        # Create pro plan
        pro_plan = SubscriptionPlan(
            name="pro",
            display_name="Pro Plan",
            price=9.99,
            features={
                "basic_simulation": True,
                "simulations_per_month": -1,  # -1 means unlimited
                "journal": True,
                "unlimited_simulations": True,
                "export_data": True,
                "priority_support": True
            }
        )
        
        db.add_all([free_plan, pro_plan])
        db.commit()
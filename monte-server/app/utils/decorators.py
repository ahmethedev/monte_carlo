from functools import wraps
from fastapi import HTTPException, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.subscription_service import SubscriptionService
from app.services.auth_service import get_current_user

def pro_required(feature: str = None):
    """
    Decorator to require pro subscription for endpoint access
    
    Args:
        feature: Specific feature to check (e.g., "journal", "unlimited_simulations")
                If None, just checks for pro plan
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Extract dependencies from kwargs
            db: Session = kwargs.get('db')
            current_user = kwargs.get('current_user')
            
            if not db or not current_user:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Missing required dependencies"
                )
            
            user_id = current_user.id
            
            # Check pro access
            if feature:
                has_access = SubscriptionService.has_feature_access(db, user_id, feature)
                if not has_access:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail=f"Pro subscription required for {feature} feature"
                    )
            else:
                has_pro = SubscriptionService.has_pro_access(db, user_id)
                if not has_pro:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="Pro subscription required"
                    )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator

def subscription_info(func):
    """
    Decorator to add subscription info to response
    """
    @wraps(func)
    async def wrapper(*args, **kwargs):
        result = await func(*args, **kwargs)
        
        # Extract dependencies
        db: Session = kwargs.get('db')
        current_user = kwargs.get('current_user')
        
        if db and current_user:
            user_plan = SubscriptionService.get_user_plan(db, current_user.id)
            subscription = SubscriptionService.get_user_subscription(db, current_user.id)
            
            # Add subscription info to response if it's a dict
            if isinstance(result, dict):
                result['subscription_info'] = {
                    'plan': user_plan,
                    'expires_at': subscription.expires_at.isoformat() if subscription and subscription.expires_at else None,
                    'status': subscription.status if subscription else 'free'
                }
        
        return result
    return wrapper
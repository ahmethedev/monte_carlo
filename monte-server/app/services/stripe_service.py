import os
import stripe
from typing import Dict, Any, Optional
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.subscription import SubscriptionPlan, UserSubscription
from app.services.subscription_service import SubscriptionService

# Configure Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

class StripeService:
    """Stripe entegrasyonu için servis class'ı"""
    
    @staticmethod
    def create_customer(user: User) -> str:
        """Stripe'da customer oluştur"""
        try:
            customer = stripe.Customer.create(
                email=user.email,
                name=user.username,
                metadata={
                    'user_id': str(user.id),
                    'username': user.username
                }
            )
            return customer.id
        except Exception as e:
            raise Exception(f"Stripe customer creation failed: {str(e)}")
    
    @staticmethod
    def create_checkout_session(
        db: Session,
        user_id: int,
        plan_name: str,
        success_url: str,
        cancel_url: str,
        trial_days: int = 14
    ) -> Dict[str, Any]:
        """Stripe Checkout session oluştur"""
        
        # User ve plan bilgilerini al
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("User not found")
        
        plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.name == plan_name).first()
        if not plan:
            raise ValueError(f"Plan '{plan_name}' not found")
        
        try:
            # Customer ID'si yoksa oluştur
            stripe_customer_id = None
            existing_subscription = SubscriptionService.get_user_subscription(db, user_id)
            
            if existing_subscription and existing_subscription.stripe_customer_id:
                stripe_customer_id = existing_subscription.stripe_customer_id
            else:
                stripe_customer_id = StripeService.create_customer(user)
            
            # Checkout session parametreleri
            session_params = {
                'customer': stripe_customer_id,
                'payment_method_types': ['card'],
                'line_items': [{
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {
                            'name': plan.display_name,
                            'description': 'AI Trading Assistant Pro Plan'
                        },
                        'unit_amount': int(plan.price * 100),  # Stripe cents'te çalışır
                        'recurring': {
                            'interval': 'month'
                        }
                    },
                    'quantity': 1
                }],
                'mode': 'subscription',
                'success_url': success_url,
                'cancel_url': cancel_url,
                'metadata': {
                    'user_id': str(user_id),
                    'plan_name': plan_name
                }
            }
            
            # Trial ekle (sadece yeni müşteriler için)
            if trial_days > 0 and not existing_subscription:
                session_params['subscription_data'] = {
                    'trial_period_days': trial_days,
                    'metadata': {
                        'user_id': str(user_id),
                        'plan_name': plan_name
                    }
                }
            
            # Checkout session oluştur
            session = stripe.checkout.Session.create(**session_params)
            
            return {
                'checkout_url': session.url,
                'session_id': session.id,
                'customer_id': stripe_customer_id
            }
            
        except Exception as e:
            raise Exception(f"Stripe checkout session creation failed: {str(e)}")
    
    @staticmethod
    def create_customer_portal_session(customer_id: str, return_url: str) -> str:
        """Customer portal session oluştur (subscription management için)"""
        try:
            session = stripe.billing_portal.Session.create(
                customer=customer_id,
                return_url=return_url
            )
            return session.url
        except Exception as e:
            raise Exception(f"Stripe portal session creation failed: {str(e)}")
    
    @staticmethod
    def handle_webhook_event(event_data: Dict[str, Any], db: Session) -> bool:
        """Stripe webhook event'lerini handle et"""
        
        event_type = event_data.get('type')
        data_object = event_data.get('data', {}).get('object', {})
        
        try:
            if event_type == 'checkout.session.completed':
                return StripeService._handle_checkout_completed(data_object, db)
            
            elif event_type == 'customer.subscription.created':
                return StripeService._handle_subscription_created(data_object, db)
            
            elif event_type == 'customer.subscription.updated':
                return StripeService._handle_subscription_updated(data_object, db)
            
            elif event_type == 'customer.subscription.deleted':
                return StripeService._handle_subscription_deleted(data_object, db)
            
            elif event_type == 'invoice.payment_succeeded':
                return StripeService._handle_payment_succeeded(data_object, db)
            
            elif event_type == 'invoice.payment_failed':
                return StripeService._handle_payment_failed(data_object, db)
            
            else:
                print(f"Unhandled webhook event: {event_type}")
                return True
                
        except Exception as e:
            print(f"Webhook handling error: {str(e)}")
            return False
    
    @staticmethod
    def _handle_checkout_completed(session_data: Dict[str, Any], db: Session) -> bool:
        """Checkout completed webhook'unu handle et"""
        
        user_id = int(session_data.get('metadata', {}).get('user_id'))
        plan_name = session_data.get('metadata', {}).get('plan_name')
        customer_id = session_data.get('customer')
        subscription_id = session_data.get('subscription')
        
        if not all([user_id, plan_name, customer_id]):
            return False
        
        # Subscription oluştur/güncelle
        SubscriptionService.create_subscription(
            db=db,
            user_id=user_id,
            plan_name=plan_name,
            stripe_customer_id=customer_id,
            stripe_subscription_id=subscription_id
        )
        
        return True
    
    @staticmethod
    def _handle_subscription_created(subscription_data: Dict[str, Any], db: Session) -> bool:
        """Subscription created webhook'unu handle et"""
        
        customer_id = subscription_data.get('customer')
        subscription_id = subscription_data.get('id')
        status = subscription_data.get('status')
        
        # Customer'dan user_id'yi bul
        subscription = db.query(UserSubscription).filter(
            UserSubscription.stripe_customer_id == customer_id
        ).first()
        
        if subscription:
            subscription.stripe_subscription_id = subscription_id
            subscription.status = "active" if status == "active" else "pending"
            db.commit()
        
        return True
    
    @staticmethod
    def _handle_subscription_updated(subscription_data: Dict[str, Any], db: Session) -> bool:
        """Subscription updated webhook'unu handle et"""
        
        subscription_id = subscription_data.get('id')
        status = subscription_data.get('status')
        
        subscription = db.query(UserSubscription).filter(
            UserSubscription.stripe_subscription_id == subscription_id
        ).first()
        
        if subscription:
            # Status mapping
            if status == 'active':
                subscription.status = 'active'
            elif status in ['canceled', 'cancelled']:
                subscription.status = 'cancelled'
            elif status == 'past_due':
                subscription.status = 'active'  # Grace period
            else:
                subscription.status = 'expired'
            
            db.commit()
        
        return True
    
    @staticmethod
    def _handle_subscription_deleted(subscription_data: Dict[str, Any], db: Session) -> bool:
        """Subscription deleted webhook'unu handle et"""
        
        subscription_id = subscription_data.get('id')
        
        subscription = db.query(UserSubscription).filter(
            UserSubscription.stripe_subscription_id == subscription_id
        ).first()
        
        if subscription:
            subscription.status = 'cancelled'
            db.commit()
        
        return True
    
    @staticmethod
    def _handle_payment_succeeded(invoice_data: Dict[str, Any], db: Session) -> bool:
        """Payment succeeded webhook'unu handle et"""
        
        subscription_id = invoice_data.get('subscription')
        
        if subscription_id:
            subscription = db.query(UserSubscription).filter(
                UserSubscription.stripe_subscription_id == subscription_id
            ).first()
            
            if subscription:
                subscription.status = 'active'
                # Expiry date'i güncelle (1 ay ekle)
                subscription.expires_at = datetime.now(timezone.utc) + timedelta(days=30)
                db.commit()
        
        return True
    
    @staticmethod
    def _handle_payment_failed(invoice_data: Dict[str, Any], db: Session) -> bool:
        """Payment failed webhook'unu handle et"""
        
        subscription_id = invoice_data.get('subscription')
        
        if subscription_id:
            subscription = db.query(UserSubscription).filter(
                UserSubscription.stripe_subscription_id == subscription_id
            ).first()
            
            if subscription:
                subscription.status = 'pending'  # Grace period
                db.commit()
        
        return True
    
    @staticmethod
    def cancel_subscription(subscription_id: str) -> bool:
        """Stripe subscription'ı iptal et"""
        try:
            stripe.Subscription.modify(
                subscription_id,
                cancel_at_period_end=True
            )
            return True
        except Exception as e:
            print(f"Subscription cancellation failed: {str(e)}")
            return False
    
    @staticmethod
    def get_subscription_details(subscription_id: str) -> Optional[Dict[str, Any]]:
        """Stripe subscription detaylarını al"""
        try:
            subscription = stripe.Subscription.retrieve(subscription_id)
            return {
                'id': subscription.id,
                'status': subscription.status,
                'current_period_start': datetime.fromtimestamp(subscription.current_period_start),
                'current_period_end': datetime.fromtimestamp(subscription.current_period_end),
                'cancel_at_period_end': subscription.cancel_at_period_end,
                'trial_end': datetime.fromtimestamp(subscription.trial_end) if subscription.trial_end else None
            }
        except Exception as e:
            print(f"Failed to get subscription details: {str(e)}")
            return None
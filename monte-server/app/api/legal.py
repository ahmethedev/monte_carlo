from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from datetime import datetime
from app.core.database import get_db
from app.models.user import User
from app.services.auth_service import get_current_user
from pydantic import BaseModel

router = APIRouter()

class TermsAcceptanceRequest(BaseModel):
    accept_terms: bool
    accept_privacy: bool

class TermsStatusResponse(BaseModel):
    terms_accepted: bool
    privacy_accepted: bool
    terms_accepted_at: datetime = None
    privacy_accepted_at: datetime = None

@router.get("/terms-status")
async def get_terms_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's terms acceptance status"""
    return TermsStatusResponse(
        terms_accepted=current_user.terms_accepted,
        privacy_accepted=current_user.privacy_accepted,
        terms_accepted_at=current_user.terms_accepted_at,
        privacy_accepted_at=current_user.privacy_accepted_at
    )

@router.post("/accept-terms")
async def accept_terms(
    request: TermsAcceptanceRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Accept terms of service and privacy policy"""
    current_time = datetime.utcnow()
    
    if request.accept_terms:
        current_user.terms_accepted = True
        current_user.terms_accepted_at = current_time
    
    if request.accept_privacy:
        current_user.privacy_accepted = True
        current_user.privacy_accepted_at = current_time
    
    db.commit()
    db.refresh(current_user)
    
    return {
        "message": "Terms acceptance updated successfully",
        "terms_accepted": current_user.terms_accepted,
        "privacy_accepted": current_user.privacy_accepted
    }

@router.get("/terms-content")
async def get_terms_content():
    """Get the current terms of service content"""
    return {
        "terms_of_service": """
        # Terms of Service

        ## 1. Acceptance of Terms
        By accessing and using this trading Monte Carlo simulation platform, you accept and agree to be bound by the terms and provision of this agreement.

        ## 2. Data Usage and Analytics
        By using our service, you understand and consent that:
        - We collect and analyze your trading data to provide simulation services
        - Your trading patterns and performance data will be processed to generate Monte Carlo simulations
        - Aggregated and anonymized data may be used to improve our services
        - We do not share your personal trading data with third parties without your explicit consent

        ## 3. Service Description
        Our platform provides Monte Carlo simulation services for trading analysis, including:
        - Portfolio performance projections
        - Risk assessment calculations
        - Trading strategy backtesting
        - Statistical analysis of trading patterns

        ## 4. User Responsibilities
        You agree to:
        - Provide accurate trading data for analysis
        - Use the service for legitimate trading analysis purposes
        - Not attempt to reverse engineer or misuse our algorithms
        - Maintain the confidentiality of your account credentials

        ## 5. Data Security
        We implement industry-standard security measures to protect your data, but you acknowledge that no system is completely secure.

        ## 6. Service Availability
        We strive to maintain service availability but do not guarantee uninterrupted access.

        ## 7. Limitation of Liability
        Our simulations are for educational and analytical purposes. Trading decisions based on our analysis are your responsibility.

        ## 8. Modifications
        We reserve the right to modify these terms. Users will be notified of significant changes.

        ## 9. Termination
        Either party may terminate this agreement at any time.

        ## 10. Governing Law
        These terms are governed by applicable international laws.

        Last updated: January 2025
        """,
        "privacy_policy": """
        # Privacy Policy

        ## 1. Information We Collect
        We collect:
        - Account information (email, username)
        - Trading data you upload for analysis
        - Usage analytics and performance metrics
        - Technical data (IP address, browser information)

        ## 2. How We Use Your Information
        We use your information to:
        - Provide Monte Carlo simulation services
        - Analyze trading patterns and performance
        - Improve our algorithms and services
        - Communicate important service updates
        - Ensure platform security

        ## 3. Data Processing Legal Basis
        We process your data based on:
        - Your consent for trading data analysis
        - Contractual necessity to provide services
        - Legitimate interests in service improvement
        - Legal obligations for security and compliance

        ## 4. Data Sharing
        We do not sell your personal data. We may share:
        - Aggregated, anonymized statistics for research
        - Information required by law or legal process
        - Data with service providers under strict confidentiality agreements

        ## 5. Data Security
        We implement:
        - Encryption for data transmission and storage
        - Access controls and authentication
        - Regular security audits and updates
        - Incident response procedures

        ## 6. Your Rights
        You have the right to:
        - Access your personal data
        - Correct inaccurate information
        - Request data deletion
        - Data portability
        - Withdraw consent
        - Lodge complaints with supervisory authorities

        ## 7. Data Retention
        We retain your data:
        - Account data: Until account deletion
        - Trading data: As long as needed for service provision
        - Analytics data: Up to 3 years for service improvement

        ## 8. International Transfers
        Your data may be processed in countries with adequate data protection standards.

        ## 9. Cookies and Tracking
        We use essential cookies for service functionality and analytics cookies with your consent.

        ## 10. Contact Information
        For privacy concerns, contact us at: privacy@trading-monte-carlo.com

        Last updated: January 2025
        """
    }
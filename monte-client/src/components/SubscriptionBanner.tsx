import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Clock, AlertTriangle, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SubscriptionBanner: React.FC = () => {
  const { user, hasProAccess } = useAuth();
  const plan = user?.subscription?.plan || 'free';
  const isPro = hasProAccess();
  // Trial functionality temporarily disabled - using only plan from user data
  const isTrialActive = false;
  const trialEnd = null;
  const status = user?.subscription?.status || 'inactive';
  const navigate = useNavigate();

  // Don't show banner if user is on Pro plan and not in trial
  if (isPro && !isTrialActive) {
    return null;
  }

  // Free user banner
  if (!isPro) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Crown className="h-5 w-5" />
              <div>
                <span className="font-medium">
                  Upgrade to Pro to unlock AI Assistant and unlimited simulations
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/app/pricing')}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Trial active banner
  if (isTrialActive && trialEnd) {
    const daysLeft = Math.ceil((new Date(trialEnd).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    return (
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5" />
              <div>
                <span className="font-medium">
                  {daysLeft > 0 
                    ? `${daysLeft} days left in your Pro trial` 
                    : 'Your Pro trial ends today'
                  }
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/app/pricing')}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Continue with Pro
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Cancelled/Expired subscription banner
  if (status === 'cancelled' || status === 'expired') {
    return (
      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5" />
              <div>
                <span className="font-medium">
                  {status === 'cancelled' 
                    ? 'Your Pro subscription has been cancelled' 
                    : 'Your Pro subscription has expired'
                  }
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/app/pricing')}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Reactivate Pro
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SubscriptionBanner;
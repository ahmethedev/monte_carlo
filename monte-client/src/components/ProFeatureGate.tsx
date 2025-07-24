import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Zap, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ProFeatureGateProps {
  feature: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}

const ProFeatureGate: React.FC<ProFeatureGateProps> = ({ 
  feature, 
  title, 
  description, 
  children 
}) => {
  const { hasProAccess, isLoading } = useAuth();
  const isPro = hasProAccess();
  const navigate = useNavigate();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user has Pro access, show the actual content
  if (isPro) {
    return <>{children}</>;
  }

  // Show paywall for free users
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-8 text-center">
        {/* Pro Badge */}
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full mb-6">
          <Crown className="h-4 w-4" />
          <span className="text-sm font-semibold">PRO FEATURE</span>
        </div>

        {/* Main Content */}
        <div className="space-y-4 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Features List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 max-w-md mx-auto">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Unlock with Pro:
          </h3>
          <ul className="space-y-3 text-left">
            <li className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                AI Trading Assistant with GPT-4
              </span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Unlimited Monte Carlo simulations
              </span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Advanced trading analytics
              </span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                CSV data export
              </span>
            </li>
          </ul>
        </div>

        {/* Trial Badge */}
        <div className="inline-flex items-center space-x-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-4 py-2 rounded-full mb-6">
          <Zap className="h-4 w-4" />
          <span className="text-sm font-medium">14-day free trial</span>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/app/pricing')}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl transition-all transform hover:scale-105"
          >
            <Crown className="h-5 w-5" />
            <span>Start Free Trial</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            No credit card required • Cancel anytime
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProFeatureGate;
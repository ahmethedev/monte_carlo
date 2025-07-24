import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, ArrowRight } from 'lucide-react';

const SubscriptionCancel = () => {
  const navigate = useNavigate();

  const handleTryAgain = () => {
    navigate('/app/pricing');
  };

  const handleContinueFree = () => {
    navigate('/app/simulation');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
      <div className="max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center space-y-6">
          {/* Cancel Icon */}
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>

          {/* Cancel Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Subscription Cancelled
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              No worries! You can continue using our free plan or try upgrading again later.
            </p>
          </div>

          {/* Free Plan Features */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              Free plan includes:
            </h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>📊 10 Monte Carlo simulations per month</li>
              <li>📈 Basic performance charts</li>
              <li>🔍 Risk analysis tools</li>
              <li>📱 Full mobile support</li>
            </ul>
          </div>

          {/* Why upgrade reminder */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Missing out?</strong> Pro users get unlimited simulations, 
              AI trading insights, and advanced analytics to improve their trading performance.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleTryAgain}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Try Pro Again</span>
            </button>
            
            <button
              onClick={handleContinueFree}
              className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>Continue with Free Plan</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Support Info */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Need help? Contact us at support@tradingmontecarlo.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCancel;
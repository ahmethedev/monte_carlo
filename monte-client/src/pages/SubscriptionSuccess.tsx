import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [sessionId] = useState(searchParams.get('session_id'));

  useEffect(() => {
    // Simulate processing the successful subscription
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    navigate('/app/assistant');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Processing your subscription...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we set up your Pro account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
      <div className="max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center space-y-6">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome to Pro! 🎉
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Your subscription has been activated successfully. You now have access to all Pro features!
            </p>
          </div>

          {/* Features List */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">
              What's now available:
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>✨ AI Trading Assistant with GPT-4</li>
              <li>📊 Unlimited Monte Carlo simulations</li>
              <li>🧠 Trading psychology analysis</li>
              <li>📈 Advanced performance metrics</li>
              <li>💾 CSV data export</li>
            </ul>
          </div>

          {/* Trial Info */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>14-day free trial</strong> started today. 
              You won't be charged until {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}.
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={handleContinue}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <span>Start Using AI Assistant</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          {/* Session ID for debugging */}
          {sessionId && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Session ID: {sessionId}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;
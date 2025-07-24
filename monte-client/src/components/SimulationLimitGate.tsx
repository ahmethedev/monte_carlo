import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, BarChart3, AlertTriangle } from 'lucide-react';
import { useSubscription } from '../contexts/SubscriptionContext';

interface SimulationLimitGateProps {
  children: React.ReactNode;
}

const SimulationLimitGate: React.FC<SimulationLimitGateProps> = ({ children }) => {
  const { isPro, plan } = useSubscription();
  const [simulationCount, setSimulationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulation count'u API'den al (şimdilik mock data)
    const fetchSimulationCount = async () => {
      try {
        // TODO: Replace with actual API call to get user's monthly simulation count
        const mockCount = Math.floor(Math.random() * 15); // Mock data
        setSimulationCount(mockCount);
      } catch (error) {
        console.error('Failed to fetch simulation count:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimulationCount();
  }, []);

  // Pro users have unlimited access
  if (isPro) {
    return <>{children}</>;
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const FREE_LIMIT = 10;
  const remainingSimulations = Math.max(0, FREE_LIMIT - simulationCount);
  const isLimitReached = simulationCount >= FREE_LIMIT;

  // Show limit warning when close to limit (2+ simulations used)
  if (!isLimitReached && simulationCount >= 2) {
    return (
      <div className="space-y-4">
        {/* Warning Banner */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                {remainingSimulations === 0 
                  ? 'This is your last free simulation this month!'
                  : `${remainingSimulations} free simulations remaining this month`
                }
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                Upgrade to Pro for unlimited simulations
              </p>
            </div>
            <button
              onClick={() => navigate('/app/pricing')}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-xs font-medium"
            >
              Upgrade
            </button>
          </div>
        </div>
        
        {children}
      </div>
    );
  }

  // Show limit reached gate
  if (isLimitReached) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border border-orange-200 dark:border-orange-800 p-8 text-center">
          {/* Limit Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-6">
            <BarChart3 className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>

          {/* Main Message */}
          <div className="space-y-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Monthly Simulation Limit Reached
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              You've used all {FREE_LIMIT} free simulations this month. 
              Upgrade to Pro for unlimited simulations and advanced features.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: '100%' }}
            ></div>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            {simulationCount} / {FREE_LIMIT} simulations used
          </div>

          {/* Pro Benefits */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center justify-center space-x-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              <span>Unlock with Pro</span>
            </h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <li>✨ Unlimited Monte Carlo simulations</li>
              <li>🤖 AI Trading Assistant with GPT-4</li>
              <li>📊 Advanced analytics & insights</li>
              <li>💾 CSV data export</li>
              <li>⚡ Priority support</li>
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/app/pricing')}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
            >
              Upgrade to Pro - 14 Day Free Trial
            </button>
            
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Your limit resets next month • No credit card required for trial
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Normal simulation access
  return <>{children}</>;
};

export default SimulationLimitGate;
import React, { useState, useEffect } from 'react';
import { Check, X, Crown, Zap, Shield, BarChart3 } from 'lucide-react';

interface Plan {
  id: number;
  name: string;
  display_name: string;
  price: number;
  features: Record<string, any>;
}

const Pricing = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/stripe/plans');
      if (response.ok) {
        const data = await response.json();
        setPlans(data.plans);
      }
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planName: string) => {
    if (planName === 'free') return;
    
    setCheckoutLoading(planName);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `plan_name=${planName}`,
      });

      if (response.ok) {
        const data = await response.json();
        // Stripe Checkout'a yönlendir
        window.location.href = data.checkout_url;
      } else {
        const errorData = await response.json();
        alert(`Subscription failed: ${errorData.detail}`);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setCheckoutLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto"></div>
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const freePlan = plans.find(p => p.name === 'free');
  const proPlan = plans.find(p => p.name === 'pro');

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Choose Your Plan
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Start with our free plan and upgrade when you need advanced AI-powered trading insights
        </p>
        
        {/* Free Trial Badge */}
        <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full">
          <Zap className="h-4 w-4" />
          <span className="text-sm font-medium">14-day free trial on Pro plan</span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl">
              <BarChart3 className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {freePlan?.display_name || 'Free Plan'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Perfect for getting started</p>
            </div>
            
            <div className="space-y-2">
              <div className="text-4xl font-bold text-gray-900 dark:text-white">$0</div>
              <div className="text-gray-600 dark:text-gray-400">forever</div>
            </div>
          </div>
          
          <div className="mt-8 space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">What's included:</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  {freePlan?.features?.simulations_per_month || 10} simulations per month
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Basic Monte Carlo analysis</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Performance charts</span>
              </li>
              <li className="flex items-center space-x-3">
                <X className="h-4 w-4 text-red-500" />
                <span className="text-gray-500 dark:text-gray-500">AI Trading Assistant</span>
              </li>
              <li className="flex items-center space-x-3">
                <X className="h-4 w-4 text-red-500" />
                <span className="text-gray-500 dark:text-gray-500">Trading Journal</span>
              </li>
              <li className="flex items-center space-x-3">
                <X className="h-4 w-4 text-red-500" />
                <span className="text-gray-500 dark:text-gray-500">Data Export</span>
              </li>
            </ul>
          </div>
          
          <button
            disabled
            className="w-full mt-8 py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg font-medium cursor-not-allowed"
          >
            Current Plan
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
          {/* Popular Badge */}
          <div className="absolute top-4 right-4">
            <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
              MOST POPULAR
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl">
              <Crown className="h-6 w-6" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold">
                {proPlan?.display_name || 'Pro Plan'}
              </h3>
              <p className="text-blue-100">For serious traders</p>
            </div>
            
            <div className="space-y-2">
              <div className="text-4xl font-bold">${proPlan?.price || 19}</div>
              <div className="text-blue-100">per month</div>
              <div className="text-sm text-blue-200">14-day free trial</div>
            </div>
          </div>
          
          <div className="mt-8 space-y-4">
            <h4 className="font-semibold">Everything in Free, plus:</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                  <Check className="h-2 w-2 text-green-900" />
                </div>
                <span>Unlimited simulations</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                  <Check className="h-2 w-2 text-green-900" />
                </div>
                <span>AI Trading Assistant with GPT-4</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                  <Check className="h-2 w-2 text-green-900" />
                </div>
                <span>Trading psychology analysis</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                  <Check className="h-2 w-2 text-green-900" />
                </div>
                <span>Advanced performance metrics</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                  <Check className="h-2 w-2 text-green-900" />
                </div>
                <span>CSV data export</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                  <Shield className="h-2 w-2 text-green-900" />
                </div>
                <span>Priority support</span>
              </li>
            </ul>
          </div>
          
          <button
            onClick={() => handleSubscribe('pro')}
            disabled={checkoutLoading === 'pro'}
            className="w-full mt-8 py-3 px-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {checkoutLoading === 'pro' ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Loading...</span>
              </div>
            ) : (
              'Start Free Trial'
            )}
          </button>
          
          <div className="text-center mt-4 text-sm text-blue-200">
            No commitment • Cancel anytime
          </div>
        </div>
      </div>

      {/* Features Comparison */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Feature Comparison
        </h2>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Features
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-900 dark:text-white">
                    Free
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-900 dark:text-white">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    Monte Carlo Simulations
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">10/month</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    AI Trading Assistant
                  </td>
                  <td className="px-6 py-4 text-center">
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    Trading Psychology Analysis
                  </td>
                  <td className="px-6 py-4 text-center">
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    Data Export
                  </td>
                  <td className="px-6 py-4 text-center">
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    Priority Support
                  </td>
                  <td className="px-6 py-4 text-center">
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              How does the free trial work?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get 14 days of full Pro access with no credit card required. After the trial, 
              you'll be automatically subscribed to the Pro plan or you can cancel anytime.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Can I cancel anytime?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Yes, you can cancel your subscription at any time. You'll continue to have 
              Pro access until the end of your current billing period.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              What trading platforms do you support?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Currently we support Binance (Spot and Futures). We're working on adding 
              support for more exchanges like Bybit, OKX, and others.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
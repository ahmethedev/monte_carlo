import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardBody, Button } from '@nextui-org/react';
import { LockClosedIcon, StarIcon } from '@heroicons/react/24/outline';

interface ProRouteProps {
  children: React.ReactNode;
  feature?: string;
  fallback?: React.ReactNode;
}

const UpgradePrompt: React.FC<{ feature?: string }> = ({ feature }) => {
  const featureDisplayNames: Record<string, string> = {
    journal: 'Trading Journal',
    unlimited_simulations: 'Unlimited Simulations',
    export_data: 'Data Export'
  };

  const featureName = feature ? featureDisplayNames[feature] || feature : 'Pro Features';

  return (
    <div className="min-h-[80vh] flex items-center justify-center section-padding animate-fade-in">
      <div className="max-w-2xl mx-auto text-center">
        {/* Premium Lock Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-warning-500/20 to-warning-600/20 rounded-3xl flex items-center justify-center border border-warning-500/30 shadow-glow">
            <LockClosedIcon className="w-12 h-12 text-warning-400" />
          </div>
          <div className="absolute -inset-2 bg-gradient-to-br from-warning-500/10 to-warning-600/10 rounded-3xl blur opacity-50"></div>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl lg:text-5xl font-black text-neutral-100 mb-4">
            Unlock <span className="text-gradient">{featureName}</span>
          </h1>
          <p className="text-xl text-neutral-300 leading-relaxed max-w-xl mx-auto">
            This is a Pro feature. Upgrade your account to access {featureName.toLowerCase()} and unlock the full potential of EdgePro.
          </p>
        </div>

        {/* Pro Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="card p-6 text-left">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <StarIcon className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <h3 className="font-bold text-neutral-100 mb-2">Advanced Trading Journal</h3>
                <p className="text-sm text-neutral-400">Track, analyze, and optimize your trading performance with detailed analytics and insights.</p>
              </div>
            </div>
          </div>

          <div className="card p-6 text-left">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <StarIcon className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <h3 className="font-bold text-neutral-100 mb-2">Unlimited Simulations</h3>
                <p className="text-sm text-neutral-400">Run unlimited Monte Carlo simulations with advanced risk analysis and portfolio optimization.</p>
              </div>
            </div>
          </div>

          <div className="card p-6 text-left">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <StarIcon className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <h3 className="font-bold text-neutral-100 mb-2">Data Export & Reports</h3>
                <p className="text-sm text-neutral-400">Export your analysis to CSV, Excel, and PDF formats for professional reporting.</p>
              </div>
            </div>
          </div>

          <div className="card p-6 text-left">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <StarIcon className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <h3 className="font-bold text-neutral-100 mb-2">Priority Support</h3>
                <p className="text-sm text-neutral-400">Get dedicated support with faster response times and direct access to our team.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="card-premium p-8 mb-8 max-w-md mx-auto">
          <div className="text-center mb-6">
            <div className="text-4xl font-black text-neutral-100 mb-2">$9.99</div>
            <div className="text-neutral-400 text-sm">per month, billed monthly</div>
          </div>
          
          <button
            className="btn-primary w-full text-lg py-4 mb-4 shadow-glow hover:shadow-glow-lg"
            onClick={() => {
              // TODO: Redirect to upgrade page
              console.log('Redirect to upgrade page');
            }}
          >
            Upgrade to Pro
          </button>
          
          <div className="text-xs text-neutral-500 text-center">
            Cancel anytime • No hidden fees • 7-day money-back guarantee
          </div>
        </div>

        {/* Back Button */}
        <button
          className="btn-ghost"
          onClick={() => window.history.back()}
        >
          ← Go Back
        </button>
      </div>
    </div>
  );
};

export const ProRoute: React.FC<ProRouteProps> = ({ 
  children, 
  feature,
  fallback 
}) => {
  const { hasFeatureAccess, hasProAccess } = useAuth();

  // Check feature-specific access
  if (feature) {
    if (hasFeatureAccess(feature)) {
      return <>{children}</>;
    }
  } else {
    // Check general pro access
    if (hasProAccess()) {
      return <>{children}</>;
    }
  }

  // Show custom fallback or default upgrade prompt
  return fallback ? <>{fallback}</> : <UpgradePrompt feature={feature} />;
};

export default ProRoute;
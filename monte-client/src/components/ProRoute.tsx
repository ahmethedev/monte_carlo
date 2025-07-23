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
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-lg mx-auto">
        <CardBody className="text-center p-8">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
              <LockClosedIcon className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {featureName} - Pro Feature
            </h2>
            <p className="text-gray-600">
              Upgrade to Pro to unlock {featureName.toLowerCase()} and get access to all premium features.
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center text-sm text-gray-700">
              <StarIcon className="w-4 h-4 text-yellow-500 mr-2" />
              Trading Journal with detailed analytics
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <StarIcon className="w-4 h-4 text-yellow-500 mr-2" />
              Unlimited Monte Carlo simulations
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <StarIcon className="w-4 h-4 text-yellow-500 mr-2" />
              Export data to CSV/Excel
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <StarIcon className="w-4 h-4 text-yellow-500 mr-2" />
              Priority customer support
            </div>
          </div>

          <div className="space-y-3">
            <Button
              color="primary"
              size="lg"
              className="w-full font-semibold"
              onClick={() => {
                // TODO: Redirect to upgrade page
                console.log('Redirect to upgrade page');
              }}
            >
              Upgrade to Pro - $9.99/month
            </Button>
            <Button
              variant="light"
              size="sm"
              className="w-full"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </div>
        </CardBody>
      </Card>
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
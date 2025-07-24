import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SubscriptionContextType {
  plan: string;
  status: string;
  isLoading: boolean;
  isPro: boolean;
  isTrialActive: boolean;
  trialEnd: string | null;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [plan, setPlan] = useState<string>('free');
  const [status, setStatus] = useState<string>('inactive');
  const [isLoading, setIsLoading] = useState(true);
  const [trialEnd, setTrialEnd] = useState<string | null>(null);

  const fetchSubscriptionStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/stripe/subscription-status', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPlan(data.plan);
        setStatus(data.status);
        setTrialEnd(data.trial_end);
      }
    } catch (error) {
      console.error('Failed to fetch subscription status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSubscription = async () => {
    setIsLoading(true);
    await fetchSubscriptionStatus();
  };

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const isPro = plan === 'pro' && status === 'active';
  const isTrialActive = trialEnd ? new Date(trialEnd) > new Date() : false;

  const value: SubscriptionContextType = {
    plan,
    status,
    isLoading,
    isPro,
    isTrialActive,
    trialEnd,
    refreshSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
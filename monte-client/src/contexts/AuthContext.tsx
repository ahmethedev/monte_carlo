import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { verifyAuth, getMe } from '../services/authService';

interface User {
  username: string;
  email: string;
  subscription_status?: 'free' | 'pro';
  subscription_expires_at?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  hasProAccess: () => boolean;
  hasFeatureAccess: (feature: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      const isValid = await verifyAuth();
      if (isValid) {
        const userData = await getMe();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token: string) => {
    localStorage.setItem('token', token);
    await refreshUser();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasProAccess = (): boolean => {
    if (!user) return false;
    return user.subscription_status === 'pro';
  };

  const hasFeatureAccess = (feature: string): boolean => {
    if (!user) return false;
    
    // Define feature access based on subscription
    const freeFeatures = ['basic_simulation'];
    const proFeatures = ['journal', 'unlimited_simulations', 'export_data'];
    
    if (freeFeatures.includes(feature)) return true;
    if (proFeatures.includes(feature)) return hasProAccess();
    
    return false;
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshUser,
    hasProAccess,
    hasFeatureAccess
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
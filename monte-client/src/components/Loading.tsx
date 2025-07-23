import React from 'react';
import { TrendingUp } from 'lucide-react';

interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ 
  message = 'Loading...', 
  size = 'md',
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-20 w-20'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const containerClass = fullScreen 
    ? 'fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-50'
    : 'flex flex-col items-center justify-center min-h-[400px] p-8';

  return (
    <div className={containerClass}>
      <div className="relative mb-6">
        {/* Animated background circles */}
        <div className="absolute inset-0 animate-spin">
          <div className={`${sizeClasses[size]} border-4 border-transparent border-t-primary-500/30 border-r-primary-400/20 rounded-full`}></div>
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}>
          <div className={`${sizeClasses[size]} border-4 border-transparent border-b-primary-600/40 border-l-primary-500/30 rounded-full`}></div>
        </div>
        
        {/* Center logo */}
        <div className={`${sizeClasses[size]} bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-glow animate-pulse-soft`}>
          <TrendingUp className={`${iconSizes[size]} text-white`} />
        </div>
      </div>
      
      <div className="text-center max-w-sm">
        <p className={`${textSizes[size]} font-semibold text-neutral-200 mb-2`}>
          {message}
        </p>
        <p className="text-sm text-neutral-400">
          Please wait while we process your request...
        </p>
      </div>
      
      {/* Animated dots */}
      <div className="flex space-x-1 mt-4">
        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

export default Loading;

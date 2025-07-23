import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowLeft } from 'lucide-react';
import { AuthLayoutProps } from '../types';

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, subtitle }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-neutral-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl animate-pulse-soft"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-700/5 rounded-full blur-3xl animate-pulse-soft" style={{animationDelay: '1s'}}></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 flex-col justify-center section-padding">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-md"
          >
            <Link to="/" className="inline-flex items-center space-x-3 mb-8 group">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black text-gradient">EdgePro</span>
                <span className="text-sm text-primary-400 font-bold tracking-wider -mt-1">TRADING INTELLIGENCE</span>
              </div>
            </Link>
            
            <h2 className="text-4xl xl:text-5xl font-black text-neutral-100 mb-6 leading-tight">
              Welcome to the Future of Trading
            </h2>
            
            <p className="text-xl text-neutral-300 leading-relaxed mb-8">
              {subtitle || "Advanced Monte Carlo simulations and AI-powered insights to transform your trading performance."}
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                <span className="text-neutral-400">Professional-grade Monte Carlo analysis</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                <span className="text-neutral-400">Real-time risk assessment</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                <span className="text-neutral-400">Advanced portfolio optimization</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-1/2 xl:w-3/5 flex flex-col justify-center section-padding">
          {/* Mobile Back Button */}
          <div className="lg:hidden mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 text-neutral-400 hover:text-primary-400 transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
          </div>

          {/* Mobile Branding */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-glow">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-gradient">EdgePro</span>
            </div>
            <p className="text-neutral-400 text-sm">{subtitle}</p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md mx-auto"
          >
            <div className="card-premium p-8">
              {children}
            </div>
          </motion.div>

          {/* Footer */}
          <div className="text-center text-neutral-500 text-sm mt-8">
            <p>&copy; {new Date().getFullYear()} EdgePro. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

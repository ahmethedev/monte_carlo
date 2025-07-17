import React from 'react';
import { TrendingUp, Brain } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                <Brain className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-white tracking-tight">EdgePro.ai</span>
              <span className="text-xs text-emerald-400 font-bold -mt-1">AI Trading Mentor</span>
            </div>
          </div>

          <p className="text-slate-400 text-sm font-semibold">
            © 2025 EdgePro.ai. All rights reserved. Powered by AI.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
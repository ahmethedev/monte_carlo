import React from 'react';
import { TrendingUp, Heart, Globe, Brain } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                  <Brain className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white tracking-tight">EdgePro.ai</span>
                <span className="text-sm text-emerald-400 font-bold -mt-1">AI Trading Mentor</span>
              </div>
            </div>
            <p className="text-slate-300 mb-6 max-w-md font-semibold leading-relaxed">
              Your AI mentor in the markets. Transform your trading history into profitable insights 
              and build the discipline needed for consistent profits with artificial intelligence.
            </p>
            <div className="flex items-center space-x-2 text-slate-400">
              <span className="font-semibold">Built with</span>
              <Heart className="w-4 h-4 text-red-400 fill-current" />
              <span className="font-semibold">and AI in</span>
              <span className="text-lg">🇹🇷</span>
              <span>+</span>
              <Globe className="w-4 h-4" />
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-black mb-6">AI Features</h4>
            <ul className="space-y-3">
              <li><a href="#ai-features" className="text-slate-300 hover:text-emerald-400 transition-colors font-semibold">AI Trading Mentor</a></li>
              <li><a href="#how-it-works" className="text-slate-300 hover:text-emerald-400 transition-colors font-semibold">How AI Works</a></li>
              <li><a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors font-semibold">AI Pricing</a></li>
              <li><a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors font-semibold">AI API</a></li>
            </ul>
          </div>

          {/* Community & Legal */}
          <div>
            <h4 className="text-white font-black mb-6">Community</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors font-semibold">AI Trading Discord</a></li>
              <li><a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors font-semibold">Twitter</a></li>
              <li><a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors font-semibold">AI Blog</a></li>
              <li><a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors font-semibold">Help Center</a></li>
            </ul>
            
            <h4 className="text-white font-black mb-6 mt-8">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors font-semibold">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors font-semibold">Terms of Service</a></li>
              <li><a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors font-semibold">About EdgePro.ai</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm font-semibold">
            © 2025 EdgePro.ai. All rights reserved. Powered by AI.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="font-semibold">AI systems operational</span>
            </div>
            <div className="text-sm text-slate-400 font-semibold">
              AI Beta v0.1.0
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
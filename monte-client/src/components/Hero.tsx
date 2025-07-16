import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Upload, BarChart3, Brain, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-20 pb-16 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-700/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center bg-slate-800/50 border border-emerald-600/30 rounded-full px-5 py-2.5 mb-8">
              <Brain className="w-4 h-4 text-emerald-400 mr-2" />
              <span className="text-emerald-400 text-sm font-bold tracking-wide">AI-POWERED TRADING INSIGHTS</span>
              <Sparkles className="w-4 h-4 text-emerald-400 ml-2" />
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight tracking-tight">
              Your AI Mentor for{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                Profitable Trading
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-10 leading-relaxed font-semibold max-w-2xl">
              Transform your trading history into profitable insights with our advanced AI mentor.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link 
                to="/signup"
                className="group bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-2xl font-bold text-lg border border-emerald-500/20"
              >
                <span>Start Free – No Credit Card</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                to="/signup"
                className="group bg-gradient-to-r from-slate-800 to-slate-900 border-2 border-emerald-600/50 text-emerald-400 px-8 py-4 rounded-xl hover:border-emerald-500 hover:bg-gradient-to-r hover:from-emerald-600/10 hover:to-emerald-700/10 transition-all duration-300 flex items-center justify-center space-x-2 font-bold shadow-xl"
              >
                <Upload className="w-5 h-5" />
                <span>Upload Trade History</span>
              </Link>
            </div>

            <div className="flex items-center justify-center lg:justify-start space-x-8 text-sm text-slate-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="font-semibold">250+ AI-Powered Traders</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="font-semibold">Free AI Beta Access</span>
              </div>
            </div>
          </div>

          {/* Right Column - Enhanced Dashboard Preview */}
          <div className="relative">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
              {/* Mock Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-black text-lg">AI Trading Dashboard</h3>
                    <p className="text-slate-400 text-sm font-semibold">Powered by EdgePro AI</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-black text-2xl">+$12,847</div>
                  <div className="text-slate-400 text-sm font-semibold">AI-Optimized Profits</div>
                </div>
              </div>

              {/* Mock Chart */}
              <div className="h-40 bg-slate-900/50 rounded-xl mb-6 flex items-end justify-between px-6 py-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-t from-emerald-700 to-emerald-500 rounded-sm w-6 shadow-lg"
                    style={{ height: `${Math.random() * 80 + 20}%` }}
                  ></div>
                ))}
              </div>

              {/* AI Chat Preview */}
              <div className="bg-gradient-to-r from-emerald-600/10 to-emerald-700/10 border border-emerald-600/20 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-emerald-400 font-black text-sm">EdgePro AI Mentor</span>
                      <div className="w-2 h-2 bg-emerald-400 rounded-full ml-2 animate-pulse"></div>
                    </div>
                    <div className="text-slate-200 text-sm leading-relaxed font-semibold">
                      "I've analyzed your trades. You're overtrading after losses - I can help you build discipline and increase profits by 15-20%."
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Floating Elements */}
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-emerald-600/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-emerald-700/20 rounded-full blur-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
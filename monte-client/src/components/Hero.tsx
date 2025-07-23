import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Upload, BarChart3, Brain, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden min-h-screen flex items-center">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl animate-pulse-soft"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-700/15 rounded-full blur-3xl animate-pulse-soft" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-96 bg-gradient-to-r from-primary-500/5 to-primary-600/5 rounded-full blur-3xl"></div>

      <div className="relative content-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center glass border border-primary-600/30 rounded-full px-6 py-3 mb-8 group hover:border-primary-500/50 transition-all duration-300">
              <Brain className="w-5 h-5 text-primary-400 mr-3 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-primary-400 text-sm font-bold tracking-widest">MONTE CARLO INTELLIGENCE</span>
              <Sparkles className="w-5 h-5 text-primary-400 ml-3 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black mb-8 leading-[0.9] tracking-tight">
              <span className="text-neutral-100">Master Trading with</span>
              <br />
              <span className="text-gradient bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 inline-block">
                Monte Carlo AI
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-neutral-300 mb-12 leading-relaxed font-medium max-w-2xl">
              Harness advanced Monte Carlo simulations to predict, optimize, and perfect your trading strategies with precision analytics.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 mb-12">
              <Link to="/signup" className="btn-primary text-lg py-4 px-8 group shadow-glow hover:shadow-glow-lg">
                <span>Start Free Monte Carlo Analysis</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300 inline" />
              </Link>
              
              <Link to="/signup" className="btn-secondary text-lg py-4 px-8 group border-primary-600/30 hover:border-primary-500/50">
                <BarChart3 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300 inline" />
                <span>View Live Demo</span>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8 text-sm text-neutral-400">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-primary-400 rounded-full animate-pulse shadow-glow"></div>
                <span className="font-semibold">1M+ Simulations Processed</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
                <span className="font-semibold">98.7% Accuracy Rate</span>
              </div>
            </div>
          </div>

          {/* Right Column - Enhanced Dashboard Preview */}
          <div className="relative">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
              {/* Mock Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-black text-lg">AI Trading Dashboard</h3>
                    <p className="text-slate-400 text-sm font-semibold">Powered by EdgePro AI</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-blue-400 font-black text-2xl">+$12,847</div>
                  <div className="text-slate-400 text-sm font-semibold">AI-Optimized Profits</div>
                </div>
              </div>

              {/* Mock Chart */}
              <div className="h-40 bg-slate-900/50 rounded-xl mb-6 flex items-end justify-between px-6 py-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-t from-blue-700 to-blue-500 rounded-sm w-6 shadow-lg"
                    style={{ height: `${Math.random() * 80 + 20}%` }}
                  ></div>
                ))}
              </div>

              {/* AI Chat Preview */}
              <div className="bg-gradient-to-r from-blue-600/10 to-blue-700/10 border border-blue-600/20 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-blue-400 font-black text-sm">EdgePro AI Mentor</span>
                      <div className="w-2 h-2 bg-blue-400 rounded-full ml-2 animate-pulse"></div>
                    </div>
                    <div className="text-slate-200 text-sm leading-relaxed font-semibold">
                      "I've analyzed your trades. You're overtrading after losses - I can help you build discipline and increase profits by 15-20%."
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Floating Elements */}
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-blue-600/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-blue-700/20 rounded-full blur-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
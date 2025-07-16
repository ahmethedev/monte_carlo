import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, BarChart3, MessageCircle, Zap, Brain, Sparkles } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Import Your Data',
    description: 'Upload from any broker - Binance, MT4, Interactive Brokers.',
    color: 'from-emerald-600 to-emerald-700'
  },
  {
    icon: BarChart3,
    title: 'AI Analysis',
    description: 'Instant performance analysis - win rate, patterns, biases.',
    color: 'from-emerald-600 to-emerald-700',
    aiPowered: true
  },
  {
    icon: MessageCircle,
    title: 'Chat with AI Mentor',
    description: 'Ask questions, get personalized insights and coaching.',
    color: 'from-emerald-600 to-emerald-700',
    aiPowered: true
  },
  {
    icon: Zap,
    title: 'Optimize & Simulate',
    description: 'Monte Carlo simulations and actionable improvements.',
    color: 'from-emerald-600 to-emerald-700',
    aiPowered: true
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-emerald-600/10 border border-emerald-600/20 rounded-full px-6 py-3 mb-8">
            <Brain className="w-5 h-5 text-emerald-400 mr-2" />
            <span className="text-emerald-400 text-sm font-bold tracking-wide">AI-POWERED PROCESS</span>
            <Sparkles className="w-5 h-5 text-emerald-400 ml-2" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 tracking-tight">
            How EdgePro.ai Works
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto font-semibold leading-relaxed">
            Four simple steps to transform your trading with AI
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className={`group relative rounded-2xl p-8 transition-all duration-300 hover:transform hover:scale-105 ${
                  step.aiPowered 
                    ? 'bg-gradient-to-br from-emerald-600/10 to-emerald-700/10 border-2 border-emerald-600/30 hover:border-emerald-600/50' 
                    : 'bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50'
                }`}
              >
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center text-white text-sm font-black shadow-lg">
                  {index + 1}
                </div>

                {/* AI Badge */}
                {step.aiPowered && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                    <div className="flex items-center space-x-1">
                      <Brain className="w-2.5 h-2.5" />
                      <span>AI</span>
                    </div>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-14 h-14 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-black text-white mb-4">{step.title}</h3>
                <p className="text-slate-300 leading-relaxed font-semibold">{step.description}</p>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-emerald-600/50 to-transparent"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-emerald-600/10 to-emerald-700/10 border border-emerald-600/20 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-black text-white mb-4">Ready to Meet Your AI Trading Mentor?</h3>
            <p className="text-slate-300 mb-6 font-semibold">Join 250+ traders using AI to improve performance</p>
            <Link 
              to="/signup"
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 font-black text-lg shadow-2xl border border-emerald-500/20"
            >
              Start Your AI Journey Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
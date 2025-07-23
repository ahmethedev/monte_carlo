import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, MessageCircle, Brain, Sparkles, Zap } from 'lucide-react';

const EarlyAccess = () => {
  const [email, setEmail] = useState('');
  const [, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email submission here
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section id="early-access" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-3xl p-12 md:p-16 shadow-2xl">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center bg-blue-600/10 border border-blue-600/20 rounded-full px-6 py-3 mb-8">
              <Brain className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-blue-400 text-sm font-bold tracking-wide">LIMITED AI BETA ACCESS</span>
              <Sparkles className="w-5 h-5 text-blue-400 ml-2" />
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 tracking-tight">
              Join 250+ Traders Using AI to Maximize Profits
            </h2>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto font-semibold leading-relaxed">
              Free AI mentor access + Discord support for early adopters. 
              Get ahead with artificial intelligence.
            </p>
          </div>

          {/* AI Benefits */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gradient-to-br from-blue-600/10 to-blue-700/10 border border-blue-600/20 rounded-xl p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-white font-black mb-2">AI Trading Mentor</h4>
              <p className="text-slate-300 text-sm font-semibold">Personal AI coach that learns your patterns</p>
            </div>
            <div className="bg-gradient-to-br from-blue-600/10 to-blue-700/10 border border-blue-600/20 rounded-xl p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-white font-black mb-2">Real-time Insights</h4>
              <p className="text-slate-300 text-sm font-semibold">Instant AI analysis of your trades</p>
            </div>
            <div className="bg-gradient-to-br from-blue-600/10 to-blue-700/10 border border-blue-600/20 rounded-xl p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-white font-black mb-2">24/7 AI Support</h4>
              <p className="text-slate-300 text-sm font-semibold">Chat with your AI mentor anytime</p>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-10">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email for AI beta access"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-colors font-semibold"
                />
              </div>
              <Link
                to="/signup"
                className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 font-black shadow-2xl border border-blue-500/20"
              >
                <span>Claim AI Access</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </form>

          {/* Discord CTA */}
          <div className="border-t border-slate-700/50 pt-10">
            <p className="text-slate-300 mb-6 font-semibold text-lg">
              Connect with other AI-powered traders
            </p>
            <button className="group bg-gradient-to-r from-slate-800 to-slate-900 border-2 border-blue-600/50 text-blue-400 px-8 py-4 rounded-xl hover:border-blue-500 hover:bg-gradient-to-r hover:from-blue-600/10 hover:to-blue-700/10 transition-all duration-300 flex items-center justify-center space-x-2 mx-auto font-black shadow-xl">
              <MessageCircle className="w-5 h-5" />
              <span>Join the AI Trading Discord</span>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-10 flex items-center justify-center space-x-8 text-sm text-slate-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="font-semibold">No spam, ever</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="font-semibold">Unsubscribe anytime</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="font-semibold">AI-powered insights</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EarlyAccess;
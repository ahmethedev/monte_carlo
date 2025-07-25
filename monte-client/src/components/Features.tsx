import React from 'react';
import { 
  Database, 
  Calendar, 
  Brain, 
  Shuffle, 
  Sparkles,
  Zap,
  MessageCircle,
  Target
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI Trading Mentor',
    description: 'Personal AI coach that understands your patterns and provides actionable insights.',
    color: 'from-blue-600 to-blue-700',
    badge: 'AI Powered',
    highlight: true
  },
  {
    icon: MessageCircle,
    title: 'Behavioral Analysis',
    description: 'AI detects revenge trading, FOMO, and psychological biases that hurt profits.',
    color: 'from-blue-600 to-blue-700',
    badge: 'AI Powered',
    highlight: true
  },
  {
    icon: Target,
    title: 'Personalized Coaching',
    description: 'Custom strategies and discipline-building exercises for your trading style.',
    color: 'from-blue-600 to-blue-700',
    badge: 'AI Powered',
    highlight: true
  },
  {
    icon: Database,
    title: 'Universal Import',
    description: 'Import from any broker - Binance, MT4, MT5, Interactive Brokers.',
    color: 'from-blue-600 to-blue-700'
  },
  {
    icon: Calendar,
    title: 'Smart Trade Journal',
    description: 'AI identifies your best trading days, times, and market conditions.',
    color: 'from-blue-600 to-blue-700'
  },
  {
    icon: Shuffle,
    title: 'Monte Carlo Simulations',
    description: 'Model future outcomes with AI-optimized risk parameters.',
    color: 'from-blue-600 to-blue-700'
  }
];

const Features = () => {
  return (
    <section id="ai-features" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* AI Features Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-blue-600/10 border border-blue-600/20 rounded-full px-6 py-3 mb-8">
            <Brain className="w-5 h-5 text-blue-400 mr-2" />
            <span className="text-blue-400 text-sm font-bold tracking-wide">ADVANCED AI FEATURES</span>
            <Sparkles className="w-5 h-5 text-blue-400 ml-2" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 tracking-tight">
            Meet Your AI Trading Mentor
          </h2>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto font-semibold leading-relaxed">
            Advanced AI that understands your psychology and coaches you to consistent profits.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`group relative rounded-2xl p-8 transition-all duration-300 hover:transform hover:scale-105 ${
                  feature.highlight 
                    ? 'bg-gradient-to-br from-blue-600/10 to-blue-700/10 border-2 border-blue-600/30 hover:border-blue-600/50' 
                    : 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-slate-600/50'
                }`}
              >
                {/* Badge */}
                {feature.badge && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">
                    <div className="flex items-center space-x-1">
                      <Zap className="w-3 h-3" />
                      <span>{feature.badge}</span>
                    </div>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-black text-white mb-4">{feature.title}</h3>
                <p className="text-slate-300 leading-relaxed font-semibold">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
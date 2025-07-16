import React from 'react';
import { Star, Quote, Brain, TrendingUp, Zap } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Day Trader',
    avatar: '👩‍💼',
    rating: 5,
    text: 'EdgePro\'s AI mentor made me realize my revenge trading was costing me 20% of my profits. The personalized coaching is incredible.',
    highlight: 'AI-powered insights',
    profit: '+$15,240'
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Swing Trader',
    avatar: '👨‍💻',
    rating: 5,
    text: 'The AI understands my psychology better than I do. It predicted my overtrading patterns and helped me build discipline.',
    highlight: '18% win rate boost',
    profit: '+$22,890'
  },
  {
    name: 'Elena Petrov',
    role: 'Crypto Trader',
    avatar: '👩‍🎓',
    rating: 5,
    text: 'Finally, an AI that speaks trader language! The mentor feels like having a professional coach available 24/7.',
    highlight: 'Eliminated FOMO trading',
    profit: '+$8,750'
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-emerald-600/10 border border-emerald-600/20 rounded-full px-6 py-3 mb-8">
            <Brain className="w-5 h-5 text-emerald-400 mr-2" />
            <span className="text-emerald-400 text-sm font-bold tracking-wide">AI SUCCESS STORIES</span>
            <TrendingUp className="w-5 h-5 text-emerald-400 ml-2" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 tracking-tight">
            Trusted by AI-Powered Traders Worldwide
          </h2>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto font-semibold leading-relaxed">
            See how EdgePro.ai's AI mentor is transforming trading performance
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-8 hover:border-emerald-600/30 transition-all duration-300 hover:transform hover:scale-105"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center shadow-lg">
                <Quote className="w-5 h-5 text-white" />
              </div>

              {/* Profit Badge */}
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">
                {testimonial.profit}
              </div>

              {/* Rating */}
              <div className="flex items-center mb-6">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-slate-300 leading-relaxed mb-8 italic font-semibold">
                "{testimonial.text}"
              </p>

              {/* Highlight Badge */}
              <div className="inline-flex items-center bg-emerald-600/10 border border-emerald-600/20 rounded-full px-4 py-2 mb-6">
                <Zap className="w-4 h-4 text-emerald-400 mr-2" />
                <span className="text-emerald-400 text-sm font-bold">{testimonial.highlight}</span>
              </div>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-xl mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="text-white font-black">{testimonial.name}</h4>
                  <p className="text-slate-400 text-sm font-semibold">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Stats */}
        <div className="mt-20 bg-gradient-to-r from-emerald-600/10 to-emerald-700/10 border border-emerald-600/20 rounded-3xl p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-black text-emerald-400 mb-2">250+</div>
              <div className="text-slate-300 font-semibold">AI-Powered Traders</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-emerald-400 mb-2">$2.1M+</div>
              <div className="text-slate-300 font-semibold">AI-Optimized Profits</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-emerald-400 mb-2">94%</div>
              <div className="text-slate-300 font-semibold">AI Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-emerald-400 mb-2">24/7</div>
              <div className="text-slate-300 font-semibold">AI Mentor Availability</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
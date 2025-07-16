import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Menu, X, Brain } from 'lucide-react';

const HeaderLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800/50' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                <Brain className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-white tracking-tight">EdgePro.ai</span>
              <span className="text-xs text-emerald-400 font-bold -mt-1">AI Trading Mentor</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#ai-features" className="text-slate-300 hover:text-emerald-400 transition-colors font-semibold">AI Features</a>
            <a href="#how-it-works" className="text-slate-300 hover:text-emerald-400 transition-colors font-semibold">How It Works</a>
            <a href="#early-access" className="text-slate-300 hover:text-emerald-400 transition-colors font-semibold">Beta Access</a>
            <Link 
              to="/signup"
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 font-black shadow-lg border border-emerald-500/20"
            >
              Start Free
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
            <nav className="px-4 py-4 space-y-4">
              <a href="#ai-features" className="block text-slate-300 hover:text-emerald-400 transition-colors font-semibold">AI Features</a>
              <a href="#how-it-works" className="block text-slate-300 hover:text-emerald-400 transition-colors font-semibold">How It Works</a>
              <a href="#early-access" className="block text-slate-300 hover:text-emerald-400 transition-colors font-semibold">Beta Access</a>
              <Link 
                to="/signup"
                className="block w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-4 py-2 rounded-xl transition-all duration-300 text-center font-black shadow-lg border border-emerald-500/20"
              >
                Start Free
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderLanding;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Menu, X } from 'lucide-react';

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
    <header className={`fixed w-full top-0 z-50 transition-all duration-500 ${
      isScrolled ? 'glass-strong border-b border-dark-800/50' : 'bg-transparent'
    }`}>
      <div className="content-container">
        <div className="flex justify-between items-center h-18">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
                <TrendingUp className="w-6 h-6 text-white transform group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-gradient tracking-tight">EdgePro</span>
              <span className="text-xs text-primary-400 font-bold -mt-1 tracking-wider">TRADING INTELLIGENCE</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <a href="#features" className="btn-ghost text-sm font-medium">Features</a>
            <a href="#how-it-works" className="btn-ghost text-sm font-medium">How It Works</a>
            <a href="#pricing" className="btn-ghost text-sm font-medium">Pricing</a>
            <div className="w-px h-6 bg-dark-700 mx-2"></div>
            <Link to="/signin" className="btn-ghost text-sm font-medium">Sign In</Link>
            <Link to="/signup" className="btn-primary text-sm font-semibold ml-2">
              Start Free Trial
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-xl bg-dark-800/50 backdrop-blur-sm border border-dark-700 text-neutral-200 hover:bg-dark-700/50 transition-all duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-18 left-0 right-0 glass-strong border-b border-dark-800/50 animate-slide-down">
            <nav className="section-padding py-6 space-y-3">
              <a href="#features" className="block text-neutral-300 hover:text-primary-400 transition-colors font-medium py-3 border-b border-dark-800/50">Features</a>
              <a href="#how-it-works" className="block text-neutral-300 hover:text-primary-400 transition-colors font-medium py-3 border-b border-dark-800/50">How It Works</a>
              <a href="#pricing" className="block text-neutral-300 hover:text-primary-400 transition-colors font-medium py-3 border-b border-dark-800/50">Pricing</a>
              <div className="pt-4 space-y-3">
                <Link to="/signin" className="block btn-secondary text-center">
                  Sign In
                </Link>
                <Link to="/signup" className="block btn-primary text-center">
                  Start Free Trial
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderLanding;
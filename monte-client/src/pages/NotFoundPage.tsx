import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Sparkles } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-700/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-2xl mx-auto text-center p-8 bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-gray-800/50">
        <div className="inline-flex items-center bg-emerald-600/10 border border-emerald-600/20 rounded-full px-6 py-3 mb-8">
          <Brain className="w-5 h-5 text-emerald-400 mr-2" />
          <span className="text-emerald-400 text-sm font-bold tracking-wide">ERROR 404</span>
          <Sparkles className="w-5 h-5 text-emerald-400 ml-2" />
        </div>

        <div className="relative">
          <h1 className="text-8xl font-bold text-white mb-4">404</h1>
          <div className="absolute inset-0 animate-pulse">
            <div className="absolute inset-0 bg-emerald-600/10 rounded-full blur-2xl"></div>
          </div>
        </div>
        <h2 className="text-3xl font-semibold text-gray-200 mb-6">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist. Let's get you back on track.
        </p>
        
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg border border-emerald-500/20"
        >
          Return Home
          <Sparkles className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

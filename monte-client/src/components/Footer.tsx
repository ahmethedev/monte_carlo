import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative">
            </div>

          </div>
          <p className="text-slate-400 text-sm font-semibold">
            © 2025 EdgePro.ai. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
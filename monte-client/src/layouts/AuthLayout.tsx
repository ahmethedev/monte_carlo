import React from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, subtitle }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10">
        {/* Background Grid Pattern */}
        <div 
          className="absolute inset-0 bg-transparent"
          style={{
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        ></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8 z-10"
      >
        <h1 className="text-5xl font-bold tracking-wider">MONTE</h1>
        <p className="text-lg text-gray-400 mt-2">{subtitle}</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-md z-10"
      >
        {children}
      </motion.div>

      <div className="absolute bottom-4 text-center text-gray-600 text-sm z-10">
        <p>&copy; {new Date().getFullYear()} Monte Carlo Trading. All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default AuthLayout;

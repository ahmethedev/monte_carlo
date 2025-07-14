import React, { useState } from 'react';
import { Input, Button } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { AuthFormProps } from '../../types';



const AuthForm: React.FC<AuthFormProps> = ({ 
  onSubmit, 
  buttonText, 
  title,
  isLoading = false,
  error,
  onForgotPassword,
  onSwitchAuthMode
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(event, email, password);
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-gray-800/50 border border-gray-700/50 rounded-2xl shadow-2xl backdrop-blur-sm">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">{title}</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-400/30"
          >
            {error}
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            variant="bordered"
            classNames={{
              inputWrapper: "bg-gray-900/50 border-gray-700 hover:border-blue-500",
              label: "text-gray-400",
              input: "text-white"
            }}
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            variant="bordered"
            classNames={{
              inputWrapper: "bg-gray-900/50 border-gray-700 hover:border-blue-500",
              label: "text-gray-400",
              input: "text-white"
            }}
          />
        </motion.div>

        <div className="flex items-center justify-between">
          {onForgotPassword && (
            <Button 
              variant="light" 
              onClick={onForgotPassword}
              className="text-sm text-gray-400 hover:text-white px-0"
            >
              Forgot Password?
            </Button>
          )}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button 
            type="submit" 
            color="primary" 
            fullWidth 
            isLoading={isLoading}
            className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
          >
            {buttonText}
          </Button>
        </motion.div>
      </form>
      {onSwitchAuthMode && (
        <div className="text-center mt-6">
          <Button 
            variant="light" 
            onClick={onSwitchAuthMode}
            className="text-sm text-gray-400 hover:text-white"
          >
            {buttonText === 'Sign In' ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AuthForm;

import React, { useState } from 'react';
import AuthForm from '../components/Auth/AuthForm';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>, email: string, password: string) => {
    event.preventDefault();
    setIsLoading(true);
    setError(undefined);
    
    try {
      const response = await login(email, password);
      console.log('Signed in successfully', response.data);
      localStorage.setItem('token', response.data.access_token);
      navigate('/app');
    } catch (error) {
      console.error('Sign in failed', error);
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout subtitle="Sign in to access your trading dashboard">
      <AuthForm 
        onSubmit={handleSignIn} 
        buttonText="Sign In" 
        title="Secure Sign In"
        isLoading={isLoading}
        error={error}
        onForgotPassword={() => {
          // TODO: Implement forgot password
        }}
        onSwitchAuthMode={() => {
          navigate('/signup');
        }}
      />
    </AuthLayout>
  );
};

export default SignIn;

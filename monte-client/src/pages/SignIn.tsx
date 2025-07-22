import React, { useState } from 'react';
import AuthForm from '../components/Auth/AuthForm';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../layouts/AuthLayout';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>, data: { email: string; password: string; username?: string }) => {
    event.preventDefault();
    setIsLoading(true);
    setError(undefined);
    
    try {
      if (!data.username) {
        setError('Username is required.');
        setIsLoading(false);
        return;
      }
      const response = await login(data.username, data.password);
      console.log('Signed in successfully', response);
      await authLogin(response.access_token);
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
        formType="signin"
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

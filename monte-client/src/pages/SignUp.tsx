import React, { useState } from 'react';
import AuthForm from '../components/Auth/AuthForm';
import { register } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>, email: string, password: string) => {
    event.preventDefault();
    setIsLoading(true);
    setError(undefined);

    try {
      await register(email, password);
      navigate('/signin');
    } catch (error) {
      console.error('Sign up failed', error);
      setError('Failed to create an account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join the future of algorithmic trading">
      <AuthForm 
        onSubmit={handleSignUp} 
        buttonText="Sign Up" 
        title="Get Started"
        isLoading={isLoading}
        error={error}
        onSwitchAuthMode={() => {
          navigate('/signin');
        }}
      />
    </AuthLayout>
  );
};

export default SignUp;

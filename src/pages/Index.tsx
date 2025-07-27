import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { LoginForm } from '@/components/auth/LoginForm';
import { Dashboard } from './Dashboard';

const Index = () => {
  const { user, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <LoginForm 
        isSignUp={isSignUp} 
        onToggleMode={() => setIsSignUp(!isSignUp)} 
      />
    );
  }

  return <Dashboard />;
};

export default Index;

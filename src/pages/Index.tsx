import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { LoginForm } from '@/components/auth/LoginForm';
import { Dashboard } from './Dashboard';

const Index: React.FC = () => {
  const { user, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center text-lg font-medium">Loading...</div>
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

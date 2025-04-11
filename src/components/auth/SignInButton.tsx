import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const SignInButton: React.FC = () => {
  const { user, signInWithGoogle, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async () => {
    try {
      setIsLoading(true);
      if (user) {
        await logout();
      } else {
        await signInWithGoogle();
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleAuth}
      disabled={isLoading}
      className="text-[#1a73e8] hover:text-[#174ea6] font-medium text-sm focus:outline-none"
    >
      {isLoading ? (
        <span className="opacity-70">Loading...</span>
      ) : user ? (
        <div className="flex items-center gap-2">
          <img
            src={user.photoURL || ''}
            alt={user.displayName || 'User'}
            className="w-8 h-8 rounded-full"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        'Sign in'
      )}
    </button>
  );
};

export default SignInButton; 
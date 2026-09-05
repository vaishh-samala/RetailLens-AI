import React, { createContext, useContext, useEffect, useState } from 'react';
import { GoogleUser } from '../../types';
import { authService } from './authService';

interface AuthContextType {
  user: GoogleUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<GoogleUser>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<GoogleUser | null>(authService.getCurrentUser());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = authService.subscribeToAuthState((updatedUser) => {
      setUser(updatedUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const authenticatedUser = await authService.signInWithGoogle();
      setUser(authenticatedUser);
      return authenticatedUser;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signOut,
        isAuthenticated: !!user,
        isConfigured: authService.isConfigured(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

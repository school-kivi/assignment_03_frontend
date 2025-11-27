'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

// Helper function to set auth cookie
const setAuthCookie = async (user: User) => {
  if (user) {
    const token = await user.getIdToken();
    document.cookie = `firebase-token=${token}; path=/; max-age=3600; SameSite=Lax`;
  }
};

// Helper function to clear auth cookie
const clearAuthCookie = () => {
  document.cookie = 'firebase-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
      
      // Manage authentication cookie
      if (user) {
        await setAuthCookie(user);
      } else {
        clearAuthCookie();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

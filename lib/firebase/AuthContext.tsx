"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

// Helper function to set auth cookie
const setAuthCookie = async (user: User) => {
  if (user) {
    const token = await user.getIdToken();
    document.cookie = `firebase-token=${token}; path=/; max-age=3600; SameSite=Lax`;
  }
};

// Helper function to clear auth cookie
const clearAuthCookie = () => {
  document.cookie =
    "firebase-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};

interface Profile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  person_number: string;
  is_admin: boolean;
  address: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      // Manage authentication cookie
      if (user) {
        await setAuthCookie(user);

        // Fetch profile information
        try {
          const token = await user.getIdToken();
          const response = await fetch("http://localhost:3001/api/profiles", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          const userProfile = data.data?.find(
            (p: Profile) => p.user_id === user.uid
          );
          setProfile(userProfile || null);
        } catch (error) {
          console.error("Error fetching profile:", error);
          setProfile(null);
        }
      } else {
        clearAuthCookie();
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

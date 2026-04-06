import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/types';
import { api } from '@/lib/mock-api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<User>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (api.isAuthenticated()) {
      api.getProfile().then(setUser).catch(() => {}).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    setUser(res.user);
  };

  const signup = async (email: string, password: string) => {
    await api.signup(email, password);
  };

  const verifyOtp = async (email: string, otp: string) => {
    const res = await api.verifyOtp(email, otp);
    setUser(res.user);
    return res.user;
  };

  const updateProfile = async (data: Partial<User>) => {
    const updated = await api.updateProfile(data);
    setUser(updated);
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, signup, verifyOtp, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

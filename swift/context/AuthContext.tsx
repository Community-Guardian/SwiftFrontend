"use client"
import React, { createContext, useState, useContext, ReactNode } from 'react';
import AuthManager from '../handler/AuthManager';
import { useRouter } from 'next/navigation';
interface AuthContextProps {
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password1: string, password2: string, user_type:string) => Promise<void>;
  refreshToken: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === 'undefined') {
      return false; // Assume not authenticated during SSR
    }
    return AuthManager.isAuthenticated();
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await AuthManager.login(email, password);
      setIsAuthenticated(true);
      router.push('/admin/')
    } catch (error) {
      console.error('Login failed', error);
      throw new Error("Login failed, try again");
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password1: string,password2: string, user_type:string) => {
    setLoading(true);
    try {
      await AuthManager.register(email, password1, password2 , user_type );
      await login(email, password1);
    } catch (error) {
      console.error('Registration failed', error);
      
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    setLoading(true);
    try {
      await AuthManager.refreshToken();
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Token refresh failed', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    AuthManager.logout();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, register, refreshToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
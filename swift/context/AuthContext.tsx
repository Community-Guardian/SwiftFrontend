"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AuthManager from '../handler/AuthManager';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined: string;
  last_login: string;
  image: string;
  referral_code: string,
  is_verified: boolean,
  referred_by: string,
}

interface AuthContextProps {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password1: string, password2: string, user_type: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await AuthManager.login(email, password);
      setIsAuthenticated(true);

      // Fetch the user object after login
      const userData = await AuthManager.getUser(); // Replace with the actual method to fetch user data
      setUser(userData);

      router.push('/(tabs)');
    } catch (error) {
      console.error('Login failed', error);
      throw new Error('Login failed, try again');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password1: string, password2: string, user_type: string) => {
    setLoading(true);
    try {
      await AuthManager.register(email, password1, password2, user_type);
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

      // Fetch the user object if token is refreshed successfully
      const userData = await AuthManager.getUser(); // Replace with the actual method to fetch user data
      setUser(userData);
    } catch (error) {
      console.error('Token refresh failed', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    AuthManager.logout();
    setIsAuthenticated(false);
    setUser(null);
    router.push('/');

  };

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        setIsAuthenticated(true);

        // Fetch the user object if a token exists
        AuthManager.getUser()
          .then((userData) => setUser(userData))
          .catch((error) => {
            console.error('Failed to fetch user', error);
            setIsAuthenticated(false);
          });
      }
    };

    checkToken();
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        user,
        login,
        register,
        refreshToken,
        logout,
      }}
    >
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

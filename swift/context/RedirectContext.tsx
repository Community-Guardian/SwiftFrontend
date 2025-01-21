import React, { createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { BASE_URL } from '@/handler/apiConfig';

interface RedirectContextProps {
  createReferralLink: (referralCode: string) => string;
  handleRedirect: (path: string) => void;
}

const RedirectContext = createContext<RedirectContextProps | undefined>(undefined);

export const RedirectProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const createReferralLink = (referralCode: string) => {
    return `${BASE_URL}/?code=${encodeURIComponent(referralCode)}`;
  };

  const handleRedirect = (path: string) => {
    router.push(path as any);
  };

  return (
    <RedirectContext.Provider value={{ createReferralLink, handleRedirect }}>
      {children}
    </RedirectContext.Provider>
  );
};

export const useRedirect = () => {
  const context = useContext(RedirectContext);
  if (context === undefined) {
    throw new Error('useRedirect must be used within a RedirectProvider');
  }
  return context;
};
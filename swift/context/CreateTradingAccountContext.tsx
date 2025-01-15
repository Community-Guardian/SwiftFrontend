import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CreateTradingAccountContextProps {
  hasSkipped: boolean;
  setHasSkipped: (value: boolean) => void;
}

const CreateTradingAccountContext = createContext<CreateTradingAccountContextProps | undefined>(undefined);

export const CreateTradingAccountProvider = ({ children }: { children: ReactNode }) => {
  const [hasSkipped, setHasSkippedState] = useState(false);

  useEffect(() => {
    const checkSkipped = async () => {
      const skipped = await AsyncStorage.getItem('hasSkippedCreateTradingAccount');
      setHasSkippedState(skipped === 'true');
    };
    checkSkipped();
  }, []);

  const setHasSkipped = async (value: boolean) => {
    setHasSkippedState(value);
    await AsyncStorage.setItem('hasSkippedCreateTradingAccount', value.toString());
  };

  return (
    <CreateTradingAccountContext.Provider value={{ hasSkipped, setHasSkipped }}>
      {children}
    </CreateTradingAccountContext.Provider>
  );
};

export const useCreateTradingAccount = () => {
  const context = useContext(CreateTradingAccountContext);
  if (context === undefined) {
    throw new Error('useCreateTradingAccount must be used within a CreateTradingAccountProvider');
  }
  return context;
};
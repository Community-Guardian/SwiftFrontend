// context/ConnectivityContext.tsx
import React, { createContext, useEffect, useState, useContext } from 'react';
import NetInfo from '@react-native-community/netinfo';

interface ConnectivityContextProps {
  isConnected: boolean;
  retryConnection: () => void;
}

const ConnectivityContext = createContext<ConnectivityContextProps | undefined>(undefined);

export const ConnectivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected || false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const retryConnection = () => {
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected || false);
    });
  };

  return (
    <ConnectivityContext.Provider value={{ isConnected, retryConnection }}>
      {children}
    </ConnectivityContext.Provider>
  );
};

export const useConnectivity = () => {
  const context = useContext(ConnectivityContext);
  if (!context) {
    throw new Error('useConnectivity must be used within a ConnectivityProvider');
  }
  return context;
};

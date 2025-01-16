import React, { createContext, useContext, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAuth } from './AuthContext';

interface LogoutContextProps {
  setRememberMe: (value: boolean) => void;
}

const LogoutContext = createContext<LogoutContextProps | undefined>(undefined);

export const LogoutProvider = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth();
  const [rememberMe, setRememberMe] = React.useState(false);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background' && !rememberMe) {
        logout();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [rememberMe, logout]);

  return (
    <LogoutContext.Provider value={{ setRememberMe }}>
      {children}
    </LogoutContext.Provider>
  );
};

export const useLogout = () => {
  const context = useContext(LogoutContext);
  if (context === undefined) {
    throw new Error('useLogout must be used within a LogoutProvider');
  }
  return context;
};
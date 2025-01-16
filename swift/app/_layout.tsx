import { Stack } from 'expo-router';
import { ThemeProvider } from '@/context/ThemeContext';
import { ConnectivityProvider, useConnectivity } from '@/context/ConnectivityContext';
import OfflineScreen from '@/app/screens/OfflineScreen';
import { PermissionsProvider } from '@/context/PermissionsContext ';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { CreateTradingAccountProvider } from '@/context/CreateTradingAccountContext';

import { LogoutProvider } from '@/context/LogoutContext';


function AppContent() {
  const { isConnected } = useConnectivity();
  const { isAuthenticated } = useAuth();


  
  if (!isAuthenticated) {
    // Render authentication-related screens
    return (
      <Stack screenOptions={{
        headerShown: false, // Hide the header
      }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    );
  }
  if (isAuthenticated) {
    // Render other-related screens
    return (
      <Stack screenOptions={{
        headerShown: false, // Hide the header
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="screens" options={{ headerShown: false }} />      
      </Stack>
    );
  }

  if (!isConnected) {
    // Render offline screen when no connectivity
    return <OfflineScreen />;
  }

  // Render main application when authenticated and connected
  return (
    <Stack screenOptions={{
      headerShown: false, // Hide the header
    }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="screens" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayoutNav() {
  return (
    <AuthProvider>
      <PermissionsProvider>
        <ConnectivityProvider>
          <ThemeProvider>
            <CreateTradingAccountProvider>
              <LogoutProvider>
                <AppContent />
              </LogoutProvider>
            </CreateTradingAccountProvider>
          </ThemeProvider>
        </ConnectivityProvider>
      </PermissionsProvider>
    </AuthProvider>
  );
}

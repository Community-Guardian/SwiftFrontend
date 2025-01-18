import { Stack } from 'expo-router';
import { ThemeProvider } from '@/context/ThemeContext';
import { ConnectivityProvider, useConnectivity } from '@/context/ConnectivityContext';
import OfflineScreen from '@/app/screens/OfflineScreen';
import { PermissionsProvider } from '@/context/PermissionsContext ';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { CreateTradingAccountProvider } from '@/context/CreateTradingAccountContext';

import { LogoutProvider } from '@/context/LogoutContext';
import mobileAds from 'react-native-google-mobile-ads';
import {
  getTrackingPermissionsAsync,
  PermissionStatus,
  requestTrackingPermissionsAsync,
} from 'expo-tracking-transparency';



import { useEffect, useState } from 'react';

function AppContent() {
  const { isConnected } = useConnectivity();
  const { isAuthenticated } = useAuth();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    async function initialize() {
      const { status } = await getTrackingPermissionsAsync();
      if (status === PermissionStatus.UNDETERMINED) {
        await requestTrackingPermissionsAsync();
      }

      await mobileAds().initialize();
      setInitialized(true);
    }

    initialize();
  }, []);

  if (!initialized) {
    // Render a loading screen or nothing while initializing
    return null;
  }

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

  if (!isConnected) {
    // Render offline screen when no connectivity
    return <OfflineScreen />;
  }

  // Render main application when authenticated and connected
  return (
    <Stack screenOptions={{
      headerShown: false, // Hide the header
    }}>
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

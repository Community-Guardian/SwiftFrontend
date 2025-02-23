import { Stack } from 'expo-router';
import { ThemeProvider } from '@/context/ThemeContext';
import { ConnectivityProvider, useConnectivity } from '@/context/ConnectivityContext';
import OfflineScreen from '@/app/screens/OfflineScreen';
import { PermissionsProvider } from '@/context/PermissionsContext ';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { CreateTradingAccountProvider } from '@/context/CreateTradingAccountContext';
import { ReferralsProvider } from '@/context/ReferralsContext';
import { LogoutProvider } from '@/context/LogoutContext';
import mobileAds from 'react-native-google-mobile-ads';
import {
  getTrackingPermissionsAsync,
  PermissionStatus,
  requestTrackingPermissionsAsync,
} from 'expo-tracking-transparency';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';


import { useEffect, useState } from 'react';
function AppContent() {
  const { isConnected } = useConnectivity();
  const { isAuthenticated } = useAuth();
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();
  const url = Linking.useURL();

  useEffect(() => {
    if (url) {
      const { hostname, path, queryParams } = Linking.parse(url);
      console.log('url', url);
      console.log(
        `Linked to app with hostname: ${hostname}, path: ${path} and data: ${JSON.stringify(queryParams)}`
      );
      if (queryParams && typeof queryParams.code === 'string') {
        router.push(`/?code=${queryParams.code}`);
      }
    }
  }, [url, router]);

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

  if (!isConnected) {
    // Render offline screen when no connectivity
    return <OfflineScreen />;
  }

  if (!isAuthenticated) {
    // Render authentication-related screens
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    );
  }

  // Render main application when authenticated and connected
  return (
    <Stack screenOptions={{ headerShown: false }}>
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

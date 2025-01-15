import { Stack } from 'expo-router';
import { ThemeProvider } from '@/context/ThemeContext';
import { ConnectivityProvider, useConnectivity } from '@/context/ConnectivityContext';
import OfflineScreen from '@/app/screens/OfflineScreen';
import { PermissionsProvider } from '@/context/PermissionsContext ';

function AppContent() {
  const { isConnected } = useConnectivity();

  if (!isConnected) {
    return <OfflineScreen />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="screens" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayoutNav() {
  return (
    <PermissionsProvider>
      <ConnectivityProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </ConnectivityProvider>
    </PermissionsProvider>
  );
}

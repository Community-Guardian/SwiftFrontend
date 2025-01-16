import { Stack , useRouter } from 'expo-router';
import React from 'react';
import { PermissionsProvider } from '@/context/PermissionsContext ';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { PaymentsProvider } from '@/context/PaymentsContext';
import { ServicesProvider } from '@/context/ServicesContext';
import { LogsProvider } from '@/context/LogsContext';
import { FeedbackProvider } from '@/context/FeedbackContext';
import { ArticlesProvider } from '@/context/ArticlesContext';
import { NotificationsProvider } from '@/context/NotificationsContext';
import { ThemeProvider,useTheme } from '@/context/ThemeContext';
import { lightTheme, darkTheme } from '@/styles/theme';
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


function AppContent() {
  return (
    <Stack
      screenOptions={{
        headerShown: true, // Hide the header
      }}
    >
      <Stack.Screen
        name="OfflineScreen" // Matches with the login.tsx screen
        options={{ title: 'Offline' }}
      />
      <Stack.Screen
        name="paid-services" // Matches with the login.tsx screen
        options={{ title: 'Paid services',headerLeft: () => <BackButton />,
        }}
      />   
      <Stack.Screen
        name="verify-account" // Matches with the verify-account.tsx screen
        options={{ title: 'Verify Account' }}
      />  
      <Stack.Screen
        name="UpdateUserProfile" // Matches with the verify-account.tsx screen
        options={{ title: 'Update User Profile' }}
      />  
    </Stack>
  );
}
export default function ScreensLayout() {
  return (
  <PaymentsProvider>
    <ServicesProvider>
      <LogsProvider>
        <FeedbackProvider>
          <ArticlesProvider>
            <NotificationsProvider>
              <AppContent />
            </NotificationsProvider>
          </ArticlesProvider>
        </FeedbackProvider>
      </LogsProvider>
    </ServicesProvider>
</PaymentsProvider>
)
}
function BackButton() {
  const router = useRouter();
  const { theme } = useTheme();
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;
  const color = currentTheme.text;
  return (
    <TouchableOpacity
      onPress={() => router.replace('/(tabs)')} // Navigate to the "Home" screen
      style={{ marginLeft: 5 }}
    >
      <Ionicons name="arrow-back" size={26} color={color} />
    </TouchableOpacity>
  );
}

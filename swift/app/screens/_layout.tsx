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
import { ReferralsProvider } from '@/context/ReferralsContext';
import { FinanceProvider } from '@/context/FinanceContext';
function BackButton() {
  const router = useRouter();
  const { theme } = useTheme();
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;
  const color = currentTheme.text;
  return (
    <TouchableOpacity
      onPress={() => router.replace('/(tabs)')} // Navigate to the "Home" screen
      style={{ marginLeft: 20 }}
    >
      <Ionicons name="arrow-back" size={26} color={color} />
    </TouchableOpacity>
  );
}

function AuthButton() {
  const router = useRouter();
  const { theme } = useTheme();
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;
  const color = currentTheme.text;
  return (
    <TouchableOpacity
      onPress={() => router.replace('/(auth)')} // Navigate to the "Home" screen
      style={{ marginLeft: 20 }}
    >
      <Ionicons name="arrow-back" size={26} color={color} />
    </TouchableOpacity>
  );
}
function AppContent() {
  const { theme } = useTheme();
  const themeColors = theme === 'light' ? lightTheme : darkTheme;

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: themeColors.background,
        },
        headerTintColor: themeColors.text,
        headerTitleStyle: {
          color: themeColors.text,
        },
      }}
    >
      <Stack.Screen
        name="OfflineScreen"
        options={{ title: 'Offline' }}
      />
      <Stack.Screen
        name="paid-services"
        options={{ title: 'Paid services', headerLeft: () => <BackButton /> }}
      />
      <Stack.Screen
        name="verify-account"
        options={{ title: 'Verify Account', headerLeft: () => <AuthButton /> }}
      />
      <Stack.Screen
        name="UpdateUserProfile"
        options={{ title: 'User Profile', headerLeft: () => <BackButton /> }}
      />
      <Stack.Screen
        name="TrackInvestments"
        options={{ title: 'Investments', headerLeft: () => <BackButton /> }}
      />
      <Stack.Screen
        name="blogs"
        options={{ title: 'Articles', headerLeft: () => <BackButton /> }}
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
              <ReferralsProvider>
                <FinanceProvider>
                        <AppContent />
                </FinanceProvider>
              </ReferralsProvider>
            </NotificationsProvider>
          </ArticlesProvider>
        </FeedbackProvider>
      </LogsProvider>
    </ServicesProvider>
</PaymentsProvider>
)
}

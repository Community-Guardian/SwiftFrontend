import { Tabs,useRouter } from 'expo-router';
import { lightTheme, darkTheme } from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, Text } from 'react-native';
import { ThemeProvider,useTheme } from '@/context/ThemeContext';
import { ConnectivityProvider, useConnectivity } from '@/context/ConnectivityContext';
import { PermissionsProvider } from '@/context/PermissionsContext ';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { PaymentsProvider } from '@/context/PaymentsContext';
import { ServicesProvider } from '@/context/ServicesContext';
import { LogsProvider } from '@/context/LogsContext';
import { FeedbackProvider } from '@/context/FeedbackContext';
import { ArticlesProvider } from '@/context/ArticlesContext';
import { NotificationsProvider } from '@/context/NotificationsContext';

function AppContent() {
  const { theme } = useTheme();
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;
  const { isAuthenticated } = useAuth(); // Check if user is authenticated
  const router = useRouter()
  if (!isAuthenticated) {
    // If user is not authenticated, redirect to login or show a different screen
    router.push('/(auth)/index')
  }
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: currentTheme.background,
        },
        tabBarActiveTintColor: currentTheme.primary,
        tabBarInactiveTintColor: currentTheme.text,
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
          color: currentTheme.text,
        },
        headerStyle: {
          backgroundColor: currentTheme.card,
        },
        headerTitleStyle: {
          color: currentTheme.text,
          fontSize: 20,
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="enroll"
        options={{
          headerTitle: 'ENROLL FOR CLASSES',
          title: 'Enroll',
          tabBarIcon: ({ color }) => <Ionicons name="book" size={24} color={color} />,
          headerLeft: () => <BackButton />,
        }}
      />
      <Tabs.Screen
        name="invest"
        options={{
          headerTitle: 'Invest With Us',
          title: 'Invest ',
          tabBarIcon: ({ color }) => <Ionicons name="trending-up" size={24} color={color} />,
          headerLeft: () => <BackButton />,
        }}
      />
      <Tabs.Screen
        name="subscribe"
        options={{
          headerTitle: 'Subscribe for Signals',
          title: 'Subscribe',
          tabBarIcon: ({ color }) => <Ionicons name="notifications" size={24} color={color} />,
          headerLeft: () => <BackButton />,
        }}
      />
    <Tabs.Screen
        name="earn"
        options={{
          headerTitle: 'Earn with us',
          title: 'earn',
          tabBarIcon: ({ color }) => <Ionicons name="cash" size={24} color={color} />,
          headerLeft: () => <BackButton />,
        }}
      />
    </Tabs>
  );
}
export default function TabLayout() {
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
   );
}

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

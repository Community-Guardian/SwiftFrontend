import { Tabs } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';

export default function TabLayout() {
  const { theme } = useTheme();
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;
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
    </Tabs>
  );
}

function BackButton() {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.replace('/(tabs)')} // Navigate to the "Home" screen
      style={{ marginLeft: 20 }}
    >
      <Ionicons name="arrow-back-circle-outline" size={26} color="#2196F3" />
    </TouchableOpacity>
  );
}

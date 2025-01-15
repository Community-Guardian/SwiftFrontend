// StellarPhysio/app/components/SearchBar.tsx
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const screens = [
  { name: 'Appointments', path: '/appointments' },
  { name: 'Services', path: '/services' },
  { name: 'Achievements', path: '/CertificationScreen' },
  { name: 'Articles', path: '/articles' },
  { name: 'Notifications', path: '/(tabs)/(dashboard)/NotificationsScreen' },
  { name: 'System Settings', path: '/(admin)/SystemSettingsScreen' },
  { name: 'Logs', path: '/(admin)/LogsScreen' },
  { name: 'Reports', path: '/(admin)/ReportsScreen' },
  { name: 'Manage Users', path: '/(admin)/ManageUsersScreen' },
  { name: 'Approve Accounts', path: '/(admin)/ApproveAccountsScreen' },
  { name: 'Payment History', path: '/payment_history' },
  { name: 'Book Appointment', path: '/book_appointment' },
  { name: 'Profile', path: '/(tabs)/(profile)/index' },
  { name: 'More', path: '/(tabs)/(more)/index' },
  { name: 'Help', path: '/(tabs)/(more)/HelpScreen' },
  { name: 'Contact Us', path: '/(tabs)/(more)/ContactUsScreen' },
  { name: 'Feedback', path: '/(tabs)/(more)/feedback' },
  { name: 'Inventory', path: '/(admin)/(inventory)/index' },
  { name: 'Wellness Coach', path: '/Screens/WellnessCoachScreen' },
  { name: 'Nutritionist', path: '/Screens/NutritionistScreen' },
  { name: 'Physiotherapist', path: '/Screens/PhysiotherapistScreen' },
  { name: 'Registration', path: '/(auth)/register' },
  { name: 'Login', path: '/Screens/LoginScreen1' },
  { name: 'Welcome', path: '/Screens/WelcomeScreen' },
  { name: 'About Us', path: '/Screens/AboutUsScreen' },
];

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredScreens, setFilteredScreens] = useState(screens);
  const router = useRouter();

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = screens.filter(screen =>
      screen.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredScreens(filtered);
  };

  const handleSelectScreen = (path: string) => {
    router.push(path);
    setSearchQuery('');
    setFilteredScreens(screens);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      {searchQuery.length > 0 && (
        <FlatList
          data={filteredScreens}
          keyExtractor={(item) => item.path}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.resultItem} onPress={() => handleSelectScreen(item.path)}>
              <Ionicons name="search" size={20} color="#333" style={styles.resultIcon} />
              <Text style={styles.resultText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1,
    width: '80%',
  },
  searchBar: {
    height: 40,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#333',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultIcon: {
    marginRight: 10,
  },
  resultText: {
    fontSize: 14,
    color: '#333',
  },
});

export default SearchBar;
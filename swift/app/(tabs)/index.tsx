import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '../../components/Card';
import { Sidebar } from '../../components/Sidebar';
import { useTheme } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const themeColors = theme === 'light' ? lightTheme : darkTheme;

  useEffect(() => {
    // Simulate an initialization process
    const timeout = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timeout);
  }, []);

  const toggleSidebar = () => setSidebarVisible((prev) => !prev);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color={themeColors.primary} />
        <Text style={[styles.loadingText, { color: themeColors.text }]}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Sidebar */}
      <Modal
        visible={isSidebarVisible}
        transparent
        animationType="slide"
        onRequestClose={toggleSidebar}
      >
        <Sidebar closeSidebar={toggleSidebar} />
      </Modal>

      <View style={styles.header}>
        {/* Hamburger Menu */}
        <TouchableOpacity onPress={toggleSidebar} style={styles.hamburger}>
          <View style={[styles.line, { backgroundColor: themeColors.text }]} />
          <View style={[styles.line, { backgroundColor: themeColors.text }]} />
          <View style={[styles.line, { backgroundColor: themeColors.text }]} />
        </TouchableOpacity>

        {/* Theme Toggle */}
        <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
          <Ionicons
            name={theme === 'light' ? 'moon' : 'sunny'}
            size={24}
            color={themeColors.text}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {[
          { title: 'Enroll for Courses', route: '/enroll', color: themeColors.secondary },
          { title: 'Buy Signals', route: '/subscribe', color: themeColors.primary },
          { title: 'Invest With Us', route: '/invest', color: themeColors.primary },
          { title: 'Earn With Us', route: '/earn', color: themeColors.secondary },
        ].map((item, index) => (
          <Card
            key={index}
            title={item.title}
            onPress={() => router.push(item.route)}
            style={StyleSheet.flatten([styles.card, { backgroundColor: item.color }])}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  hamburger: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    width: 24,
    height: 3,
    marginVertical: 2,
    borderRadius: 2,
  },
  themeToggle: {
    padding: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '40%',
    marginBottom: 16,
    aspectRatio: 1,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
});

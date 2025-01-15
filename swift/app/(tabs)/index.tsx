import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '../../components/Card';
import { Sidebar } from '../../components/Sidebar';
import { useTheme } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const themeColors = theme === 'light' ? lightTheme : darkTheme;

  const toggleSidebar = () => setSidebarVisible((prev) => !prev);

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
          { title: 'Enroll for Courses', route: '/enroll' as const, color: themeColors.secondary },
          { title: 'Buy Signals', route: '/subscribe' as const, color: themeColors.primary },
          { title: 'Invest With Us', route: '/invest' as const, color: themeColors.primary },
          { title: 'Earn With Us', route: '/earn' as const, color: themeColors.secondary },
        ].map((item, index) => (
          <Card
            key={index}
            title={item.title}
            onPress={() => router.push(item.route)}
            style={StyleSheet.flatten([styles.card, { backgroundColor: item.color }])}
          />
        ))}
      </View>

      {/* Google Ad Space */}
      {/* <View style={styles.adContainer}>
        <AdMobBanner
          bannerSize="fullBanner"
          adUnitID="ca-app-pub-3940256099942544/9214589741" // Replace with your own Ad Unit ID
          servePersonalizedAds // Enable personalized ads
          onDidFailToReceiveAdWithError={(error) => console.error('Ad failed to load:', error)}
        />
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
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
  adContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
});

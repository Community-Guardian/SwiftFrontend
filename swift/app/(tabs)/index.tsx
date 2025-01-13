import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '../../components/Card';
import { Sidebar } from '../../components/Sidebar'; // Import your Sidebar component
import { useTheme } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../styles/theme';
import { ThemeToggle } from '../../components/ThemeToggle';

export default function HomeScreen() {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();
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
          <View style={styles.line} />
          <View style={styles.line} />
          <View style={styles.line} />
        </TouchableOpacity>
        {/* Theme Toggle */}
        <ThemeToggle />
      </View>

      <View style={styles.grid}>
        {[
          { title: "Enroll for Courses", route: "/enroll", color: themeColors.secondary },
          { title: "Buy Signals", route: "/subscribe", color: themeColors.primary },
          { title: "Invest With Us", route: "/invest", color: themeColors.primary },
          { title: "Earn With Us", route: "/enroll", color: themeColors.secondary },
        ].map((item, index) => (
          <Card
            key={index}
            title={item.title}
            onPress={() => router.push(item.route)}
            style={[styles.card, { backgroundColor: item.color }]}
          />
        ))}
      </View>
      <Card
        title="Get the Book"
        onPress={() => {}}
        style={[styles.bookButton, { backgroundColor: themeColors.primary }]}
      />
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
    backgroundColor: '#333',
    marginVertical: 2,
    borderRadius: 2,
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
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bookButton: {
    position: 'absolute',
    bottom: 32,
    left: 16,
    right: 16,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});

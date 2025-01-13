import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';

export const Sidebar = ({ closeSidebar }) => {
  const { theme } = useTheme();
  const themeColors = theme === 'light' ? lightTheme : darkTheme;

  const menuItems = [
    { icon: 'home', title: 'Home', action: () => {} },
    { icon: 'people', title: 'About Us', action: () => {} },
    { icon: 'document-text', title: 'Privacy Policy', action: () => {} },
    { icon: 'book', title: 'Read Blogs', action: () => {} },
    { icon: 'log-out', title: 'Log Out', action: () => {} },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: themeColors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{
            uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Dashboard-B1wa8xqYxa63FLrebRj7v68NUI2Iyb.png',
          }}
          style={styles.avatar}
        />
        <Text style={[styles.name, { color: themeColors.text }]}>LUKE SHAW</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuItem, { borderBottomColor: themeColors.border }]}
            onPress={item.action}
          >
            <Ionicons name={item.icon as any} size={24} color={themeColors.text} />
            <Text style={[styles.menuText, { color: themeColors.text }]}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Close Button */}
      <TouchableOpacity onPress={closeSidebar} style={styles.closeButton}>
        <Ionicons name="close" size={28} color={themeColors.text} />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '80%',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  content: {
    paddingBottom: 20,
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  menuContainer: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  menuText: {
    marginLeft: 15,
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 8,
  },
});

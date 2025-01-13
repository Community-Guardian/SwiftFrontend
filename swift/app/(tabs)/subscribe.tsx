import React from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';

const signals = [
  {
    id: '1',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Subscribe-12cQubHmyJFAuI6LJF3iCNQMq1F3ek.png',
    duration: '3 Week',
    price: '250 USD',
  },
  {
    id: '2',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Subscribe-12cQubHmyJFAuI6LJF3iCNQMq1F3ek.png',
    duration: '3 Week',
    price: '300 USD',
  },
  {
    id: '3',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Subscribe-12cQubHmyJFAuI6LJF3iCNQMq1F3ek.png',
    duration: '3 Week',
    price: '500 USD',
  },
  {
    id: '4',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Subscribe-12cQubHmyJFAuI6LJF3iCNQMq1F3ek.png',
    duration: '3 Week',
    price: '500 USD',
  },
];

export default function SubscribeScreen() {
  const { theme } = useTheme();
  const themeColors = theme === 'light' ? lightTheme : darkTheme;

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColors.text }]}>
          Subscribe for Signals
        </Text>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: themeColors.card }]}>
        <Ionicons name="search" size={20} color={themeColors.text} />
        <TextInput
          placeholder="Search..."
          placeholderTextColor={themeColors.text}
          style={[styles.searchInput, { color: themeColors.text }]}
        />
      </View>

      <Text style={[styles.subtitle, { color: themeColors.text }]}>All Signals</Text>

      <FlatList
        data={signals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.signalCard, { backgroundColor: themeColors.card }]}>
            <Image source={{ uri: item.image }} style={styles.signalImage} />
            <View style={styles.signalInfo}>
              <Text style={[styles.duration, { color: themeColors.text }]}>
                {item.duration}
              </Text>
              <TouchableOpacity
                style={[styles.subscribeButton, { backgroundColor: themeColors.primary }]}
              >
                <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
              </TouchableOpacity>
              <Text style={[styles.price, { color: themeColors.text }]}>
                {item.price}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 8,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 8,
  },
  signalCard: {
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  signalImage: {
    width: '100%',
    height: 150,
  },
  signalInfo: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  duration: {
    fontSize: 16,
  },
  subscribeButton: {
    padding: 8,
    borderRadius: 4,
  },
  subscribeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});


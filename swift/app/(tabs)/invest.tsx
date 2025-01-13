import React from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';

const investments = [
  { id: '1', amount: '100 USD', duration: '3 Week' },
  { id: '2', amount: '100 USD', duration: '3 Week' },
  { id: '3', amount: '100 USD', duration: '3 Week' },
  { id: '4', amount: '100 USD', duration: '3 Week' },
];

export default function InvestScreen() {
  const { theme } = useTheme();
  const themeColors = theme === 'light' ? lightTheme : darkTheme;

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColors.text }]}>
          Invest With Us
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

      <Text style={[styles.interestText, { color: themeColors.text }]}>
        With Interest of 5% Per Week
      </Text>

      <FlatList
        data={investments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.investmentCard, { backgroundColor: themeColors.card }]}>
            <View style={styles.investmentInfo}>
              <View style={[styles.amountContainer, { backgroundColor: themeColors.primary }]}>
                <Text style={styles.amount}>{item.amount}</Text>
              </View>
              <View style={[styles.durationContainer, { backgroundColor: themeColors.secondary }]}>
                <Text style={styles.duration}>{item.duration}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.investButton, { backgroundColor: themeColors.primary }]}
            >
              <Text style={styles.investButtonText}>Invest With Us</Text>
            </TouchableOpacity>
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
  interestText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 16,
  },
  investmentCard: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  investmentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  amountContainer: {
    padding: 8,
    borderRadius: 4,
    flex: 1,
    marginRight: 8,
  },
  durationContainer: {
    padding: 8,
    borderRadius: 4,
    flex: 1,
    marginLeft: 8,
  },
  amount: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  duration: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  investButton: {
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  investButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});


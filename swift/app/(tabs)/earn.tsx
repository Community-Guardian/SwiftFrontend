import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';

export default function EarnScreen() {
  const { theme } = useTheme();
  const themeColors = theme === 'light' ? lightTheme : darkTheme;
  const [email, setEmail] = useState('');
  const [referrals, setReferrals] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefer = () => {
    if (email) {
      setIsLoading(true);  // Set loading state to true
      setTimeout(() => {
        setReferrals([...referrals, email]);
        setEmail('');
        setIsLoading(false);  // Set loading state to false after operation
        Alert.alert('Success', 'Referral sent successfully!');
      }, 1500);  // Simulate delay for the referral process
    } else {
      Alert.alert('Error', 'Please enter an email address.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.title, { color: themeColors.text }]}>Earn With Us</Text>
      <Text style={[styles.subtitle, { color: themeColors.text }]}>
        Refer your friends and earn rewards!
      </Text>

      <View style={[styles.inputContainer, { backgroundColor: themeColors.card }]}>
        <Ionicons name="mail" size={20} color={themeColors.text} />
        <TextInput
          style={[styles.input, { color: themeColors.text }]}
          placeholder="Enter friend's email"
          placeholderTextColor={themeColors.text}
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <TouchableOpacity onPress={handleRefer} style={[styles.button, { backgroundColor: themeColors.primary }]}>
        <Text style={styles.buttonText}>Refer Now</Text>
      </TouchableOpacity>

      {/* Loading indicator */}
      {isLoading && <ActivityIndicator size="large" color={themeColors.primary} style={styles.loadingIndicator} />}

      <Text style={[styles.referralsTitle, { color: themeColors.text }]}>Your Referrals</Text>
      <FlatList
        data={referrals}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={[styles.referralItem, { backgroundColor: themeColors.card }]}>
            <Text style={[styles.referralText, { color: themeColors.text }]}>{item}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  referralsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  referralItem: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  referralText: {
    fontSize: 16,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
});

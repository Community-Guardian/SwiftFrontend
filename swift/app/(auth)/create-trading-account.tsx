import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useCreateTradingAccount } from '@/context/CreateTradingAccountContext';
import { CustomButton } from '@/components/CustomButton';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CreateTradingAccountScreen = () => {
  const router = useRouter();
  const { setHasSkipped } = useCreateTradingAccount();

  const handleSkip = async () => {
    await setHasSkipped(true);
    router.push('/(tabs)');
  };

  const handleCreateAccount = () => {
    // Handle create trading account logic here
    setHasSkipped(true);
    router.push('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Ionicons name="wallet-outline" size={60} color="#4158D0" style={styles.icon} />
        <Text style={styles.title}>Create Trading Account</Text>
        <Text style={styles.subtitle}>
          Start trading by creating a new account tailored for your needs.
        </Text>

        <CustomButton 
          title="Create Account" 
          onPress={handleCreateAccount}
        />
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7', // Replace gradient with solid color
  },
  card: {
    width: width * 0.9,
    maxWidth: 400,
    padding: 30,
    borderRadius: 20,
    backgroundColor: 'white', // Keep the card's background white
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 24,
  },
  skipButton: {
    marginTop: 20,
  },
  skipButtonText: {
    color: '#4158D0',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default CreateTradingAccountScreen;

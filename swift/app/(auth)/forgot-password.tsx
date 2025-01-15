import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '@/components/Button'; // Reuse your Button component

const ForgotPasswordScreen: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!emailOrPhone) {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call for password reset
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Replace with your API call
      Alert.alert(
        'Password Reset Sent',
        'Instructions to reset your password have been sent to your email .'
      );
      router.replace('/login');
    } catch (error) {
      console.error('Password reset error:', error);
      Alert.alert('Error', 'Failed to send password reset instructions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.description}>
        Enter your email or phone number to reset your password.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Email "
        value={emailOrPhone}
        onChangeText={setEmailOrPhone}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button
        title="Send Reset Instructions"
        onPress={handleResetPassword}
        disabled={loading}
      />
      <TouchableOpacity
        style={styles.backToLogin}
        onPress={() => router.replace('/login')}
      >
        <Text style={styles.backToLoginText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#777',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  backToLogin: {
    marginTop: 16,
    alignSelf: 'center',
  },
  backToLoginText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;

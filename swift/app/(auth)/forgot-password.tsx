import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { CustomButton } from '@/components/CustomButton';
import { useTheme } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../styles/theme';

const ForgotPasswordScreen: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();
  const themeColors = theme === 'light' ? lightTheme : darkTheme;

  const handleResetPassword = async () => {
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!emailOrPhone) {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }
  
    if (!emailRegex.test(emailOrPhone)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }
  
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      Alert.alert('Success', 'Password reset instructions sent to your email.');
      router.replace('/(auth)');
    } catch (error) {
      Alert.alert('Error', 'Failed to send password reset instructions. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.title, { color: themeColors.text }]}>Forgot Password</Text>
      <Text style={[styles.description, { color: themeColors.text }]}>
        Enter your email or phone number to reset your password.
      </Text>
      <TextInput
        style={[styles.input, { backgroundColor: themeColors.card, color: themeColors.text, borderColor: themeColors.border }]}
        placeholder="Email"
        placeholderTextColor={theme === 'light' ? '#666666' : '#999999'}
        value={emailOrPhone}
        onChangeText={setEmailOrPhone}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <CustomButton
        title="Send Reset Instructions"
        onPress={handleResetPassword}
        loading={loading}
      />
      <TouchableOpacity
        style={styles.backToLogin}
        onPress={() => router.replace('/(auth)')}
      >
        <Text style={[styles.backToLoginText, { color: themeColors.primary }]}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  backToLogin: {
    marginTop: 16,
    alignSelf: 'center',
  },
  backToLoginText: {
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;
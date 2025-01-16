import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { CustomButton } from '@/components/CustomButton';
import { useTheme } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../styles/theme';
import axios from 'axios';
import { BASE_URL } from '@/handler/apiConfig';

const ForgotPasswordScreen: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success' | ''>('');
  const router = useRouter();
  const { theme } = useTheme();
  const themeColors = theme === 'light' ? lightTheme : darkTheme;

  const handleResetPassword = async () => {
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailOrPhone) {
      setMessage('Please enter your email.');
      setMessageType('error');
      return;
    }

    if (!emailRegex.test(emailOrPhone)) {
      setMessage('Please enter a valid email address.');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');
    setMessageType('');
    try {
      const response = await axios.post(`${BASE_URL}/user/password/reset/`, {
        email: emailOrPhone,
      });
      setMessage('Password reset instructions sent to your email.');
      setMessageType('success');
    } catch (error) {
      setMessage('Failed to send password reset instructions. Please try again.');
      setMessageType('error');
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
      {message ? (
        <Text style={[styles.message, messageType === 'error' ? styles.errorText : styles.successText]}>
          {message}
        </Text>
      ) : null}
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
  message: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
  },
  successText: {
    color: 'green',
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
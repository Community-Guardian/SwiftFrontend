import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import { useTheme } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../styles/theme';
import Checkbox from 'expo-checkbox';
import { useAuth } from '../../context/AuthContext';
import { useCreateTradingAccount } from '../../context/CreateTradingAccountContext';

export default function AuthScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const themeColors = theme === 'light' ? lightTheme : darkTheme;
  const { login, register, loading } = useAuth();
  const { hasSkipped, setHasSkipped } = useCreateTradingAccount();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    referralCode: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.email, formData.password, formData.password, 'customer');
        if (!hasSkipped) {
          router.push('/screens/verify-account');
        }
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.card}>
        <Text style={[styles.title, { color: themeColors.text }]}>
          {isLogin ? 'Login to your account.' : 'Sign Up'}
        </Text>

        <Text style={[styles.subtitle, { color: themeColors.text }]}>
          {isLogin ? 'Hello. Welcome back to your account' : 'Create a new account'}
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <ScrollView contentContainerStyle={styles.form}>
          <CustomInput
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />

          <CustomInput
            placeholder="Password"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            secureTextEntry
          />

          {!isLogin && (
            <>
              <CustomInput
                placeholder="Referral Code"
                value={formData.referralCode}
                onChangeText={(text) => setFormData({ ...formData, referralCode: text })}
              />

              <View style={styles.checkboxContainer}>
                <Checkbox
                  value={agreedToTerms}
                  onValueChange={setAgreedToTerms}
                  color={agreedToTerms ? '#2196F3' : undefined}
                />
                <Text style={[styles.termsText, { color: themeColors.text }]}>
                  I agree to Terms And Conditions
                </Text>
              </View>
            </>
          )}

          <View style={styles.rememberContainer}>
            <View style={styles.checkboxContainer}>
              <Checkbox
                value={rememberMe}
                onValueChange={setRememberMe}
                color={rememberMe ? '#2196F3' : undefined}
              />
              <Text style={[styles.rememberText, { color: themeColors.text }]}>
                Remember me
              </Text>
            </View>

            {isLogin && (
              <TouchableOpacity onPress={() => router.push('/forgot-password')}>
                <Text style={styles.forgotText}>Forgot Pass?</Text>
              </TouchableOpacity>
            )}
          </View>

          <CustomButton loading={loading} title={isLogin ? 'Login' : 'Sign Up'} onPress={handleAuth} />

          <CustomButton
            title={isLogin ? 'Create a new account' : 'Already have an account? Login'}
            onPress={() => setIsLogin(!isLogin)}
            variant="secondary"
          />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
  form: {
    flexGrow: 1,
  },
  rememberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    marginLeft: 8,
    fontSize: 14,
  },
  forgotText: {
    color: '#2196F3',
    fontSize: 14,
  },
  termsText: {
    marginLeft: 8,
    fontSize: 14,
  },
});

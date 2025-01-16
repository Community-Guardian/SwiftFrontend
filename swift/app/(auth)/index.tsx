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
import { useLogout } from '../../context/LogoutContext';
import { FontAwesome } from '@expo/vector-icons';  // Import an icon library for toggle
export default function AuthScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const themeColors = theme === 'light' ? lightTheme : darkTheme;
  const { login, register, loading } = useAuth();
  const { hasSkipped, setHasSkipped } = useCreateTradingAccount();
  const { setRememberMe } = useLogout();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    referralCode: '',
  });
  const [rememberMe, setRememberMeState] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);  // State for password visibility

  const handleAuth = async () => {
    try {
      if (isLogin) {
        try{
        await login(formData.email, formData.password);
        setRememberMe(rememberMe);          
        }
        catch(error){
          setError('Failed to login! Please try again and check credentials.');
        }
      } else {
        try{
        await register(formData.email, formData.password, formData.password, 'customer');
        }
        catch(error){
          if (error.email) {
            setError(error.email);
            return;
          }
          setError('Failed to register! Please try again');
          return;
        }
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
      <View style={[styles.card, { backgroundColor: themeColors.card, shadowColor: themeColors.shadow }]}>
        <Text style={[styles.title, { color: themeColors.text }]}>
          {isLogin ? 'Login to your account' : 'Sign Up'}
        </Text>
        <Text style={[styles.subtitle, { color: themeColors.text }]}>
          {isLogin ? 'Hello. Welcome back to your account' : 'Create a new account'}
        </Text>

        {error ? <Text style={[styles.errorText, { color: themeColors.error }]}>{error}</Text> : null}

        <ScrollView contentContainerStyle={styles.form}>
          <CustomInput
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />
          <View style={styles.passwordInputContainer}>
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.passwordToggle}>
              <FontAwesome
                name={passwordVisible ? 'eye' : 'eye-slash'}
                size={20}
                color={themeColors.text}
              />
            </TouchableOpacity>
          </View>
          <CustomInput
              placeholder="Password"
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              secureTextEntry={!passwordVisible}  // Toggle password visibility
            />


          {!isLogin && (
            <>
              {/* <CustomInput
                placeholder="Referral Code"
                value={formData.referralCode}
                onChangeText={(text) => setFormData({ ...formData, referralCode: text })}
              /> */}

              <View style={styles.checkboxContainer}>
                <Checkbox
                  value={agreedToTerms}
                  onValueChange={setAgreedToTerms}
                  color={agreedToTerms ? themeColors.primary : undefined}
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
                onValueChange={(value) => {
                  setRememberMeState(value);
                  setRememberMe(value);
                }}
                color={rememberMe ? themeColors.primary : undefined}
              />
              <Text style={[styles.rememberText, { color: themeColors.text }]}>
                Remember me
              </Text>
            </View>

            {isLogin && (
              <TouchableOpacity onPress={() => router.push('/forgot-password')}>
                <Text style={[styles.forgotText, { color: themeColors.primary }]}>Forgot Password?</Text>
              </TouchableOpacity>
            )}
          </View>

          <CustomButton
            loading={loading}
            title={isLogin ? 'Login' : 'Sign Up'}
            onPress={handleAuth}
            disabled={!isLogin && !agreedToTerms} // Disable for "Sign Up" until terms are agreed
          />
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
    padding: 16,
  },
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
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
    fontSize: 14,
  },
  termsText: {
    marginLeft: 8,
    fontSize: 14,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  passwordToggle: {
    position: 'absolute',
    right: 16,
    padding: 8,
  },
});

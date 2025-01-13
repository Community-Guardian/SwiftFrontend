import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import { useTheme } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../styles/theme';
import Checkbox from 'expo-checkbox';

export default function SignUpScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const themeColors = theme === 'light' ? lightTheme : darkTheme;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    referralCode: '',
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSignUp = () => {
    // Implement sign up logic here
    console.log('Sign up:', formData);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: themeColors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.title, { color: themeColors.text }]}>Sign Up</Text>

      <CustomInput
        placeholder="Name"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
      />

      <CustomInput
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
      />

      <CustomInput
        placeholder="Location"
        value={formData.location}
        onChangeText={(text) => setFormData({ ...formData, location: text })}
      />

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

      <CustomButton title="Sign Up" onPress={handleSignUp} />

      <CustomButton
        title="Already have an account? Login"
        onPress={() => router.push('/login')}
        variant="secondary"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  termsText: {
    marginLeft: 8,
    fontSize: 14,
  },
});


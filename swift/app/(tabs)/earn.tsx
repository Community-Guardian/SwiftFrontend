import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Share, FlatList } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../styles/theme';
import { useReferrals } from '../../context/ReferralsContext';
import { useAuth } from '../../context/AuthContext';
import { useRedirect } from '../../context/RedirectContext';

interface Referral {
  id: number;
  referrer: string;
  referred?: string | null;
  referral_code: string;
  reward_amount: string;
  created_at: string;
  is_successful: boolean;
}

export default function EarnScreen() {
  const { theme } = useTheme();
  const themeColors = theme === 'light' ? lightTheme : darkTheme;
  const { user } = useAuth();
  const { referrals, getReferrals, createReferral, loading } = useReferrals();
  const { createReferralLink } = useRedirect();

  useEffect(() => {
    getReferrals();
  }, []);

  const handleRefer = async () => {
    if (user && user.referral_code) {
      try {
        const referralLink = createReferralLink(user.referral_code);
        const result = await Share.share({
          message: `Join us and earn rewards! Use my referral link: ${referralLink}`,
        });

        if (result.action === Share.sharedAction) {
          if (!result.activityType) {
            await createReferral({ referrer: user.referral_code });
            Alert.alert('Success', 'Referral sent successfully!');
          }
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to send referral.');
      }
    } else {
      Alert.alert('Error', 'User referral code not found.');
    }
  };

  const renderReferral = ({ item }: { item: Referral }) => (
    <View style={[styles.referralCard, { backgroundColor: themeColors.card }]}>
      <Text style={[styles.referralText, { color: themeColors.text }]}>
        Referred: {item.referred || 'N/A'}
      </Text>
      <Text style={[styles.referralText, { color: themeColors.text }]}>
        Reward: ${item.reward_amount}
      </Text>
      <Text style={[styles.referralText, { color: themeColors.text }]}>
        Date: {new Date(item.created_at).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.title, { color: themeColors.text }]}>Earn With Us</Text>
      <Text style={[styles.subtitle, { color: themeColors.text }]}>
        Refer your friends and earn rewards!
      </Text>

      <TouchableOpacity onPress={handleRefer} style={[styles.button, { backgroundColor: themeColors.primary }]}>
        <Text style={styles.buttonText}>Share Referral Link</Text>
      </TouchableOpacity>

      <Text style={[styles.referralsTitle, { color: themeColors.text }]}>Your Referrals</Text>
      {loading ? (
        <Text style={{ color: themeColors.text, textAlign: 'center' }}>Loading referrals...</Text>
      ) : referrals.length > 0 ? (
        <FlatList
          data={referrals}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderReferral}
          contentContainerStyle={styles.referralsList}
        />
      ) : (
        <Text style={{ color: themeColors.text, textAlign: 'center' }}>No referrals yet.</Text>
      )}
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
  referralsList: {
    paddingBottom: 20,
  },
  referralCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  referralText: {
    fontSize: 14,
    marginBottom: 5,
  },
});

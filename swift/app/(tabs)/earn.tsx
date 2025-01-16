import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Share, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { useReferrals } from '../../context/ReferralsContext';
import { useAuth } from '../../context/AuthContext';

export default function EarnScreen() {
  const { theme } = useTheme();
  const themeColors = theme === 'light' ? lightTheme : darkTheme;
  const { user } = useAuth();
  const { referrals, getReferrals, createReferral, loading } = useReferrals();

  useEffect(() => {
    getReferrals();
  }, []);

  const handleRefer = async () => {
    if (user && user.referral_code) {
      try {
        const result = await Share.share({
          message: `Join us and earn rewards! Use my referral code: ${user.referral_code}`,
        });

        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
            await createReferral({ referrer: user.referral_code });
            Alert.alert('Success', 'Referral sent successfully!');
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to send referral.');
      }
    } else {
      Alert.alert('Error', 'User referral code not found.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.title, { color: themeColors.text }]}>Earn With Us</Text>
      <Text style={[styles.subtitle, { color: themeColors.text }]}>
        Refer your friends and earn rewards!
      </Text>

      <TouchableOpacity onPress={handleRefer} style={[styles.button, { backgroundColor: themeColors.primary }]}>
        <Text style={styles.buttonText}>Share Referral Code</Text>
      </TouchableOpacity>

      {/* Loading indicator */}
      {loading && <ActivityIndicator size="large" color={themeColors.primary} style={styles.loadingIndicator} />}

      <Text style={[styles.referralsTitle, { color: themeColors.text }]}>Your Referrals</Text>
      {referrals.length === 0 ? (
        <Text style={[styles.noReferralsText, { color: themeColors.text }]}>
          You have no referrals yet. Share your referral code to start earning rewards!
        </Text>
      ) : (
        <FlatList
          data={referrals}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.referralItem, { backgroundColor: themeColors.card }]}>
              <Text style={[styles.referralText, { color: themeColors.text }]}>
                {item.referrer} - Reward: {item.reward_amount}
              </Text>
            </View>
          )}
        />
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
  noReferralsText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
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
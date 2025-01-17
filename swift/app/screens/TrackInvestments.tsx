import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../styles/theme';
import { useFinance } from '../../context/FinanceContext';
import { CustomButton } from '../../components/CustomButton';
import { CustomInput } from '../../components/CustomInput';
import { useReferrals } from '@/context/ReferralsContext';
interface Investment {
    id: number;
    user: string;
    amount: number;
    start_date: string;
    duration_days: number;
    interest_rate: number;
    created_at: string;
    updated_at: string;
  }
  
export default function TrackInvestmentsScreen() {
  const { theme } = useTheme();
  const themeColors = theme === 'light' ? lightTheme : darkTheme;
  const { investments, getInvestments } = useFinance();
  const { createWithdrawalRequest,loading } = useReferrals();
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);

  useEffect(() => {
    getInvestments();
  }, []);

  const handleRequestWithdrawal = async () => {
    if (!selectedInvestment || !withdrawalAmount) {
      Alert.alert('Error', 'Please select an investment and enter an amount.');
      return;
    }

    try {
      await createWithdrawalRequest({
        user: selectedInvestment.user,
        amount: withdrawalAmount,
      });
      Alert.alert('Success', 'Withdrawal request submitted successfully!');
      setWithdrawalAmount('');
      setSelectedInvestment(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit withdrawal request.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.title, { color: themeColors.text }]}>Track Investments</Text>
      {loading ? (
        <ActivityIndicator size="large" color={themeColors.primary} style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={investments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.investmentCard, { backgroundColor: themeColors.card }]}
              onPress={() => setSelectedInvestment(item)}
            >
              <Text style={[styles.investmentText, { color: themeColors.text }]}>
                Amount: Ksh {item.amount}
              </Text>
              <Text style={[styles.investmentText, { color: themeColors.text }]}>
                Duration: {item.duration_days} days
              </Text>
              <Text style={[styles.investmentText, { color: themeColors.text }]}>
                Interest Rate: {item.interest_rate}%
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {selectedInvestment && (
        <View style={styles.withdrawalContainer}>
          <Text style={[styles.withdrawalTitle, { color: themeColors.text }]}>Request Withdrawal</Text>
          <CustomInput
            placeholder="Enter amount"
            value={withdrawalAmount}
            onChangeText={setWithdrawalAmount}
            keyboardType="numeric"
          />
          <CustomButton title="Submit Request" onPress={handleRequestWithdrawal} />
        </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  investmentCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  investmentText: {
    fontSize: 16,
    marginBottom: 8,
  },
  withdrawalContainer: {
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  withdrawalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
});
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
  const { createWithdrawalRequest, loading } = useReferrals();
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

  const renderInvestmentCard = ({ item }: { item: Investment }) => (
    <TouchableOpacity
      style={[
        styles.investmentCard,
        { backgroundColor: selectedInvestment?.id === item.id ? themeColors.primary : themeColors.card },
      ]}
      onPress={() => setSelectedInvestment(item)}
    >
      <Text style={[styles.cardTitle, { color: themeColors.text }]}>Investment #{item.id}</Text>
      <Text style={[styles.investmentText, { color: themeColors.text }]}>
        Amount: <Text style={styles.boldText}>Ksh {item.amount}</Text>
      </Text>
      <Text style={[styles.investmentText, { color: themeColors.text }]}>
        Duration: <Text style={styles.boldText}>{item.duration_days} days</Text>
      </Text>
      <Text style={[styles.investmentText, { color: themeColors.text }]}>
        Interest Rate: <Text style={styles.boldText}>{item.interest_rate}%</Text>
      </Text>
      <Text style={[styles.investmentText, { color: themeColors.text }]}>
        Start Date: <Text style={styles.boldText}>{new Date(item.start_date).toLocaleDateString()}</Text>
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {loading ? (
        <ActivityIndicator size="large" color={themeColors.primary} style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={investments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderInvestmentCard}
          contentContainerStyle={styles.listContent}
        />
      )}

      {selectedInvestment && (
        <View style={[styles.withdrawalContainer, { backgroundColor: themeColors.card }]}>
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
  loadingIndicator: {
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  investmentCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  investmentText: {
    fontSize: 16,
    marginBottom: 6,
  },
  boldText: {
    fontWeight: 'bold',
  },
  withdrawalContainer: {
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
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

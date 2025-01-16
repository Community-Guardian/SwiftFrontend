import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Sidebar } from '../../components/Sidebar';
import { useTheme } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { useReferrals } from '../../context/ReferralsContext';

export default function HomeScreen() {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const themeColors = theme === 'light' ? lightTheme : darkTheme;
  const { rewards, getRewards } = useReferrals();
  const [totalRewards, setTotalRewards] = useState(0);

  useEffect(() => {
    // Simulate an initialization process
    const timeout = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    getRewards();
  }, []);

  useEffect(() => {
    const total = rewards.reduce((sum, reward) => sum + parseFloat(reward.reward_amount || '0'), 0);
    setTotalRewards(total);
  }, [rewards]);

  const toggleSidebar = () => setSidebarVisible((prev) => !prev);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color={themeColors.primary} />
        <Text style={[styles.loadingText, { color: themeColors.text }]}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Sidebar */}
      <Modal
        visible={isSidebarVisible}
        transparent
        animationType="slide"
        onRequestClose={toggleSidebar}
      >
        <Sidebar closeSidebar={toggleSidebar} />
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.hamburger}>
          <Ionicons name="menu" size={28} color={themeColors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
          <Ionicons
            name={theme === 'light' ? 'moon' : 'sunny'}
            size={24}
            color={themeColors.text}
          />
        </TouchableOpacity>
      </View>

      {/* Grid */}
      <View style={styles.grid}>
        {[{
          title: 'Enroll for Courses',
          route: '/enroll',
          colors: ['#6A11CB', '#2575FC'],
        },
        {
          title: 'Buy Signals',
          route: '/subscribe',
          colors: ['#FF6F61', '#D91E18'],
        },
        {
          title: 'Invest With Us',
          route: '/invest',
          colors: ['#4CAF50', '#087F23'],
        },
        {
          title: 'Earn With Us',
          route: '/earn',
          colors: ['#FDC830', '#F37335'],
        }].map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => router.push(item.route)}
            style={styles.cardWrapper}
          >
            <LinearGradient
              colors={item.colors}
              style={styles.card}
              start={[0, 0]}
              end={[1, 1]}
            >
              <Text style={[styles.cardText, { color: themeColors.cardText }]}>
                {item.title}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

      {/* Total Rewards Card */}
      <View style={styles.rewardsCardContainer}>
        <LinearGradient
          colors={['#34E89E', '#0F3443']}
          style={styles.rewardsCard}
        >
          <Text style={styles.rewardTitle}>Total Rewards</Text>
          <Text style={styles.rewardAmount}>Ksh {totalRewards.toFixed(2)}</Text>
          <Text style={styles.rewardNote}>
            {totalRewards > 0
              ? 'Money sent to your account'
              : 'No rewards yet. Start referring!'}
          </Text>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  hamburger: {
    padding: 8,
  },
  themeToggle: {
    padding: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
  },
  card: {
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rewardsCardContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  rewardsCard: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  rewardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  rewardAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginVertical: 8,
  },
  rewardNote: {
    fontSize: 14,
    textAlign: 'center',
    color: '#FFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
});

import React ,{useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Linking, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useCreateTradingAccount } from '@/context/CreateTradingAccountContext';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import 'expo-dev-client';


import { BannerAd, BannerAdSize, TestIds, useForeground } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-3868898371251417/3578299301';



const { width } = Dimensions.get('window');

const CreateTradingAccountScreen = () => {
  const router = useRouter();
  const { setHasSkipped ,hasSkipped} = useCreateTradingAccount();
  useEffect(() => {
    if (hasSkipped) {
      router.push('/(tabs)');
    }
  }, [hasSkipped, router]);
  const handleSkip = async () => {
    await setHasSkipped(true);
    router.push('/(tabs)');
  };

  const handleBrokerLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View entering={FadeInDown.delay(300).duration(1000)} style={styles.card}>
            {/* Banner Ad */}    
            <BannerAd unitId={adUnitId} size={BannerAdSize.BANNER} />  
          <Ionicons name="wallet-outline" size={80} color="#4158D0" style={styles.icon} />
          <Animated.Text entering={FadeInUp.delay(600).duration(1000)} style={styles.title}>Create Trading Account</Animated.Text>
          <Animated.Text entering={FadeInUp.delay(900).duration(1000)} style={styles.subtitle}>
            Start trading by creating a new account tailored for your needs.
          </Animated.Text>

          <Animated.View entering={FadeInUp.delay(1200).duration(1000)} style={styles.brokerSection}>
            <Text style={styles.brokerTitle}>Choose Your Broker</Text>
            <TouchableOpacity
              style={styles.brokerButton}
              onPress={async () => {handleBrokerLink('https://portal.fxpesa.com/live-account/?accountType=Premier&clickid=817641&affid=C00946066');await setHasSkipped(true);}}
            >
              <Ionicons name="globe-outline" size={24} color="#fff" style={styles.brokerIcon} />
              <Text style={styles.brokerButtonText}>FX Pesa</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.brokerButton}
              onPress={async () => {handleBrokerLink('https://fbs.partners?ibl=61828&ibp=21507600');await setHasSkipped(true);}}
            >
              <Ionicons name="bar-chart-outline" size={24} color="#fff" style={styles.brokerIcon} />
              <Text style={styles.brokerButtonText}>FBS Traders</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(1500).duration(1000)} style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipButtonText}>Skip for now</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: width * 0.9,
    maxWidth: 400,
    padding: 30,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 24,
  },
  brokerSection: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  brokerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  brokerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4158D0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginBottom: 15,
    width: '60%',
  },
  brokerIcon: {
    marginRight: 10,
  },
  brokerButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  skipButton: {
    marginTop: 10,
  },
  skipButtonText: {
    color: '#4158D0',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default CreateTradingAccountScreen;


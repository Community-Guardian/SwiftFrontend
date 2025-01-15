// screens/OfflineScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useConnectivity } from '@/context/ConnectivityContext';

const OfflineScreen = () => {
  const { retryConnection } = useConnectivity();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>You are offline</Text>
      <Text style={styles.subtitle}>Check your connection and try again.</Text>
      <Button title="Retry Connection" onPress={retryConnection} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default OfflineScreen;

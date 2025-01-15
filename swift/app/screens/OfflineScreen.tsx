import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { useConnectivity } from '@/context/ConnectivityContext';

const OfflineScreen = () => {
  const { retryConnection } = useConnectivity();
  const [isLoading, setIsLoading] = useState(false); // Added loading state

  const handleRetry = async () => {
    setIsLoading(true); // Start loading when retry is pressed
    await retryConnection(); // Retry connection
    setIsLoading(false); // Stop loading after retry
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>You are offline</Text>
      <Text style={styles.subtitle}>Check your connection and try again.</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#2196F3" style={styles.loadingIndicator} />
      ) : (
        <Button title="Retry Connection" onPress={handleRetry} />
      )}
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
  loadingIndicator: {
    marginBottom: 20,
  },
});

export default OfflineScreen;

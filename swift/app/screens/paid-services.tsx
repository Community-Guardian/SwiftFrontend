import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { lightTheme, darkTheme } from '@/styles/theme';
import { usePayments } from '@/context/PaymentsContext';

const DEFAULT_IMAGE =
  'https://media.istockphoto.com/id/1130260211/photo/us-dollar-bills-on-a-background-with-dynamics-of-exchange-rates-trading-and-financial-risk.jpg?s=2048x2048&w=is&k=20&c=HkjyZluWVg7XxhQblMaD6xjwzXxBHgidl0fcdWGg5X4=';
  interface ServiceType {
    id: number;
    name: string;
    icon: string;
    created_at: string;
    updated_at: string;
  }
  
  interface Service {
    id: number;
    name: string;
    service_type: ServiceType; // Nested service type object
    service_type_id: string; 
    price: number;
    description: string;
    link: string;
    duration: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    image: string;
  }
export default function PaidServicesScreen() {
  const { theme } = useTheme();
  const themeColors = theme === 'light' ? lightTheme : darkTheme;
  const { payments, getPayments, loading } = usePayments();
  const [paidServices, setPaidServices] = useState<Service[]>([]);

  useEffect(() => {
    // Trigger the loading state and fetch data
    getPayments();
  }, []);

  useEffect(() => {
    // Map payments data to services after fetching
    const services = payments.map((payment) => payment.service);
    setPaidServices(services);
  }, [payments]);

  const handleView = (link: string) => {
    Linking.openURL(link);
  };

  // Show loading indicator while the data is being fetched
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color={themeColors.primary} />
        <Text style={[styles.loadingText, { color: themeColors.text }]}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.title, { color: themeColors.text }]}>Paid Services</Text>
      {paidServices.length > 0 ? (
        <FlatList
          data={paidServices}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.serviceCard, { backgroundColor: themeColors.card }]}>
              <Image
                source={{ uri: item.image || DEFAULT_IMAGE }}
                style={styles.serviceImage}
                resizeMode="cover"
              />
              <View style={styles.serviceInfo}>
                <Text style={[styles.serviceTitle, { color: themeColors.text }]}>{item.name}</Text>
                <Text
                  style={[styles.serviceDescription, { color: themeColors.text }]}
                  numberOfLines={2}
                >
                  {item.description}
                </Text>
                <TouchableOpacity
                  onPress={() => handleView(item.link)}
                  style={[styles.viewButton, { backgroundColor: themeColors.primary }]}
                >
                  <Text style={styles.viewButtonText}>View</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <View style={styles.noServicesContainer}>
          <Text style={[styles.noServicesText, { color: themeColors.text }]}>
            You have no paid services.
          </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  serviceCard: {
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  serviceImage: {
    width: '100%',
    height: 150,
  },
  serviceInfo: {
    padding: 16,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    marginBottom: 8,
    color: '#757575',
  },
  viewButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noServicesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noServicesText: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
});

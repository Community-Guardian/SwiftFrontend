import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { useServices } from '../../context/ServicesContext';
import PayNowModal from '../../components/PayNowModal';

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
  
export default function InvestScreen() {
  const { theme } = useTheme();
  const themeColors = theme === 'light' ? lightTheme : darkTheme;
  const { services, getServices } = useServices();
  const [filteredServices, setFilteredServices] = useState<Service | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    getServices();
  }, []);

  useEffect(() => {
    if (services.length > 0) {
      const filtered = services.filter(service => service.service_type.name === 'Investment Plans');
      setFilteredServices(filtered);
      setIsLoading(false); // Stop loading once services are fetched
    }
  }, [services]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = services.filter(service =>
      service.name.toLowerCase().includes(text.toLowerCase()) &&
      service.service_type.name === 'Investment Plans'
    );
    setFilteredServices(filtered);
  };

  const handlePayNow = (service) => {
    setSelectedService(service);
    setModalVisible(true);
  };

  const handleView = (link: string) => {
    Linking.openURL(link);
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: themeColors.card }]}>
        <Ionicons name="search" size={20} color={themeColors.text} />
        <TextInput
          placeholder="Search..."
          placeholderTextColor={themeColors.text}
          style={[styles.searchInput, { color: themeColors.text }]}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <Text style={[styles.interestText, { color: themeColors.text }]}>
        With Interest of 5% Per Week
      </Text>

      {/* Loading Indicator */}
      {isLoading ? (
        <ActivityIndicator size="large" color={themeColors.primary} style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={filteredServices}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.investmentCard, { backgroundColor: themeColors.card }]}>
              <Text style={[styles.serviceName, { color: themeColors.text }]}>
                {item.name}
              </Text>
              <Text style={[styles.description, { color: themeColors.text }]}>
                {item.description || "No description available for this plan."}
              </Text>
              <View style={styles.investmentInfo}>
                <View style={[styles.amountContainer, { backgroundColor: themeColors.primary }]}>
                  <Text style={styles.amount}>KSH {item.price}</Text>
                </View>
                <View style={[styles.durationContainer, { backgroundColor: themeColors.secondary }]}>
                  <Text style={styles.duration}>{item.duration} Days</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => handlePayNow(item)}
                style={[styles.investButton, { backgroundColor: themeColors.primary }]}
              >
                <Text style={styles.investButtonText}>Invest With Us</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {selectedService && (
        <PayNowModal
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
          service={selectedService}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 8,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  interestText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 16,
  },
  investmentCard: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  investmentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  amountContainer: {
    padding: 8,
    borderRadius: 4,
    flex: 1,
    marginRight: 8,
  },
  durationContainer: {
    padding: 8,
    borderRadius: 4,
    flex: 1,
    marginLeft: 8,
  },
  amount: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  duration: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  investButton: {
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  investButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingIndicator: {
    marginTop: 30,
    alignSelf: 'center',
  },
});

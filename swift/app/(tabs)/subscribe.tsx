import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { useServices } from '../../context/ServicesContext';
import PayNowModal from '../../components/PayNowModal';
import ServiceDetailsModal from '../../components/ServiceDetailsModal';

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
  
export default function SubscribeScreen() {
  const { theme } = useTheme();
  const themeColors = theme === 'light' ? lightTheme : darkTheme;
  const { services, getServices } = useServices();
  const [filteredServices, setFilteredServices] = useState<Service[] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const [isServiceDetailsModalVisible, setServiceDetailsModalVisible] = useState(false);

  useEffect(() => {
    getServices();
  }, []);

  useEffect(() => {
    if (services.length > 0) {
      const filtered = services.filter((service) => service.service_type.name === 'Forex Signals');
      setFilteredServices(filtered);
      setIsLoading(false); // Set loading to false after data is loaded
    }
  }, [services]);

  const handleSearch = (text: any) => {
    setSearchQuery(text);
    const filtered = services.filter(
      (service) =>
        service.name.toLowerCase().includes(text.toLowerCase()) &&
        service.service_type.name === 'Forex Signals'
    );
    setFilteredServices(filtered);
  };
  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    setServiceDetailsModalVisible(true);
  };
  const handlePayNow = (service:Service) => {
    setSelectedService(service);
    setModalVisible(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: themeColors.card }]}>
        <Ionicons name="search" size={20} color={themeColors.text} />
        <TextInput
          placeholder="Search signals..."
          placeholderTextColor={themeColors.text}
          style={[styles.searchInput, { color: themeColors.text }]}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Loading Indicator */}
      {isLoading ? (
        <ActivityIndicator size="large" color={themeColors.primary} style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={filteredServices}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleServiceClick(item)}>
              <View style={[styles.signalCard, { backgroundColor: themeColors.card }]}>
                <Image
                  source={{ uri: item.image || DEFAULT_IMAGE }}
                  style={styles.signalImage}
                  resizeMode="cover"
                />
                <View style={styles.signalInfo}>
                  <View>
                    <Text style={[styles.signalName, { color: themeColors.text }]}>{item.name}</Text>
                    <Text style={[styles.price, { color: themeColors.primary }]}>
                      Price: Ksh {item.price}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => handlePayNow(item)} style={styles.subscribeButton}>
                    <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
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

      {selectedService && (
        <ServiceDetailsModal
          isVisible={isServiceDetailsModalVisible}
          onClose={() => setServiceDetailsModalVisible(false)}
          service={selectedService}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  signalCard: {
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  signalImage: {
    width: '100%',
    height: 150,
  },
  signalInfo: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  signalName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subscribeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#2196F3',
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loadingIndicator: {
    marginTop: 30,
    alignSelf: 'center',
  },
});

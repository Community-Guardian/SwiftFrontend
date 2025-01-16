import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { useServices } from '../../context/ServicesContext';
import PayNowModal from '../../components/PayNowModal';

const DEFAULT_IMAGE =
  'https://media.istockphoto.com/id/1130260211/photo/us-dollar-bills-on-a-background-with-dynamics-of-exchange-rates-trading-and-financial-risk.jpg?s=2048x2048&w=is&k=20&c=HkjyZluWVg7XxhQblMaD6xjwzXxBHgidl0fcdWGg5X4=';

export default function EnrollScreen() {
  const { theme } = useTheme();
  const themeColors = theme === 'light' ? lightTheme : darkTheme;
  const { services, getServices } = useServices();
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    getServices();
  }, []);

  useEffect(() => {
    if (services.length > 0) {
      const filtered = services.filter(service => service.service_type.name === 'Trading Classes');
      setFilteredServices(filtered);
      setIsLoading(false); // Stop loading when data is available
    }
  }, [services]);

  const renderStars = (rating: number) => {
    return [...Array(rating)].map((_, i) => (
      <Ionicons key={i} name="star" size={16} color="#FFD700" />
    ));
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = services.filter(service =>
      service.name.toLowerCase().includes(text.toLowerCase()) &&
      service.service_type.name === 'Trading Classes'
    );
    setFilteredServices(filtered);
  };

  const handlePayNow = (service) => {
    setSelectedService(service);
    setModalVisible(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Search Bar */}
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

      {/* Loading Spinner */}
      {isLoading ? (
        <ActivityIndicator size="large" color={themeColors.primary} style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={filteredServices}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.courseCard, { backgroundColor: themeColors.card }]}>
              <Image source={{ uri: item.image || DEFAULT_IMAGE }} style={styles.courseImage} />
              <View style={styles.courseInfo}>
                <Text style={[styles.courseTitle, { color: themeColors.text }]}>
                  {item.name}
                </Text>
                <View style={styles.ratingContainer}>
                  {renderStars(item.rating || 5)}
                </View>
                <View style={styles.courseDetails}>
                  <Text style={[styles.duration, { backgroundColor: '#4CAF50' }]}>
                    {item.duration} days
                  </Text>
                  <Text style={[styles.price, { color: themeColors.text }]}>
                    {item.price}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handlePayNow(item)} style={styles.payNowButton}>
                  <Text style={styles.payNowButtonText}>Pay Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Pay Now Modal */}
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
  courseCard: {
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  courseImage: {
    width: '100%',
    height: 150,
  },
  courseInfo: {
    padding: 16,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  courseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  duration: {
    color: 'white',
    padding: 4,
    borderRadius: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  payNowButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
    alignItems: 'center',
  },
  payNowButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingIndicator: {
    marginTop: 30,
    alignSelf: 'center',
  },
});

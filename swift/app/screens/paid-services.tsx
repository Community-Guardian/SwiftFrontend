import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { lightTheme, darkTheme } from '@/styles/theme';
import { usePayments } from '@/context/PaymentsContext';
import { Linking } from 'react-native';

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
  service_type: ServiceType;
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

interface Payment {
  id: string;
  service_id: number;
  service: Service;
  payment_method: string;
  result_code: string;
  result_desc: string;
  payment_status: string;
  amount: string;
  transaction_id: string;
  created_at: string;
  updated_at: string;
  user: string;
  service_type: ServiceType | null;
  expiration_date: string;
  is_expired: boolean;
  total_amount_paid: number;
}

export default function PaidServicesScreen() {
  const { theme } = useTheme();
  const themeColors = theme === 'light' ? lightTheme : darkTheme;
  const { payments, getPayments, loading } = usePayments();
  const [paidServices, setPaidServices] = useState<Payment[]>([]);
  const [selectedService, setSelectedService] = useState<Payment | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    getPayments();
  }, []);

  useEffect(() => {
    const services = payments.filter((payment) => payment.payment_status === 'paid');
    setPaidServices(services);
  }, [payments]);

  const handleView = (service: Payment) => {
    if (service.service.service_type.name === 'Activate your account') {
      Alert.alert('Account Activated', 'Thank you for activating your account! It is now unlocked forever.');
    } else {
      setSelectedService(service);
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedService(null);
  };

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
                source={{ uri: item.service.image || DEFAULT_IMAGE }}
                style={styles.serviceImage}
                resizeMode="cover"
              />
              <View style={styles.serviceInfo}>
                <Text style={[styles.serviceTitle, { color: themeColors.text }]}>{item.service.name}</Text>
                <Text style={[styles.serviceDescription, { color: themeColors.text }]} numberOfLines={2}>
                  {item.service.description}
                </Text>
                <TouchableOpacity
                  onPress={() => handleView(item)}
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
          <Text style={[styles.noServicesText, { color: themeColors.text }]}>You have no paid services.</Text>
        </View>
      )}

      {/* Modal for viewing payment details */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: themeColors.card }]}>
            {selectedService && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: themeColors.text }]}>
                    {selectedService.service.name}
                  </Text>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: selectedService.is_expired ? 'red' : 'green' },
                    ]}
                  />
                </View>
                <Text style={[styles.modalDescription, { color: themeColors.text }]}>
                  {selectedService.service.description}
                </Text>
                <View style={styles.modalDetailRow}>
                  <Text style={[styles.modalLabel, { color: themeColors.text }]}>Price:</Text>
                  <Text style={[styles.modalValue, { color: themeColors.text }]}>
                    Ksh {selectedService.service.price}
                  </Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={[styles.modalLabel, { color: themeColors.text }]}>Duration:</Text>
                  <Text style={[styles.modalValue, { color: themeColors.text }]}>
                    {selectedService.service.duration} days
                  </Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={[styles.modalLabel, { color: themeColors.text }]}>Purchased on:</Text>
                  <Text style={[styles.modalValue, { color: themeColors.text }]}>
                    {new Date(selectedService.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={[styles.modalLabel, { color: themeColors.text }]}>Expires on:</Text>
                  <Text style={[styles.modalValue, { color: themeColors.text }]}>
                    {selectedService.expiration_date
                      ? new Date(selectedService.expiration_date).toLocaleDateString()
                      : 'N/A'}
                  </Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={[styles.modalLabel, { color: themeColors.text }]}>Status:</Text>
                  <Text
                    style={[
                      styles.modalValue,
                      {
                        color: selectedService.service.is_active ? 'blue' : 'red',
                        fontWeight: 'bold',
                      },
                    ]}
                  >
                    {selectedService.service.is_active ? 'Active' : 'Expired'}
                  </Text>
                </View>
                {/* WhatsApp Group Link */}
                {/* WhatsApp Group Link */}
                {selectedService.service.link && (
                  <View style={[styles.modalDetailRow, { marginTop: 16 }]}>
                    <Text style={[styles.modalLabel, { color: themeColors.text }]}>WhatsApp Group:</Text>
                    <TouchableOpacity
                      onPress={() => Linking.openURL(selectedService.service.link)}
                      style={styles.whatsappLinkButton}
                    >
                      <Text style={[styles.whatsappLinkText, { color: themeColors.primary }]}>Join Group</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 16,
  },
  modalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalValue: {
    fontSize: 16,
  },
  closeButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#2196F3',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  whatsappLinkButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  whatsappLinkText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  
});

import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { usePayments } from '../context/PaymentsContext';
import SuccessModal from './SuccessModal2';
import { useRouter } from 'expo-router';

interface ServiceType {
  id: number;
  name: string;
  icon: string;
  created_at: string;
  updated_at: string;
}
interface PayModalProps {
  isVisible: boolean;
  onClose: () => void;
  service: {
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
  };
}
const PayModal: React.FC<PayModalProps> = ({ isVisible, onClose, service }) => {
  const router = useRouter();
  const { createMpesaPaymentIntent } = usePayments();
  const [phone_number, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleNext = () => {
    router.push('/create-trading-account');
    onClose();
  };
  const handlePayment = async () => {
    if (!phone_number) {
      setError('Please enter your phone number.');
      return;
    }
    if (phone_number.length < 10) {
      setError('Please enter a valid phone number.');
      return;
    }
  
    setLoading(true);
    setError(''); // Clear previous errors
    setSuccess(false);
  
    try {
      await createMpesaPaymentIntent(service.id, phone_number);
      setSuccess(true);
    } catch (error: any) {
      console.error('Payment error:', error);
      setError(error.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log('Current error state:', error);
  }, [error]);
  useEffect(() => {
    setLoading(false);
    setError(''); // Clear previous errors
    setSuccess(false);
    }, [onClose]);
  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.container}>
        <View style={styles.modalContent}>
          {loading ? (
            <ActivityIndicator size="large" color="#2196F3" />
          ) : success ? (
            <SuccessModal
              isVisible={success}
              service={service}
              onClose={ () => {
                setSuccess(false);
                onClose();
              } }
            />
          ) : (
            <>
              <Text style={styles.title}>Pay Now</Text>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.price}>Price: Ksh {service.price}</Text>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                placeholderTextColor="#aaa"
                keyboardType="phone-pad"
                value={phone_number}
                onChangeText={setPhoneNumber}
              />
              <TouchableOpacity onPress={handlePayment} style={styles.payButton}>
                <Text style={styles.payButtonText}>Confirm Payment</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 18,
    color: '#555',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  },
  successText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'green',
    marginBottom: 20,
  },
  payButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#2196F3',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#ddd',
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#555',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PayModal;
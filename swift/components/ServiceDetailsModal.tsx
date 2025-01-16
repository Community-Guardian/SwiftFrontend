import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../styles/theme';
import { LinearGradient } from 'expo-linear-gradient';

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

interface ServiceDetailsModalProps {
  isVisible: boolean;
  onClose: () => void;
  service: Service;
}

const ServiceDetailsModal: React.FC<ServiceDetailsModalProps> = ({ isVisible, onClose, service }) => {
  const { theme } = useTheme();
  const themeColors = theme === 'light' ? lightTheme : darkTheme;

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.container}>
        <LinearGradient
          colors={['#ffffff', themeColors.card]}
          style={styles.modalContent}
        >
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={themeColors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: themeColors.text }]}>{service.name}</Text>
          <View style={styles.detailRow}>
            <Ionicons name="pricetag-outline" size={20} color={themeColors.text} />
            <Text style={[styles.detailText, { color: themeColors.text }]}>
              Price: Ksh {service.price}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={20} color={themeColors.text} />
            <Text style={[styles.detailText, { color: themeColors.text }]}>
              Duration: {service.duration} days
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="list-outline" size={20} color={themeColors.text} />
            <Text style={[styles.detailText, { color: themeColors.text }]}>
              Type: {service.service_type.name}
            </Text>
          </View>
          <Text style={[styles.descriptionText, { color: themeColors.text }]}>
            {service.description}
          </Text>
        </LinearGradient>
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
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    padding: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  detailText: {
    fontSize: 16,
    marginLeft: 8,
    lineHeight: 24,
  },
  descriptionText: {
    fontSize: 16,
    marginTop: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default ServiceDetailsModal;

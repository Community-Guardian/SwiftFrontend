import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SuccessModalProps {
  isVisible: boolean;
  onClose: () => void;
  service: {
    name: string;
    link: string;
  };
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isVisible, onClose, service }) => {
  const handleJoinGroup = () => {
    Linking.openURL(service.link);
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <Ionicons name="checkmark-circle" size={80} color="#4CAF50" style={styles.icon} />
          <Text style={styles.title}>Payment Successful!</Text>
          <Text style={styles.message}>
            You have successfully applied to the {service.name} group.
          </Text>
          <TouchableOpacity onPress={handleJoinGroup} style={styles.joinButton}>
            <Text style={styles.joinButtonText}>Join {service.name} Group</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
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
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  joinButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  joinButtonText: {
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

export default SuccessModal;
"use client";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { lightTheme, darkTheme } from "../../styles/theme";
import PayModal from "../../components/PayModal";
import { useServices } from "@/context/ServicesContext";
import { Ionicons } from "@expo/vector-icons";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { router } from "expo-router";
import { CustomButton } from "@/components/CustomButton";


import 'expo-dev-client';


import { BannerAd, BannerAdSize, TestIds, useForeground } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';


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

export default function VerifyAccountScreen() {
  const { theme } = useTheme();
  const themeColors = theme === "light" ? lightTheme : darkTheme;
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const { services, getServices, loading } = useServices();
  const [service, setService] = useState<Service | null>(null);
  const [serverDown, setServerDown] = useState(false);

  useEffect(() => {
    getServices();
  }, []);

  useEffect(() => {
    if (services.length > 0) {      
      const match = services.find(
        (s) => s.service_type.name === "Activate your account"
      );
      setService(match || null);
    }
  }, [services]);

  const handleServerDown = () => {
    setServerDown(true);
  };

  const handleLoginRedirect = () => {
    setServerDown(false);
    router.replace('/(auth)');
  };
  const handleVerification = () => {
    if (service) {
      setIsPaymentModalVisible(true);
    }
  };

  if (loading || !service) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color={themeColors.primary} />
      </View>
    );
  }



  return (
    <ScrollView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Card style={[styles.card, { backgroundColor: themeColors.card }]}>
        <CardContent>
          <Text style={[styles.description, { color: themeColors.text }]}>
            Verifying your account unlocks premium features and increases your
            trading limits.
          </Text>

          <View style={styles.infoContainer}>
            {[
              "Unlock advanced trading tools",
              "Increase your daily trading limits",
              "Get priority customer support",
              "Access exclusive market insights",
            ].map((info, index) => (
              <View key={index} style={styles.infoItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={themeColors.primary}
                />
                <Text style={[styles.infoText, { color: themeColors.text }]}>
                  {info}
                </Text>
              </View>
            ))}
          </View>

          <Text style={[styles.feeText, { color: themeColors.text }]}>
            Verification fee:{" "}
            <Text style={[styles.feeAmount, { color: themeColors.primary }]}>
              {service?.price} KSh
            </Text>
          </Text>
        </CardContent>
        <CardFooter>
          <CustomButton
            title="Verify Now"
            onPress={handleVerification}
            variant="primary"
            loading={loading}
            disabled={!service}
          />
      </CardFooter>
      </Card>

      {/* Banner Ad */}
      <BannerAd unitId={adUnitId} size={BannerAdSize.BANNER} />  
      {service && (
        <PayModal
          isVisible={isPaymentModalVisible}
          onClose={() => setIsPaymentModalVisible(false)}
          service={service}
        />
      )}
        {/* Modal for server down message */}
        <Modal
          visible={serverDown}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setServerDown(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: themeColors.card }]}>
              <Text style={[styles.modalTitle, { color: themeColors.text }]}>
                Server is Temporarily Down
              </Text>
              <Text style={[styles.modalMessage, { color: themeColors.text }]}>
                We’re experiencing some technical difficulties. Please try again later.
              </Text>
              <CustomButton
                title="Go to Login"
                onPress={handleLoginRedirect}
                variant="primary"
                style={styles.loginButton}
              />
            </View>
          </View>
        </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    margin: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  infoContainer: {
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 12,
  },
  feeText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 24,
  },
  feeAmount: {
    fontSize: 20,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    width: "85%",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Elevation for Android shadow
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 24,
    textAlign: "center",
  },
  loginButton: {
    alignSelf: "center",
    width: "80%",
    borderRadius: 8,
  },
});

"use client";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
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

  const handleVerification = () => {
    if (service) {
      setIsPaymentModalVisible(true);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color={themeColors.primary} />
      </View>
    );
  }

  if (!service) {
    router.push("/create-trading-account");
    return null; // Prevent further rendering after navigation
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

      {service && (
        <PayModal
          isVisible={isPaymentModalVisible}
          onClose={() => setIsPaymentModalVisible(false)}
          service={service}
        />
      )}
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
});

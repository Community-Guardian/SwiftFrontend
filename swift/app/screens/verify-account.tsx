"use client";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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

export default function VerifyAccountScreen() {
  const { theme } = useTheme();
  const themeColors = theme === "light" ? lightTheme : darkTheme;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { services, getServices, loading } = useServices();
  const [service, setService] = useState(null); // Holds the first matching service

  useEffect(() => {
    getServices();
  }, []);

  useEffect(() => {
    if (services.length > 0) {
      // Find the first matching service
      const match = services.find(
        (s) => s.service_type.name === "Activate your account"
      );
      setService(match || null);
    }
  }, [services]);

  const handleVerification = () => {
    if (service) {
      setIsModalVisible(true);
    }
  };

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
              50 KSh
            </Text>
          </Text>
        </CardContent>
        <CardFooter>
          {loading ? (
            <ActivityIndicator size="large" color={themeColors.primary} />
          ) : (
            <TouchableOpacity
              style={[
                styles.verifyButton,
                { backgroundColor: themeColors.primary },
              ]}
              onPress={handleVerification}
              disabled={!service} // Disable button if no service is available
            >
              <Text style={styles.verifyButtonText}>Verify Now</Text>
            </TouchableOpacity>
          )}
        </CardFooter>
      </Card>

      {service && (
        <PayModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
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
  verifyButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

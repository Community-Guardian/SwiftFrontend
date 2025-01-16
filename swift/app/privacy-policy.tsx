import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../styles/theme';

export default function PrivacyPolicyScreen() {
  const { theme } = useTheme();
  const themeColors = theme === 'light' ? lightTheme : darkTheme;
  const [loading, setLoading] = useState(true);

  const sections = [
    {
      title: 'Information We Collect',
      content: 'We collect information that you provide directly to us, including name, email address, and location. We also collect information about your usage of our services and trading patterns.',
    },
    {
      title: 'How We Use Your Information',
      content: 'We use the information we collect to provide and improve our services, send you trading signals, and communicate with you about our products and updates.',
    },
    {
      title: 'Information Sharing',
      content: 'We do not sell or share your personal information with third parties except as described in this policy or with your consent.',
    },
    {
      title: 'Data Security',
      content: 'We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or destruction.',
    },
    {
      title: 'Your Rights',
      content: 'You have the right to access, correct, or delete your personal information. You can also opt out of receiving marketing communications from us.',
    },
  ];

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color={themeColors.text} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: themeColors.background }]}
      contentContainerStyle={styles.contentContainer} // Fixed contentContainerStyle
    >
      <Text style={[styles.title, { color: themeColors.text }]}>Privacy Policy</Text>

      <Text style={[styles.lastUpdated, { color: themeColors.text }]}>
        Last Updated: January 2024
      </Text>

      {sections.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            {section.title}
          </Text>
          <Text style={[styles.text, { color: themeColors.text }]}>
            {section.content}
          </Text>
        </View>
      ))}

      <View style={styles.contact}>
        <Text style={[styles.contactTitle, { color: themeColors.text }]}>
          Contact Us
        </Text>
        <Text style={[styles.text, { color: themeColors.text }]}>
          If you have any questions about this Privacy Policy, please contact us at:
          {'\n'}Email: Swift@tradingapp.com
          {'\n'}Phone: +254 716549814
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center', // Moved alignItems to contentContainerStyle
    justifyContent: 'flex-start', // Adjust as needed
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  lastUpdated: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 24,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'left',
  },
  contact: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    width: '100%',
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});

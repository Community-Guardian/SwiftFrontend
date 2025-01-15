import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../styles/theme';

export default function AboutScreen() {
  const { theme } = useTheme();
  const themeColors = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: themeColors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: themeColors.text }]}>About Us</Text>
      
      <Image
        source={{ uri: '/placeholder.svg?height=200&width=200' }}
        style={styles.logo}
      />
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          Our Mission
        </Text>
        <Text style={[styles.text, { color: themeColors.text }]}>
          We are dedicated to providing the best trading education and signals to help our users achieve their financial goals. Our platform combines expert knowledge with cutting-edge technology to deliver reliable trading insights.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          Our Vision
        </Text>
        <Text style={[styles.text, { color: themeColors.text }]}>
          To become the world's leading platform for trading education and signal provision, empowering traders of all levels to make informed decisions and achieve consistent success in the markets.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          Why Choose Us
        </Text>
        <View style={styles.features}>
          {[
            'Expert Trading Signals',
            'Comprehensive Education',
            'Professional Support',
            'Advanced Analytics',
            'Real-time Updates',
            'Community Support'
          ].map((feature, index) => (
            <View 
              key={index} 
              style={[styles.featureItem, { backgroundColor: themeColors.card }]}
            >
              <Text style={[styles.featureText, { color: themeColors.text }]}>
                {feature}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '48%',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});


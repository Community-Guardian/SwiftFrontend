import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../styles/theme';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
}

interface CardHeaderProps {
  children: ReactNode;
  style?: ViewStyle;
}

interface CardFooterProps {
  children: ReactNode;
  style?: ViewStyle;
}

interface CardTitleProps {
  children: ReactNode;
  style?: TextStyle;
}

interface CardContentProps {
  children: ReactNode;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, style }) => {
  const { theme } = useTheme();
  const themeColors = theme === 'light' ? lightTheme : darkTheme;

  return (
    <View style={[styles.card, { backgroundColor: themeColors.card }, style]}>
      {children}
    </View>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({ children, style }) => (
  <View style={[styles.cardHeader, style]}>{children}</View>
);

export const CardFooter: React.FC<CardFooterProps> = ({ children, style }) => (
  <View style={[styles.cardFooter, style]}>{children}</View>
);

export const CardTitle: React.FC<CardTitleProps> = ({ children, style }) => {
  const { theme } = useTheme();
  const themeColors = theme === 'light' ? lightTheme : darkTheme;

  return (
    <Text style={[styles.cardTitle, { color: themeColors.text }, style]}>
      {children}
    </Text>
  );
};

export const CardContent: React.FC<CardContentProps> = ({ children, style }) => (
  <View style={[styles.cardContent, style]}>{children}</View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  cardFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: 16,
  },
});


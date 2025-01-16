import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger'; // Add new variants
  loading?: boolean; // Optional loading prop
  disabled?: boolean; // Optional disabled prop
}

export function CustomButton({ 
  title, 
  onPress, 
  variant = 'primary', 
  loading = false, 
  disabled = false, 
}: CustomButtonProps) {
  const { theme } = useTheme();

  const isDisabled = disabled || loading;

  // Define styles for each variant
  const variantStyles = {
    primary: {
      backgroundColor: '#2196F3',
      textColor: '#FFFFFF',
    },
    secondary: {
      backgroundColor: 'transparent',
      borderColor: theme === 'light' ? '#E0E0E0' : '#404040',
      textColor: theme === 'light' ? '#000000' : '#FFFFFF',
    },
    success: {
      backgroundColor: '#4CAF50',
      textColor: '#FFFFFF',
    },
    danger: {
      backgroundColor: '#F44336',
      textColor: '#FFFFFF',
    },
  };

  const { backgroundColor, textColor } = variantStyles[variant];
  const borderColor: string = 'borderColor' in variantStyles[variant] ? variantStyles[variant].borderColor as string : backgroundColor;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor,
          borderColor,
          borderWidth: variant === 'secondary' ? 1 : 0,
          opacity: isDisabled ? 0.6 : 1, // Reduce opacity when disabled
        },
      ]}
      onPress={onPress}
      disabled={isDisabled} // Disable button when loading or explicitly disabled
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={textColor} 
        />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: textColor,
            },
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});

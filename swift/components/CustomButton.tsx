import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  loading?: boolean; // Add loading prop
  disabled?: boolean; // Add disabled prop
}

export function CustomButton({ 
  title, 
  onPress, 
  variant = 'primary', 
  loading = false, // Default loading to false
  disabled = false, // Default disabled to false
}: CustomButtonProps) {
  const { theme } = useTheme();

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: variant === 'primary' ? '#2196F3' : 'transparent',
          borderWidth: variant === 'secondary' ? 1 : 0,
          borderColor: theme === 'light' ? '#E0E0E0' : '#404040',
          opacity: isDisabled ? 0.6 : 1, // Reduce opacity when disabled
        },
      ]}
      onPress={onPress}
      disabled={isDisabled} // Disable button when loading or explicitly disabled
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? '#FFFFFF' : theme === 'light' ? '#000000' : '#FFFFFF'} 
        />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: variant === 'primary' ? '#FFFFFF' : theme === 'light' ? '#000000' : '#FFFFFF',
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

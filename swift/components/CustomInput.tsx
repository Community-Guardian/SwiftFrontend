import React from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../styles/theme';

interface CustomInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: string;
}

export function CustomInput({ placeholder, value, onChangeText, secureTextEntry,keyboardType }: CustomInputProps) {
  const { theme } = useTheme();
  const themeColors = theme === 'light' ? lightTheme : darkTheme;

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        style={[
          styles.input,
          {
            backgroundColor: theme === 'light' ? '#F5F5F5' : '#2A2A2A',
            color: themeColors.text,
            borderColor: theme === 'light' ? '#CCCCCC' : '#555555',
            shadowColor: theme === 'light' ? '#000' : '#FFFFFF',
          },
        ]}
        placeholderTextColor={theme === 'light' ? '#666666' : '#999999'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  input: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1, // Add border width for outline
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.1, // Shadow opacity
    shadowRadius: 4, // Shadow blur radius
    elevation: 2, // Elevation for Android shadow
  },
});

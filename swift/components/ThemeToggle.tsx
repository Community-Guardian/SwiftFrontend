import React from 'react';
import { Switch, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <View style={{ marginRight: 15 }}>
      <Switch
        value={theme === 'dark'}
        onValueChange={toggleTheme}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={theme === 'dark' ? '#f5dd4b' : '#f4f3f4'}
      />
    </View>
  );
}


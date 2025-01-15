import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const themeColors = theme === 'light' ? lightTheme : darkTheme;

  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [tradingAlerts, setTradingAlerts] = useState(true);

  const settingsSections = [
    {
      title: 'Appearance',
      settings: [
        {
          title: 'Dark Mode',
          icon: 'moon',
          value: theme === 'dark',
          onValueChange: toggleTheme,
        },
      ],
    },
    {
      title: 'Notifications',
      settings: [
        {
          title: 'Push Notifications',
          icon: 'notifications',
          value: notifications,
          onValueChange: setNotifications,
        },
        {
          title: 'Email Updates',
          icon: 'mail',
          value: emailUpdates,
          onValueChange: setEmailUpdates,
        },
        {
          title: 'Trading Alerts',
          icon: 'trending-up',
          value: tradingAlerts,
          onValueChange: setTradingAlerts,
        },
      ],
    },
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: themeColors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: themeColors.text }]}>Settings</Text>

      {settingsSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            {section.title}
          </Text>
          
          {section.settings.map((setting, settingIndex) => (
            <View 
              key={settingIndex}
              style={[styles.settingItem, { borderBottomColor: themeColors.border }]}
            >
              <View style={styles.settingInfo}>
                <Ionicons name={setting.icon as any} size={24} color={themeColors.text} />
                <Text style={[styles.settingText, { color: themeColors.text }]}>
                  {setting.title}
                </Text>
              </View>
              <Switch
                value={setting.value}
                onValueChange={setting.onValueChange}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={setting.value ? '#2196F3' : '#f4f3f4'}
              />
            </View>
          ))}
        </View>
      ))}

      <View style={styles.version}>
        <Text style={[styles.versionText, { color: themeColors.text }]}>
          Version 1.0.0
        </Text>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
  },
  version: {
    marginTop: 24,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
  },
});


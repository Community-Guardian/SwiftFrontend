import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide the header
      }}
    >
    <Stack.Screen
      name="index" // Matches with the login.tsx screen
      options={{ title: 'Login' }}
    />
    <Stack.Screen
      name="create-trading-account" // Matches with the login.tsx screen
      options={{ title: 'Create Trading Account' }}
    />     
    <Stack.Screen
      name="forgot-password" // Matches with the signup.tsx screen
      options={{ title: 'Forgot Password' }}
    />
      
    </Stack>
  );
}
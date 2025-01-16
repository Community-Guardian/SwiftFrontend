import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../styles/theme';
import { useAuth } from '../../context/AuthContext';

export default function UpdateUserProfileScreen() {
  const { theme } = useTheme();
  const themeColors = theme === 'light' ? lightTheme : darkTheme;
  const { user, updateUser } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [referralCode] = useState(user?.referral_code || '');
  const [image, setImage] = useState(user?.image || '');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleUpdate = async () => {
    try {
      if (user) {
        await updateUser(user.id, { username, email, first_name: firstName, last_name: lastName, referral_code: referralCode, image });
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
      }
    } catch (error) {
      setMessage({ text: 'Failed to update profile.', type: 'error' });
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.title, { color: themeColors.text }]}>Update Profile</Text>

      {message && (
        <Text
          style={[
            styles.message,
            {
              color: message.type === 'success' ? themeColors.success : themeColors.error,
            },
          ]}
        >
          {message.text}
        </Text>
      )}

      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {image ? (
          <Image source={{ uri: image }} style={styles.avatar} />
        ) : (
          <Text style={[styles.imagePickerText, { color: themeColors.text }]}>Pick an Image</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={[styles.input, { color: themeColors.text, borderColor: themeColors.border }]}
        placeholder="Username"
        placeholderTextColor={themeColors.text}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={[styles.input, { color: themeColors.text, borderColor: themeColors.border }]}
        placeholder="Email"
        placeholderTextColor={themeColors.text}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, { color: themeColors.text, borderColor: themeColors.border }]}
        placeholder="First Name"
        placeholderTextColor={themeColors.text}
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={[styles.input, { color: themeColors.text, borderColor: themeColors.border }]}
        placeholder="Last Name"
        placeholderTextColor={themeColors.text}
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={[styles.input, { color: themeColors.text, borderColor: themeColors.border }]}
        placeholder="Referral Code"
        placeholderTextColor={themeColors.text}
        value={referralCode}
        editable={false}
      />
      <TouchableOpacity onPress={handleUpdate} style={[styles.button, { backgroundColor: themeColors.primary }]}>
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imagePickerText: {
    fontSize: 16,
    color: '#888',
  },
});

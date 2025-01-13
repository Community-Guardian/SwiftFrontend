import React from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';

const courses = [
  {
    id: '1',
    title: "Beginer's Classes",
    duration: '3 Months',
    price: '250 USD',
    rating: 5,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Enroll%20Class-ib00OJFLtbxR4bmc2FKeDsVT1eQ3JQ.png',
  },
  {
    id: '2',
    title: 'Advanced Classes',
    duration: '3 Months',
    price: '300 USD',
    rating: 5,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Enroll%20Class-ib00OJFLtbxR4bmc2FKeDsVT1eQ3JQ.png',
  },
  {
    id: '3',
    title: 'Algorithm Trading Classes',
    duration: '3 Months',
    price: '500 USD',
    rating: 5,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Enroll%20Class-ib00OJFLtbxR4bmc2FKeDsVT1eQ3JQ.png',
  },
  {
    id: '4',
    title: 'Pro Trading Classes',
    duration: '3 Months',
    price: '500 USD',
    rating: 5,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Enroll%20Class-ib00OJFLtbxR4bmc2FKeDsVT1eQ3JQ.png',
  },
];

export default function EnrollScreen() {
  const { theme } = useTheme();
  const themeColors = theme === 'light' ? lightTheme : darkTheme;

  const renderStars = (rating: number) => {
    return [...Array(rating)].map((_, i) => (
      <Ionicons key={i} name="star" size={16} color="#FFD700" />
    ));
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColors.text }]}>
          ENROLL FOR CLASSES
        </Text>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: themeColors.card }]}>
        <Ionicons name="search" size={20} color={themeColors.text} />
        <TextInput
          placeholder="Search..."
          placeholderTextColor={themeColors.text}
          style={[styles.searchInput, { color: themeColors.text }]}
        />
      </View>

      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.courseCard, { backgroundColor: themeColors.card }]}>
            <Image source={{ uri: item.image }} style={styles.courseImage} />
            <View style={styles.courseInfo}>
              <Text style={[styles.courseTitle, { color: themeColors.text }]}>
                {item.title}
              </Text>
              <View style={styles.ratingContainer}>
                {renderStars(item.rating)}
              </View>
              <View style={styles.courseDetails}>
                <Text style={[styles.duration, { backgroundColor: '#4CAF50' }]}>
                  {item.duration}
                </Text>
                <Text style={[styles.price, { color: themeColors.text }]}>
                  {item.price}
                </Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 8,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  courseCard: {
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  courseImage: {
    width: '100%',
    height: 150,
  },
  courseInfo: {
    padding: 16,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  courseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  duration: {
    color: 'white',
    padding: 4,
    borderRadius: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});


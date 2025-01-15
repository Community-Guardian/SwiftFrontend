import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';

const blogPosts = [
  {
    id: 1,
    title: 'Understanding Trading Basics',
    excerpt: 'Learn the fundamental concepts of trading and how to get started...',
    author: 'John Doe',
    date: 'Jan 14, 2024',
    readTime: '5 min read',
    image: '/placeholder.svg?height=200&width=350',
  },
  {
    id: 2,
    title: 'Advanced Trading Strategies',
    excerpt: 'Discover advanced trading techniques used by professional traders...',
    author: 'Jane Smith',
    date: 'Jan 13, 2024',
    readTime: '8 min read',
    image: '/placeholder.svg?height=200&width=350',
  },
  {
    id: 3,
    title: 'Risk Management in Trading',
    excerpt: 'Learn how to protect your investments with proper risk management...',
    author: 'Mike Johnson',
    date: 'Jan 12, 2024',
    readTime: '6 min read',
    image: '/placeholder.svg?height=200&width=350',
  },
];

export default function BlogsScreen() {
  const { theme } = useTheme();
  const themeColors = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: themeColors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: themeColors.text }]}>Trading Blog</Text>

      <View style={styles.blogList}>
        {blogPosts.map((post) => (
          <TouchableOpacity 
            key={post.id}
            style={[styles.blogCard, { backgroundColor: themeColors.card }]}
          >
            <Image source={{ uri: post.image }} style={styles.blogImage} />
            <View style={styles.blogContent}>
              <Text style={[styles.blogTitle, { color: themeColors.text }]}>
                {post.title}
              </Text>
              <Text style={[styles.blogExcerpt, { color: themeColors.text }]}>
                {post.excerpt}
              </Text>
              <View style={styles.blogMeta}>
                <View style={styles.authorInfo}>
                  <Ionicons name="person" size={16} color={themeColors.text} />
                  <Text style={[styles.metaText, { color: themeColors.text }]}>
                    {post.author}
                  </Text>
                </View>
                <View style={styles.dateInfo}>
                  <Ionicons name="calendar" size={16} color={themeColors.text} />
                  <Text style={[styles.metaText, { color: themeColors.text }]}>
                    {post.date}
                  </Text>
                </View>
                <View style={styles.readTimeInfo}>
                  <Ionicons name="time" size={16} color={themeColors.text} />
                  <Text style={[styles.metaText, { color: themeColors.text }]}>
                    {post.readTime}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
  blogList: {
    gap: 16,
  },
  blogCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  blogImage: {
    width: '100%',
    height: 200,
  },
  blogContent: {
    padding: 16,
  },
  blogTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  blogExcerpt: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  blogMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readTimeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
  },
});


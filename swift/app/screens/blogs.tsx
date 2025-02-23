import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { lightTheme, darkTheme } from '@/styles/theme';
import { useArticles } from '@/context/ArticlesContext';

const DEFAULT_IMAGE =
  'https://media.istockphoto.com/id/1130260211/photo/us-dollar-bills-on-a-background-with-dynamics-of-exchange-rates-trading-and-financial-risk.jpg?s=2048x2048&w=is&k=20&c=HkjyZluWVg7XxhQblMaD6xjwzXxBHgidl0fcdWGg5X4=';

export default function BlogsScreen() {
  const { theme } = useTheme();
  const themeColors = theme === 'light' ? lightTheme : darkTheme;
  const { articles, loading, getArticles } = useArticles();
  const [expandedArticles, setExpandedArticles] = useState<Record<number, boolean>>({});

  useEffect(() => {
    getArticles();
  }, []);

  const toggleReadMore = (id: number) => {
    setExpandedArticles((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color={themeColors.primary} />
        <Text style={[styles.loadingText, { color: themeColors.text }]}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isExpanded = expandedArticles[item.id];
          return (
            <View style={[styles.articleCard, { backgroundColor: themeColors.card }]}>
              <Image
                source={item.cover_image ? { uri: item.cover_image } : { uri: DEFAULT_IMAGE }}
                style={styles.coverImage}
                resizeMode="cover"
              />
              <Text style={[styles.articleTitle, { color: themeColors.text }]}>{item.title}</Text>
              <Text style={[styles.articleContent, { color: themeColors.text }]}>
                {isExpanded ? item.content : item.content.slice(0, 100) + '... '}
                {!isExpanded && item.content.length > 100 && (
                  <TouchableOpacity onPress={() => toggleReadMore(item.id)}>
                    <Text style={[styles.readMore, { color: themeColors.primary }]}>Read more</Text>
                  </TouchableOpacity>
                )}
                {isExpanded && (
                  <TouchableOpacity onPress={() => toggleReadMore(item.id)}>
                    <Text style={[styles.readMore, { color: themeColors.primary }]}>Show less</Text>
                  </TouchableOpacity>
                )}
              </Text>
              <Text style={[styles.articleDate, { color: themeColors.text }]}>
                Published on {new Date(item.created_at).toLocaleDateString()}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  articleCard: {
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  coverImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  articleContent: {
    fontSize: 14,
    marginBottom: 8,
  },
  readMore: {
    fontSize: 14,
    fontWeight: '500',
  },
  articleDate: {
    fontSize: 12,
    color: '#757575',
  },
});

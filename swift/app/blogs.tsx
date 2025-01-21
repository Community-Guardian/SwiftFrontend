import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { lightTheme, darkTheme } from '@/styles/theme';
import { useArticles } from '@/context/ArticlesContext';

export default function BlogsScreen() {
  const { theme } = useTheme();
  const themeColors = theme === 'light' ? lightTheme : darkTheme;
  const { articles, loading, getArticles } = useArticles();

  useEffect(() => {
    getArticles();
  }, []);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color={themeColors.primary} />
        <Text style={[styles.loadingText, { color: themeColors.text }]}>Loading...</Text>
      </View>
    );
  }

  // if (error) {
  //   return (
  //     <View style={[styles.errorContainer, { backgroundColor: themeColors.background }]}>
  //       <Text style={[styles.errorText, { color: themeColors.error }]}>{error}</Text>
  //     </View>
  //   );
  // }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.title, { color: themeColors.text }]}>Blogs</Text>
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.articleCard, { backgroundColor: themeColors.card }]}>
            <Text style={[styles.articleTitle, { color: themeColors.text }]}>{item.title}</Text>
            <Text style={[styles.articleAuthor, { color: themeColors.text }]}>By {item.user}</Text>
            <Text style={[styles.articleContent, { color: themeColors.text }]}>{item.content}</Text>
            <Text style={[styles.articleDate, { color: themeColors.text }]}>
              Published on {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>
        )}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
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
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  articleAuthor: {
    fontSize: 14,
    marginBottom: 8,
  },
  articleContent: {
    fontSize: 14,
    marginBottom: 8,
  },
  articleDate: {
    fontSize: 12,
    color: '#757575',
  },
});
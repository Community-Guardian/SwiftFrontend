"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import articlesManager from "../handler/ArticlesManager";
interface ArticleType {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  icon: string;
}
interface Article {
  id: number;
  title: string;
  user: string;
  article_type: ArticleType;
  content: string;
  is_published: boolean;
  cover_image: string;
  tags: string;
  created_at: string;
  updated_at: string;
}



interface ArticlesContextProps {
  articles: Article[];
  publishedarticles: Article[];
  filteredarticles: Article[];
  articleTypes: ArticleType[];
  loading: boolean;
  getArticles: () => Promise<void>;
  getArticleTypes: () => Promise<void>;
  createArticle: (articleData: Partial<Article>) => Promise<void>;
  createArticleType: (articleTypeData: Partial<ArticleType>) => Promise<void>;
  updateArticle: (id: number, articleData: Partial<Article>) => Promise<void>;
  updateArticleType: (id: number, articleTypeData: Partial<ArticleType>) => Promise<void>;
  deleteArticle: (id: number) => Promise<void>;
  deleteArticleType: (id: number) => Promise<void>;
  GetArticleByType: (id: number) => Promise<void>;
  getArticlesPublished: () => Promise<void>;
}

const ArticlesContext = createContext<ArticlesContextProps | undefined>(undefined);

export const ArticlesProvider = ({ children }: { children: ReactNode }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [publishedarticles, setPublishedArticles] = useState<Article[]>([]);
  const [filteredarticles, setFilteredArticles] = useState<Article[]>([]);
  const [articleTypes, setArticleTypes] = useState<ArticleType[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch articles
  const getArticles = async () => {
    setLoading(true);
    try {
      const data = await articlesManager.getArticles();
      setArticles(data);
    } catch (error) {
      console.error("Failed to fetch articles", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch article types
  const getArticleTypes = async () => {
    setLoading(true);
    try {
      const data = await articlesManager.getArticleTypes();
      setArticleTypes(data);
    } catch (error) {
      console.error("Failed to fetch article types", error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new article
  const createArticle = async (articleData: Partial<Article>) => {
    setLoading(true);
    try {
      const newArticle = await articlesManager.createArticle(articleData);
      if (newArticle) {
        setArticles([...articles, newArticle]);
      }
    } catch (error) {
      console.error("Failed to create article", error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new article type
  const createArticleType = async (articleTypeData: Partial<ArticleType>) => {
    setLoading(true);
    try {
      const newArticleType = await articlesManager.createArticleType(articleTypeData);
      if (newArticleType) {
        setArticleTypes([...articleTypes, newArticleType]);
      }
    } catch (error) {
      console.error("Failed to create article type", error);
    } finally {
      setLoading(false);
    }
  };

  // Update an existing article
  const updateArticle = async (id: number, articleData: Partial<Article>) => {
    setLoading(true);
    try {
      const updatedArticle = await articlesManager.updateArticle(id, articleData);
      if (updatedArticle) {
        setArticles(articles.map((article) => (article.id === id ? updatedArticle : article)));
      }
    } catch (error) {
      console.error("Failed to update article", error);
    } finally {
      setLoading(false);
    }
  };

  // Update an existing article type
  const updateArticleType = async (id: number, articleTypeData: Partial<ArticleType>) => {
    setLoading(true);
    try {
      const updatedArticleType = await articlesManager.updateArticleType(id, articleTypeData);
      if (updatedArticleType) {
        setArticleTypes(articleTypes.map((type) => (type.id === id ? updatedArticleType : type)));
      }
    } catch (error) {
      console.error("Failed to update article type", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete an article
  const deleteArticle = async (id: number) => {
    setLoading(true);
    try {
      await articlesManager.deleteArticle(id);
      setArticles(articles.filter((article) => article.id !== id));
    } catch (error) {
      console.error("Failed to delete article", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete an article type
  const deleteArticleType = async (id: number) => {
    setLoading(true);
    try {
      await articlesManager.deleteArticleType(id);
      setArticleTypes(articleTypes.filter((type) => type.id !== id));
    } catch (error) {
      console.error("Failed to delete article type", error);
    } finally {
      setLoading(false);
    }
  };
  // Get Filters articles
  const GetArticleByType = async (id: number) => {
    setLoading(true);
    try {
      const updatedArticleType = await articlesManager.getArticlesByType(id);
      if (updatedArticleType) {
        setFilteredArticles(articles);
      }
    } catch (error) {
      console.error("Failed to update article type", error);
    } finally {
      setLoading(false);
    }
  };
  const getArticlesPublished = async () => {
    setLoading(true);
    try {
      const data = await articlesManager.getArticlesByPublished();
      setPublishedArticles(data);
    } catch (error) {
      console.error("Failed to fetch Published articles", error);
    } finally {
      setLoading(false);
    }
  };
  // Fetch articles and article types on initial render
  useEffect(() => {
    getArticles();
    getArticleTypes();
  }, []);

  return (
    <ArticlesContext.Provider
      value={{
        articles,
        publishedarticles,
        filteredarticles,
        articleTypes,
        loading,
        getArticles,
        getArticleTypes,
        createArticle,
        createArticleType,
        updateArticle,
        updateArticleType,
        deleteArticle,
        deleteArticleType,
        GetArticleByType,
        getArticlesPublished,
      }}
    >
      {children}
    </ArticlesContext.Provider>
  );
};

export const useArticles = () => {
  const context = useContext(ArticlesContext);
  if (context === undefined) {
    throw new Error("useArticles must be used within an ArticlesProvider");
  }
  return context;
};

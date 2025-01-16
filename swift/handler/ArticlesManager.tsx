import axios, { AxiosError, AxiosResponse, AxiosRequestConfig,InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  GET_ARTICLES_URL, 
  CREATE_ARTICLE_URL, 
  UPDATE_ARTICLE_URL, 
  DELETE_ARTICLE_URL,
  GET_ARTICLE_TYPES_URL,
  CREATE_ARTICLE_TYPE_URL,
  UPDATE_ARTICLE_TYPE_URL,
  DELETE_ARTICLE_TYPE_URL,
  GET_ARTICLES_BY_TYPE_URL,
  GET_PUBLISHED_ARTICLES_URL,
  REFRESH_TOKEN_URL,
} from '@/handler/apiConfig';

// Define the response data structure for articles
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

// Define the error response structure
interface ApiErrorResponse {
  detail?: string;
  [key: string]: unknown;
}

// Handler for API errors
const handleApiError = (error: AxiosError<ApiErrorResponse>) => {
  if (error.response && error.response.data) {
    console.error('API Error:', error.response.data);
    throw error.response.data; // Throw detailed API error response
  } else {
    console.error('API Error:', error.message);
    throw error; // Throw general error if no response
  }
};

// Configure Axios instance
const api = axios.create({
  baseURL: GET_ARTICLES_URL,
});

// Add a request interceptor to include the access token in headers
api.interceptors.request.use(
  async (config: AxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    try {
      const token = await localStorage.getItem('accessToken');
      if (token && config.headers) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      } else {
        config.headers = {}; // provide a default value for headers
      }
    } catch (error) {
      console.error('Error retrieving access token:', error);
    }
    return config as InternalAxiosRequestConfig; // cast config to InternalAxiosRequestConfig
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Handle refresh token logic
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest: (AxiosRequestConfig & { _retry?: boolean }) | undefined = error.config;
    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (originalRequest && error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        if (refreshToken) {
          const response = await api.post(REFRESH_TOKEN_URL, { refresh: refreshToken });

          if (response.status === 200) {
            await AsyncStorage.setItem('accessToken', response.data.access);
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
            }
            return api(originalRequest);
          } else {
            await AsyncStorage.removeItem('accessToken');
            await AsyncStorage.removeItem('refreshToken');
          }
        }

        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        return Promise.reject(error);
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ArticlesManager class
class ArticlesManager {
  // Articles Methods
  async getArticles(): Promise<Article[]> {
    try {
      const response = await api.get<Article[]>(GET_ARTICLES_URL);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      return [];
    }
  }

  async createArticle(articleData: Partial<Article>): Promise<Article | undefined> {
    try {
      const response = await api.post<Article>(CREATE_ARTICLE_URL, articleData);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      return undefined;
    }
  }

  async updateArticle(id: number, articleData: Partial<Article>): Promise<Article | undefined> {
    try {
      const response = await api.put<Article>(UPDATE_ARTICLE_URL(id), articleData);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      return undefined;
    }
  }

  async deleteArticle(id: number): Promise<void> {
    try {
      await api.delete(DELETE_ARTICLE_URL(id));
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
    }
  }

  // Article Types Methods
  async getArticleTypes(): Promise<ArticleType[]> {
    try {
      const response = await api.get<ArticleType[]>(GET_ARTICLE_TYPES_URL);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      return [];
    }
  }

  async createArticleType(articleTypeData: Partial<ArticleType>): Promise<ArticleType | undefined> {
    try {
      const response = await api.post<ArticleType>(CREATE_ARTICLE_TYPE_URL, articleTypeData);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      return undefined;
    }
  }

  async updateArticleType(id: number, articleTypeData: Partial<ArticleType>): Promise<ArticleType | undefined> {
    try {
      const response = await api.put<ArticleType>(UPDATE_ARTICLE_TYPE_URL(id), articleTypeData);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      return undefined;
    }
  }

  async deleteArticleType(id: number): Promise<void> {
    try {
      await api.delete(DELETE_ARTICLE_TYPE_URL(id));
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
    }
  }
  // get filtered articles
async getArticlesByType(id: number): Promise<Article[]> {
  try {
    const response = await api.get<Article[]>(`${GET_ARTICLES_BY_TYPE_URL}?type=${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError<ApiErrorResponse>);
    return [];
  }
}
async getArticlesByPublished(): Promise<Article[]> {
  try {
    const response = await api.get<Article[]>(GET_PUBLISHED_ARTICLES_URL);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError<ApiErrorResponse>);
    return [];
  }
}
}

const articlesManager = new ArticlesManager();
export default articlesManager;

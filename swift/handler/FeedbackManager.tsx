import axios, { AxiosError, AxiosResponse, AxiosRequestConfig,InternalAxiosRequestConfig } from 'axios';
import { 
  GET_FEEDBACK_URL, 
  CREATE_FEEDBACK_URL, 
  UPDATE_FEEDBACK_URL, 
  DELETE_FEEDBACK_URL ,
  REFRESH_TOKEN_URL
} from '@/handler/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the response data structure for feedback
interface Feedback {
  id: number;
  user: string;
  feedback: string;
  rating: number;
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
  baseURL: GET_FEEDBACK_URL,
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

// FeedbackManager class
class FeedbackManager {
  async getFeedback(): Promise<Feedback[]> {
    try {
      const response = await api.get<Feedback[]>(GET_FEEDBACK_URL);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      return [];
    }
  }

  async createFeedback(feedbackData: Partial<Feedback>): Promise<Feedback | undefined> {
    try {
      const response = await api.post<Feedback>(CREATE_FEEDBACK_URL, feedbackData);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      return undefined;
    }
  }

  async updateFeedback(id: number, feedbackData: Partial<Feedback>): Promise<Feedback | undefined> {
    try {
      const response = await api.put<Feedback>(UPDATE_FEEDBACK_URL(id), feedbackData);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      return undefined;
    }
  }

  async deleteFeedback(id: number): Promise<void> {
    try {
      await api.delete(DELETE_FEEDBACK_URL(id));
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
    }
  }
}

const feedbackManager = new FeedbackManager();
export default feedbackManager;
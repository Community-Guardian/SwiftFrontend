import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import { 
  GET_NOTIFICATIONS_URL, 
  CREATE_NOTIFICATION_URL, 
  UPDATE_NOTIFICATION_URL, 
  DELETE_NOTIFICATION_URL,
  REFRESH_TOKEN_URL
} from '@/handler/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the response data structure for notifications
interface Notification {
  id: number;
  user: string;
  notification_type: string;
  title: string;
  message: string;
  is_read: boolean;
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
  baseURL: GET_NOTIFICATIONS_URL,
});

// Add a request interceptor to include the access token in headers
api.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error retrieving access token:', error);
    }
    return config;
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

// NotificationsManager class
class NotificationsManager {
  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await api.get<Notification[]>(GET_NOTIFICATIONS_URL);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      return [];
    }
  }

  async createNotification(notificationData: Partial<Notification>): Promise<Notification | undefined> {
    try {
      const response = await api.post<Notification>(CREATE_NOTIFICATION_URL, notificationData);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      return undefined;
    }
  }

  async updateNotification(id: number, notificationData: Partial<Notification>): Promise<Notification | undefined> {
    try {
      const response = await api.put<Notification>(UPDATE_NOTIFICATION_URL(id), notificationData);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      return undefined;
    }
  }

  async deleteNotification(id: number): Promise<void> {
    try {
      await api.delete(DELETE_NOTIFICATION_URL(id));
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
    }
  }
}

const notificationsManager = new NotificationsManager();
export default notificationsManager;
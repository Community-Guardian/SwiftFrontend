import axios, { AxiosError, AxiosResponse, AxiosRequestConfig,InternalAxiosRequestConfig } from 'axios';
import { LOGIN_URL, SIGN_UP_URL, REFRESH_TOKEN_URL,BASE_URL, LOGOUT_URL } from '@/handler/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined: string;
  last_login: string;
  image: string;
  referral_code: string;
  is_verified: boolean;
  referred_by: string;
}
// Define the response data structure for authentication
interface AuthResponse {
  access: string;
  refresh: string;
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
  baseURL: BASE_URL,
});


// Add a request interceptor to include the access token in headers
api.interceptors.request.use(
  async (config: AxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
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

// AuthManager class
class AuthManager {
  async login(email: string, password: string): Promise<AuthResponse | undefined> {
    try {
      console.log('Logging in...');
      console.log(BASE_URL);
      const response = await api.post<AuthResponse>(LOGIN_URL, { email, password });
      console.log(response);
      AsyncStorage.setItem('accessToken', response.data.access);
      AsyncStorage.setItem('refreshToken', response.data.refresh);
      return response.data;
    } catch (error) {
      console.error('Failed to login', error);
      handleApiError(error as AxiosError<ApiErrorResponse>);
    }
  }

  async register(email: string, password1: string,password2: string, user_type:string , referral_code: string): Promise<AuthResponse | undefined> {
    try {
      const response = await api.post(SIGN_UP_URL, { email, password1, password2, user_type,referral_code });
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
    }
  }

  async refreshToken(): Promise<AuthResponse | undefined> {
    try {
      const token = AsyncStorage.getItem('refreshToken');
      if (!token) {
        throw new Error('No refresh token found');
      }
      const response = await api.post<AuthResponse>(REFRESH_TOKEN_URL, { refresh: token });
      AsyncStorage.setItem('accessToken', response.data.access);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post(LOGOUT_URL);
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
    } finally {
      AsyncStorage.removeItem('accessToken');
      AsyncStorage.removeItem('refreshToken');
    }
  }


  async getUser() {
    try {
      const response = await api.get('/users/')
      return response.data[0]
    } catch (error) {
      console.error('Failed to fetch user', error)
      handleApiError(error as AxiosError<ApiErrorResponse>);
      throw error      
    }
  }
  async updateUser(id: string, data: FormData) {
    try {
      // Make a PATCH request to update the user, passing FormData as the body
      const response = await api.patch(`/users/${id}/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for sending FormData
        },
      });
      return response.data; // Return the response data
    } catch (error) {
      // Handle any API errors
      handleApiError(error as AxiosError<ApiErrorResponse>);
      console.error('Failed to update user', error);
      throw error; // Throw error to be handled further if needed
    }
  }
  
}
const authManager = new AuthManager();
export default authManager;

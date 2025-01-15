import { BASE_URL } from '@/handler/apiConfig';
import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';

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
    async (config: AxiosRequestConfig) => {
      try {
        const token = await localStorage.getItem('accessToken');
  
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
          const refreshToken = await localStorage.getItem('refreshToken');
  
          if (refreshToken) {
            const response = await api.post(REFRESH_TOKEN_URL, { refresh: refreshToken });
  
            if (response.status === 200) {
              await localStorage.setItem('accessToken', response.data.access);
              if (originalRequest.headers) {
                originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
              }
              return api(originalRequest);
            } else {
              await localStorage.removeItem('accessToken');
              await localStorage.removeItem('refreshToken');
            }
          }
  
          await localStorage.removeItem('accessToken');
          await localStorage.removeItem('refreshToken');
          return Promise.reject(error);
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
          await localStorage.removeItem('accessToken');
          await localStorage.removeItem('refreshToken');
          return Promise.reject(refreshError);
        }
      }
  
      return Promise.reject(error);
    }
  );
  
class UsersManager {
  async getUsers() {
    try {
      const response = await api.get('/users/')
      return response.data
    } catch (error) {
      console.error('Failed to fetch users', error)
      throw error
    }
  }

  async createUser(userData: Partial<User>) {
    try {
      const response = await api.post('/users/', userData)
      return response.data
    } catch (error) {
      console.error('Failed to create user', error)
      throw error
    }
  }

  async updateUser(id: string, userData: Partial<User>) {
    try {
      const response = await api.put(`/users/${id}/`, userData)
      return response.data
    } catch (error) {
      console.error('Failed to update user', error)
      throw error
    }
  }

  async deleteUser(id: string) {
    try {
      await api.delete(`/users/${id}/`)
    } catch (error) {
      console.error('Failed to delete user', error)
      throw error
    }
  }
}

const usersManager = new UsersManager()
export default usersManager
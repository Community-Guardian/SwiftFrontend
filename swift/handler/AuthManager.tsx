import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import { LOGIN_URL, SIGN_UP_URL, REFRESH_TOKEN_URL,BASE_URL, LOGOUT_URL } from '@/handler/apiConfig';

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

// AuthManager class
class AuthManager {
  async login(email: string, password: string): Promise<AuthResponse | undefined> {
    try {
      const response = await api.post<AuthResponse>(LOGIN_URL, { email, password });
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      return undefined;
    }
  }

  async register(email: string, password1: string,password2: string, user_type:string): Promise<AuthResponse | undefined> {
    try {
      const response = await api.post(SIGN_UP_URL, { email, password1, password2, user_type });
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
    }
  }

  async refreshToken(): Promise<AuthResponse | undefined> {
    try {
      const token = localStorage.getItem('refreshToken');
      if (!token) {
        throw new Error('No refresh token found');
      }
      const response = await api.post<AuthResponse>(REFRESH_TOKEN_URL, { refresh: token });
      localStorage.setItem('accessToken', response.data.access);
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
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') {
      return false; // Assume not authenticated on the server
    }
    return !!localStorage.getItem('accessToken');
  }
}

const authManager = new AuthManager();
export default authManager;

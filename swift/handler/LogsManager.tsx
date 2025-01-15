import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import { 
  GET_LOGS_URL, 
  CREATE_LOG_URL, 
  UPDATE_LOG_URL, 
  DELETE_LOG_URL ,
  REFRESH_TOKEN_URL
} from '@/handler/apiConfig';

// Define the response data structure for logs
interface Log {
  id: number;
  user: string;
  log_type: string;
  action: string;
  details: string;
  timestamp: string;
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
  baseURL: GET_LOGS_URL,
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

// LogsManager class
class LogsManager {
  async getLogs(): Promise<Log[]> {
    try {
      const response = await api.get<Log[]>(GET_LOGS_URL);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      return [];
    }
  }

  async createLog(logData: Partial<Log>): Promise<Log | undefined> {
    try {
      const response = await api.post<Log>(CREATE_LOG_URL, logData);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      return undefined;
    }
  }

  async updateLog(id: number, logData: Partial<Log>): Promise<Log | undefined> {
    try {
      const response = await api.put<Log>(UPDATE_LOG_URL(id), logData);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      return undefined;
    }
  }

  async deleteLog(id: number): Promise<void> {
    try {
      await api.delete(DELETE_LOG_URL(id));
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
    }
  }
}

const logsManager = new LogsManager();
export default logsManager;
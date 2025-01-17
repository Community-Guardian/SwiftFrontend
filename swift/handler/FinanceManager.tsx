import axios, { AxiosError, AxiosResponse, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import {
  GET_INVESTMENTS_URL,
  CREATE_INVESTMENT_URL,
  UPDATE_INVESTMENT_URL,
  DELETE_INVESTMENT_URL,
  GET_FINANCIAL_REPORTS_URL,
  CREATE_FINANCIAL_REPORT_URL,
  UPDATE_FINANCIAL_REPORT_URL,
  DELETE_FINANCIAL_REPORT_URL,
  REFRESH_TOKEN_URL,
  BASE_URL
} from '@/handler/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the response data structure for investments and financial reports
interface Investment {
  id: number;
  user: string;
  amount: number;
  start_date: string;
  duration_days: number;
  interest_rate: number;
  created_at: string;
  updated_at: string;
}

interface FinancialReport {
  id: number;
  total_payments: number;
  total_rewards: number;
  total_investments: number;
  total_interest: number;
  report_date: string;
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

// FinanceManager class
class FinanceManager {
  // Investments Methods
  async getInvestments(): Promise<Investment[]> {
    try {
      const response = await api.get<Investment[]>(GET_INVESTMENTS_URL);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      return [];
    }
  }

  async createInvestment(investmentData: Partial<Investment>): Promise<Investment | undefined> {
    try {
      const response = await api.post<Investment>(CREATE_INVESTMENT_URL, investmentData);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      return undefined;
    }
  }

  async updateInvestment(id: number, investmentData: Partial<Investment>): Promise<Investment | undefined> {
    try {
      const response = await api.put<Investment>(UPDATE_INVESTMENT_URL(id), investmentData);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      return undefined;
    }
  }

  async deleteInvestment(id: number): Promise<void> {
    try {
      await api.delete(DELETE_INVESTMENT_URL(id));
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
    }
  }

  // Financial Reports Methods
  async getFinancialReports(): Promise<FinancialReport[]> {
    try {
      const response = await api.get<FinancialReport[]>(GET_FINANCIAL_REPORTS_URL);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      return [];
    }
  }

  async createFinancialReport(reportData: Partial<FinancialReport>): Promise<FinancialReport | undefined> {
    try {
      const response = await api.post<FinancialReport>(CREATE_FINANCIAL_REPORT_URL, reportData);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      return undefined;
    }
  }

  async updateFinancialReport(id: number, reportData: Partial<FinancialReport>): Promise<FinancialReport | undefined> {
    try {
      const response = await api.put<FinancialReport>(UPDATE_FINANCIAL_REPORT_URL(id), reportData);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      return undefined;
    }
  }

  async deleteFinancialReport(id: number): Promise<void> {
    try {
      await api.delete(DELETE_FINANCIAL_REPORT_URL(id));
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
    }
  }
}

const financeManager = new FinanceManager();
export default financeManager;
import axios, { AxiosError, AxiosResponse, AxiosRequestConfig,InternalAxiosRequestConfig } from 'axios';
import { 
  GET_PAYMENTS_URL, 
  CREATE_PAYMENT_URL, 
  UPDATE_PAYMENT_URL, 
  DELETE_PAYMENT_URL, 
  CREATE_MPESA_PAYMENT_INTENT_URL, 
  REFUND_PAYMENT_URL ,
  REFRESH_TOKEN_URL
} from '@/handler/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the response data structure for payments
interface Payment {
  id: number;
  service: string;
  payment_method: string;
  payment_status: string;
  amount: number;
  transaction_id: string;
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
  baseURL: GET_PAYMENTS_URL,
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
// PaymentsManager class
class PaymentsManager {
  async getPayments(): Promise<Payment[]> {
    try {
      const response = await api.get<Payment[]>(GET_PAYMENTS_URL);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      return [];
    }
  }

  async createPayment(paymentData: Partial<Payment>): Promise<Payment | undefined> {
    try {
      const response = await api.post<Payment>(CREATE_PAYMENT_URL, paymentData);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      return undefined;
    }
  }

  async updatePayment(id: number, paymentData: Partial<Payment>): Promise<Payment | undefined> {
    try {
      const response = await api.put<Payment>(UPDATE_PAYMENT_URL(id), paymentData);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      return undefined;
    }
  }

  async deletePayment(id: number): Promise<void> {
    try {
      await api.delete(DELETE_PAYMENT_URL(id));
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
    }
  }

  async createMpesaPaymentIntent(serviceId: number, phone_number: string): Promise<Payment | undefined> {
    try {
      const response = await api.post<Payment>(CREATE_MPESA_PAYMENT_INTENT_URL, { serviceId, phone_number });
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      return undefined;
    }
  }

  async refundPayment(paymentId: number, refundAmount: number, phone_number: string): Promise<void> {
    try {
      await api.post(REFUND_PAYMENT_URL, { paymentId, refundAmount, phone_number });
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
    }
  }
}

const paymentsManager = new PaymentsManager();
export default paymentsManager;
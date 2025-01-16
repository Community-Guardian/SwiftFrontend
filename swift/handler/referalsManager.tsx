import axios, { AxiosError, AxiosResponse, AxiosRequestConfig,InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

import { GET_REFERRALS_URL, CREATE_REFERRAL_URL, GET_REWARDS_URL, CREATE_REWARD_URL, REFRESH_TOKEN_URL } from '@/handler/apiConfig';


// Define the response data structure for referrals and rewards
interface Referral {
  id: number;
  referrer: string;
  referred?: string | null;
  referral_code: string;
  reward_amount: string;
  created_at: string;
  is_successful: boolean;
}

interface Reward {
  id: number;
  user: string;
  referral: Referral;
  reward_amount: string;
  created_at: string;
}

// Define the error response structure
interface ApiErrorResponse {
  detail?: string;
  [key: string]: unknown;
}

// Handler for API errors
const handleApiError = (error: AxiosError<ApiErrorResponse>) => {
  if (error.response && error.response.data) {
    console.error("API Error:", error.response.data);
    throw error.response.data; // Throw detailed API error response
  } else {
    console.error("API Error:", error.message);
    throw error; // Throw general error if no response
  }
};

// Configure Axios instance
const api = axios.create({
  baseURL: GET_REFERRALS_URL,
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

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");

        if (refreshToken) {
          const response = await api.post(REFRESH_TOKEN_URL, { refresh: refreshToken });

          if (response.status === 200) {
            await AsyncStorage.setItem("accessToken", response.data.access);
            if (originalRequest.headers) {
              originalRequest.headers["Authorization"] = `Bearer ${response.data.access}`;
            }
            return api(originalRequest);
          } else {
            await AsyncStorage.removeItem("accessToken");
            await AsyncStorage.removeItem("refreshToken");
          }
        }

        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("refreshToken");
        return Promise.reject(error);
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("refreshToken");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ReferralsManager class
class ReferralsManager {
  // Referrals Methods
  async getReferrals(): Promise<Referral[]> {
    try {
      const response = await api.get<Referral[]>(GET_REFERRALS_URL);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      return [];
    }
  }

  async createReferral(referralData: Partial<Referral>): Promise<Referral | undefined> {
    try {
      const response = await api.post<Referral>(CREATE_REFERRAL_URL, referralData);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      return undefined;
    }
  }

  // Rewards Methods
  async getRewards(): Promise<Reward[]> {
    try {
      const response = await api.get<Reward[]>(GET_REWARDS_URL);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      return [];
    }
  }

  async createReward(rewardData: Partial<Reward>): Promise<Reward | undefined> {
    try {
      const response = await api.post<Reward>(CREATE_REWARD_URL, rewardData);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      return undefined;
    }
  }
}

const referralsManager = new ReferralsManager();
export default referralsManager;

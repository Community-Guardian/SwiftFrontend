import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import { 
  GET_SERVICES_URL, 
  CREATE_SERVICE_URL, 
  UPDATE_SERVICE_URL, 
  DELETE_SERVICE_URL ,
  GET_SERVICE_TYPES_URL,
  CREATE_SERVICE_TYPE_URL,
  UPDATE_SERVICE_TYPE_URL,
  DELETE_SERVICE_TYPE_URL,
  REFRESH_TOKEN_URL
} from '@/handler/apiConfig';

interface ServiceType {
  id: number;
  name: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

interface Service {
  id: number;
  name: string;
  service_type: ServiceType; // Nested service type object
  service_type_id: string; 
  price: number;
  description: string;
  link: string;
  duration: string;
  is_active: boolean;
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
  baseURL: GET_SERVICES_URL,
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

// ServicesManager class
class ServicesManager {
  async getServices(): Promise<Service[]> {
    try {
      const response = await api.get<Service[]>(GET_SERVICES_URL);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      return [];
    }
  }

  async createService(serviceData: Partial<Service>): Promise<Service | undefined> {
    try {
      const response = await api.post<Service>(CREATE_SERVICE_URL, serviceData);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      return undefined;
    }
  }

  async updateService(id: number, serviceData: Partial<Service>): Promise<Service | undefined> {
    try {
      const response = await api.put<Service>(UPDATE_SERVICE_URL(id), serviceData);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      return undefined;
    }
  }

  async deleteService(id: number): Promise<void> {
    try {
      await api.delete(DELETE_SERVICE_URL(id));
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
    }
  }
  async getServiceTypes(): Promise<ServiceType[]> {
    try {
      const response = await api.get<ServiceType[]>(GET_SERVICE_TYPES_URL);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      return [];
    }
  }

  async createServiceType(serviceTypeData: Partial<ServiceType>): Promise<ServiceType | undefined> {
    try {
      const response = await api.post<ServiceType>(CREATE_SERVICE_TYPE_URL, serviceTypeData);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      return undefined;
    }
  }

  async updateServiceType(id: number, serviceTypeData: Partial<ServiceType>): Promise<ServiceType | undefined> {
    try {
      const response = await api.put<ServiceType>(UPDATE_SERVICE_TYPE_URL(id), serviceTypeData);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
      return undefined;
    }
  }

  async deleteServiceType(id: number): Promise<void> {
    try {
      await api.delete(DELETE_SERVICE_TYPE_URL(id));
    } catch (error) {
      handleApiError(error as AxiosError<ApiErrorResponse>);
    }
  }
}

const servicesManager = new ServicesManager();
export default servicesManager;
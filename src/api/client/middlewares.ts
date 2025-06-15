import type { MiddlewareConfig } from './types';
import { authApi } from '../../features/auth/api/authApi';

export const authMiddleware: MiddlewareConfig = {
  onRequest: async (config) => {
    const token = authApi.getToken();
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
};

export const loggingMiddleware: MiddlewareConfig = {
  onRequest: async (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
      data: config.data,
    });
    return config;
  },
  onResponse: async (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`, {
      data: response.data,
    });
    return response;
  },
  onError: async (error) => {
    console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });
    return error;
  },
}; 
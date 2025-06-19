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
    // Suppress error logging for endpoints under development (temporary)
    const url = error.config?.url || '';
    const is404 = error.response?.status === 404;
    const isDocumentsEndpoint = url.includes('/documents');
    const isAnalyticsEndpoint = url.includes('/analytics');

    // Only suppress 404 errors for documents and analytics endpoints
    if (is404 && (isDocumentsEndpoint || isAnalyticsEndpoint)) {
      // Log as warning instead of error for these temporary endpoints
      console.warn(`[API Warning] ${error.config?.method?.toUpperCase()} ${error.config?.url} - Endpoint under development`, {
        status: error.response?.status,
        message: 'Endpoint not yet implemented',
      });
    } else {
      // Log all other errors normally
      console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      });
    }
    return error;
  },
}; 
/**
 * API Service
 *
 * This file provides a centralized API service for making HTTP requests.
 * It uses Axios for HTTP requests and includes interceptors for authentication and error handling.
 * In development, it can use mock handlers instead of making real HTTP requests.
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { handlers } from '../mockData/handlers.ts';

// Environment variables
const API_URL = process.env.REACT_APP_API_URL || 'https://api.connectchain.com';
const USE_MOCK_API = process.env.REACT_APP_USE_MOCK_API === 'true' || process.env.NODE_ENV === 'development';

// Create Axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }

    // Handle server errors
    if (error.response?.status && error.response.status >= 500) {
      console.error('Server error:', error);
      // Could dispatch to a notification system here
    }

    return Promise.reject(error);
  }
);

// Mock API implementation
const mockApi = {
  get: async (url: string, config?: AxiosRequestConfig) => {
    console.log(`[Mock API] GET ${url}`, config);

    // Parse the URL to determine which handler to use
    const urlParts = url.split('/').filter(Boolean);
    const resource = urlParts[0];
    const id = urlParts[1];
    const action = urlParts[2];

    // Extract query parameters
    const queryParams = config?.params || {};

    try {
      let response;

      // Route to the appropriate mock handler
      switch (resource) {
        case 'users':
          if (id) {
            response = await handlers.users.getById(id);
          } else {
            response = await handlers.users.getAll(queryParams);
          }
          break;

        case 'suppliers':
          if (id) {
            // Implement getById for suppliers
            response = { error: 'Not implemented' };
          } else {
            response = await handlers.suppliers.getAll(queryParams);
          }
          break;

        case 'categories':
          response = await handlers.categories.getAll(queryParams);
          break;

        case 'orders':
          response = await handlers.orders.getAll(queryParams);
          break;

        case 'dashboard':
          response = await handlers.dashboard.getStats();
          break;

        default:
          response = { error: `Unknown resource: ${resource}` };
      }

      // Check if the response is an error
      if (response && response.error) {
        return Promise.reject({
          response: {
            status: response.error.status || 500,
            data: response.error
          }
        });
      }

      // Return a mock Axios response
      return {
        data: response,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: config || {},
      } as AxiosResponse;

    } catch (error) {
      console.error('[Mock API] Error:', error);
      return Promise.reject({
        response: {
          status: 500,
          data: { message: 'Mock API error' }
        }
      });
    }
  },

  post: async (url: string, data: any, config?: AxiosRequestConfig) => {
    console.log(`[Mock API] POST ${url}`, data, config);

    const urlParts = url.split('/').filter(Boolean);
    const resource = urlParts[0];
    const id = urlParts[1];
    const action = urlParts[2];

    try {
      let response;

      // Special case for auth endpoints
      if (url === '/auth/login') {
        response = await handlers.auth.login(data.email, data.password);
      } else if (url === '/auth/logout') {
        response = await handlers.auth.logout();
      } else {
        // Handle other resources
        switch (resource) {
          case 'users':
            response = await handlers.users.create(data);
            break;

          // Implement other resources...

          default:
            response = { error: `Unknown resource: ${resource}` };
        }
      }

      // Check if the response is an error
      if (response && response.error) {
        return Promise.reject({
          response: {
            status: response.error.status || 500,
            data: response.error
          }
        });
      }

      return {
        data: response,
        status: 201,
        statusText: 'Created',
        headers: {},
        config: config || {},
      } as AxiosResponse;

    } catch (error) {
      console.error('[Mock API] Error:', error);
      return Promise.reject({
        response: {
          status: 500,
          data: { message: 'Mock API error' }
        }
      });
    }
  },

  put: async (url: string, data: any, config?: AxiosRequestConfig) => {
    console.log(`[Mock API] PUT ${url}`, data, config);

    const urlParts = url.split('/').filter(Boolean);
    const resource = urlParts[0];
    const id = urlParts[1];

    try {
      let response;

      switch (resource) {
        case 'users':
          if (id) {
            response = await handlers.users.update(id, data);
          }
          break;

        // Implement other resources...

        default:
          response = { error: `Unknown resource: ${resource}` };
      }

      // Check if the response is an error
      if (response && response.error) {
        return Promise.reject({
          response: {
            status: response.error.status || 500,
            data: response.error
          }
        });
      }

      return {
        data: response,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: config || {},
      } as AxiosResponse;

    } catch (error) {
      console.error('[Mock API] Error:', error);
      return Promise.reject({
        response: {
          status: 500,
          data: { message: 'Mock API error' }
        }
      });
    }
  },

  delete: async (url: string, config?: AxiosRequestConfig) => {
    console.log(`[Mock API] DELETE ${url}`, config);

    const urlParts = url.split('/').filter(Boolean);
    const resource = urlParts[0];
    const id = urlParts[1];

    try {
      let response;

      switch (resource) {
        case 'users':
          if (id) {
            response = await handlers.users.delete(id);
          }
          break;

        // Implement other resources...

        default:
          response = { error: `Unknown resource: ${resource}` };
      }

      // Check if the response is an error
      if (response && response.error) {
        return Promise.reject({
          response: {
            status: response.error.status || 500,
            data: response.error
          }
        });
      }

      return {
        data: response,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: config || {},
      } as AxiosResponse;

    } catch (error) {
      console.error('[Mock API] Error:', error);
      return Promise.reject({
        response: {
          status: 500,
          data: { message: 'Mock API error' }
        }
      });
    }
  }
};

// Export the API service
const api = USE_MOCK_API ? mockApi : axiosInstance;

export default api;

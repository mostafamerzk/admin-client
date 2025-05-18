/**
 * Mock API Service
 * 
 * This file provides a mock API service for development and testing.
 * It intercepts API requests and returns mock data.
 */

import type{ AxiosRequestConfig, AxiosResponse } from 'axios';
import { handlers } from '../mockData/handlers.ts';

// Mock API implementation
const mockApi = {
  get: async (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
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
            response = await handlers.suppliers.getById?.(id) || { error: 'Not implemented' };
          } else {
            response = await handlers.suppliers.getAll(queryParams);
          }
          break;

        case 'categories':
          if (id) {
            response = await handlers.categories.getById?.(id) || { error: 'Not implemented' };
          } else {
            response = await handlers.categories.getAll(queryParams);
          }
          break;

        case 'orders':
          if (id) {
            response = await handlers.orders.getById?.(id) || { error: 'Not implemented' };
          } else {
            response = await handlers.orders.getAll(queryParams);
          }
          break;

        case 'dashboard':
          response = await handlers.dashboard.getStats();
          break;

        case 'auth':
          if (action === 'me') {
            // Extract token from Authorization header
            const authHeader = config?.headers?.Authorization || '';
            const token = authHeader.replace('Bearer ', '');
            response = await handlers.auth.getCurrentUser(token);
          } else {
            response = { error: `Unknown auth action: ${action}` };
          }
          break;

        default:
          response = { error: `Unknown resource: ${resource}` };
      }

      // Check if the response is an error
      if (response && 'error' in response) {
        const errorStatus = typeof response.error === 'object' && response.error !== null && 'status' in response.error 
          ? response.error.status 
          : 500;
          
        return Promise.reject({
          response: {
            status: errorStatus,
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

  post: async (url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
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

          case 'suppliers':
            response = await handlers.suppliers.create?.(data) || { error: 'Not implemented' };
            break;

          case 'categories':
            response = await handlers.categories.create?.(data) || { error: 'Not implemented' };
            break;

          case 'orders':
            response = await handlers.orders.create?.(data) || { error: 'Not implemented' };
            break;

          default:
            response = { error: `Unknown resource: ${resource}` };
        }
      }

      // Check if the response is an error
      if (response && 'error' in response) {
        const errorStatus = typeof response.error === 'object' && response.error !== null && 'status' in response.error 
          ? response.error.status 
          : 500;
          
        return Promise.reject({
          response: {
            status: errorStatus,
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

  put: async (url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
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
          } else {
            response = { error: 'Missing ID for update' };
          }
          break;

        case 'suppliers':
          if (id) {
            response = await handlers.suppliers.update?.(id, data) || { error: 'Not implemented' };
          } else {
            response = { error: 'Missing ID for update' };
          }
          break;

        case 'categories':
          if (id) {
            response = await handlers.categories.update?.(id, data) || { error: 'Not implemented' };
          } else {
            response = { error: 'Missing ID for update' };
          }
          break;

        case 'orders':
          if (id) {
            response = await handlers.orders.update?.(id, data) || { error: 'Not implemented' };
          } else {
            response = { error: 'Missing ID for update' };
          }
          break;

        default:
          response = { error: `Unknown resource: ${resource}` };
      }

      // Check if the response is an error
      if (response && 'error' in response) {
        const errorStatus = typeof response.error === 'object' && response.error !== null && 'status' in response.error 
          ? response.error.status 
          : 500;
          
        return Promise.reject({
          response: {
            status: errorStatus,
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

  delete: async (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
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
          } else {
            response = { error: 'Missing ID for delete' };
          }
          break;

        case 'suppliers':
          if (id) {
            response = await handlers.suppliers.delete?.(id) || { error: 'Not implemented' };
          } else {
            response = { error: 'Missing ID for delete' };
          }
          break;

        case 'categories':
          if (id) {
            response = await handlers.categories.delete?.(id) || { error: 'Not implemented' };
          } else {
            response = { error: 'Missing ID for delete' };
          }
          break;

        case 'orders':
          if (id) {
            response = await handlers.orders.delete?.(id) || { error: 'Not implemented' };
          } else {
            response = { error: 'Missing ID for delete' };
          }
          break;

        default:
          response = { error: `Unknown resource: ${resource}` };
      }

      // Check if the response is an error
      if (response && 'error' in response) {
        const errorStatus = typeof response.error === 'object' && response.error !== null && 'status' in response.error 
          ? response.error.status 
          : 500;
          
        return Promise.reject({
          response: {
            status: errorStatus,
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

export default mockApi;




/**
 * Mock API Service
 * 
 * This file provides a mock API service for development and testing.
 * It intercepts API requests and returns mock data.
 */

import type{ AxiosRequestConfig, AxiosResponse } from 'axios';
import { handlers } from '../mockData/handlers';

// Mock API implementation
const mockApi = {
  get: async (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
    console.log(`[Mock API] GET ${url}`, config);

    // Parse the URL to determine which handler to use
    const urlParts = url.split('/').filter(Boolean);
    const resource = urlParts[0] || '';

    // Improved URL parsing logic to handle both ID-based and action-based routes
    let id: string | undefined;
    let action: string | undefined;

    // Special handling for resources that use action-based routes
    const actionBasedResources = ['dashboard', 'auth', 'profile'];

    if (actionBasedResources.includes(resource)) {
      // For action-based resources: /resource/action
      action = urlParts[1];
      id = undefined;
    } else {
      // For ID-based resources: /resource/id/action
      id = urlParts[1];
      action = urlParts[2];
    }

    console.log(`[Mock API] URL parsing: url="${url}", resource="${resource}", id="${id}", action="${action}"`);

    // Extract query parameters
    const queryParams = config?.params || {};

    try {
      let response;

      // Route to the appropriate mock handler
      switch (resource) {
        case 'users':
          if (id && action === 'status') {
            // This is a status endpoint, but it's a GET request which shouldn't happen
            response = { error: 'Status endpoint requires PUT method' };
          } else if (id) {
            response = await handlers.users.getById(id);
          } else {
            response = await handlers.users.getAll(queryParams);
          }
          break;

        case 'suppliers':
          if (id && action === 'products') {
            response = await handlers.suppliers.getProducts?.(id, queryParams) || { error: 'Not implemented' };
          } else if (id && action === 'documents') {
            response = await handlers.suppliers.getDocuments?.(id, queryParams) || { error: 'Not implemented' };
          } else if (id && action === 'analytics') {
            response = await handlers.suppliers.getAnalytics?.(id, queryParams) || { error: 'Not implemented' };
          } else if (id) {
            response = await handlers.suppliers.getById?.(id) || { error: 'Not implemented' };
          } else {
            response = await handlers.suppliers.getAll(queryParams);
          }
          break;

        case 'products':
          if (id && action === 'upload-images') {
            response = await handlers.products.uploadImages?.(id, []) || { error: 'Not implemented' };
          } else if (id) {
            response = await handlers.products.getById?.(id) || { error: 'Not implemented' };
          } else {
            response = { error: 'Products list not implemented' };
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

        case 'verifications':
          if (id) {
            response = await handlers.verifications?.getById?.(id) || { error: 'Not implemented' };
          } else {
            response = await handlers.verifications?.getAll?.(queryParams) || { error: 'Not implemented' };
          }
          break;

        case 'dashboard':
          if (action === 'stats') {
            response = await handlers.dashboard.getStats();
          } else if (action === 'sales') {
            response = await handlers.dashboard.getSalesData(queryParams.period || 'month');
          } else if (action === 'user-growth') {
            response = await handlers.dashboard.getUserGrowth(queryParams.period || 'month');
          } else if (action === 'category-distribution') {
            response = await handlers.dashboard.getCategoryDistribution();
          } else if (!action) {
            // Default to stats if no action specified
            response = await handlers.dashboard.getStats();
          } else {
            response = { error: `Unknown dashboard action: ${action}` };
          }
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

        case 'profile':
          if (action === 'activity') {
            // GET /profile/activity - get activity log
            response = await handlers.profile.getActivityLog(queryParams);
          } else if (action === 'preferences') {
            // GET /profile/preferences - get preferences
            response = await handlers.profile.getPreferences();
          } else if (!action) {
            // GET /profile - get current user's profile
            response = await handlers.profile.getProfile();
          } else {
            response = { error: `Unknown profile action: ${action}` };
          }
          break;

        case 'business-types':
          if (id) {
            response = await handlers.businessTypes.getById(id);
          } else {
            response = await handlers.businessTypes.getAll();
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
    const action = urlParts[1];

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
            if (action === 'upload-image') {
              response = await handlers.users.uploadImage(data.image);
            } else {
              response = await handlers.users.create(data);
            }
            break;

          case 'suppliers':
            // Special case: suppliers use ID-based routes even for POST upload-image
            // POST /suppliers/ID/upload-image
            if (urlParts[2] === 'upload-image') {
              const supplierId = urlParts[1];
              if (supplierId) {
                response = await handlers.suppliers.uploadImage?.(supplierId, data.image) || { error: 'Not implemented' };
              } else {
                response = { error: 'Missing supplier ID for image upload' };
              }
            } else {
              response = await handlers.suppliers.create?.(data) || { error: 'Not implemented' };
            }
            break;

          case 'categories':
            response = await handlers.categories.create?.(data) || { error: 'Not implemented' };
            break;

          case 'orders':
            response = await handlers.orders.create?.(data) || { error: 'Not implemented' };
            break;

          case 'verifications':
            response = await handlers.verifications?.create?.(data) || { error: 'Not implemented' };
            break;

          case 'profile':
            if (url === '/profile/upload-image' || url === '/profile/picture') {
              response = await handlers.profile.updateProfilePicture(data);
            } else {
              response = { error: 'Unknown profile POST action' };
            }
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
    const resource = urlParts[0] || '';

    // Use the same improved URL parsing logic as GET
    let id: string | undefined;
    let action: string | undefined;

    const actionBasedResources = ['dashboard', 'auth', 'profile'];

    if (actionBasedResources.includes(resource)) {
      action = urlParts[1];
      id = undefined;
    } else {
      id = urlParts[1];
      action = urlParts[2];
    }

    try {
      let response;

      switch (resource) {
        case 'users':
          if (id && action === 'status') {
            response = await handlers.users.toggleStatus(id, data.status);
          } else if (id) {
            response = await handlers.users.update(id, data);
          } else {
            response = { error: 'Missing ID for update' };
          }
          break;

        case 'suppliers':
          if (id && action === 'verification') {
            response = await handlers.suppliers.updateVerification?.(id, data) || { error: 'Not implemented' };
          } else if (id && action === 'documents') {
            const documentId = urlParts[3]; // suppliers/ID/documents/DOC_ID
            if (documentId) {
              response = { error: 'Document update not supported' };
            } else {
              response = { error: 'Missing document ID for update' };
            }
          } else if (id && action === 'ban') {
            response = await handlers.suppliers.ban?.(id) || { error: 'Not implemented' };
          } else if (id && action === 'unban') {
            response = await handlers.suppliers.unban?.(id) || { error: 'Not implemented' };
          } else if (id) {
            response = await handlers.suppliers.update?.(id, data) || { error: 'Not implemented' };
          } else {
            response = { error: 'Missing ID for update' };
          }
          break;

        case 'products':
          if (id) {
            response = await handlers.products.update?.(id, data) || { error: 'Not implemented' };
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

        case 'verifications':
          if (id && action === 'approve') {
            response = await handlers.verifications?.approve?.(id, data.notes) || { error: 'Not implemented' };
          } else if (id && action === 'reject') {
            response = await handlers.verifications?.reject?.(id, data.notes) || { error: 'Not implemented' };
          } else if (id && action === 'status') {
            response = await handlers.verifications?.updateStatus?.(id, data.status) || { error: 'Not implemented' };
          } else if (id) {
            response = await handlers.verifications?.update?.(id, data) || { error: 'Not implemented' };
          } else {
            response = { error: 'Missing ID for update' };
          }
          break;

        case 'profile':
          if (action === 'password') {
            response = await handlers.profile.changePassword(data);
          } else if (action === 'picture') {
            response = await handlers.profile.updateProfilePicture(data);
          } else if (action === 'preferences') {
            response = await handlers.profile.updatePreferences(data);
          } else if (!action) {
            // PUT /profile - update current user's profile
            response = await handlers.profile.updateProfile(data);
          } else {
            response = { error: `Unknown profile update action: ${action}` };
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
    const resource = urlParts[0] || '';

    // Use the same improved URL parsing logic
    let id: string | undefined;
    let action: string | undefined;

    const actionBasedResources = ['dashboard', 'auth', 'profile'];

    if (actionBasedResources.includes(resource)) {
      action = urlParts[1];
      id = undefined;
    } else {
      id = urlParts[1];
      action = urlParts[2];
    }

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

        case 'verifications':
          if (id) {
            response = { success: true }; // Verifications don't have delete in handlers yet
          } else {
            response = { error: 'Missing ID for delete' };
          }
          break;

        case 'profile':
          if (action === 'picture') {
            response = await handlers.profile.deleteProfilePicture();
          } else {
            response = { error: `Unknown profile delete action: ${action}` };
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




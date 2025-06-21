/**
 * Categories API Service
 * 
 * This file provides methods for interacting with the categories API endpoints.
 */

import apiClient from '../../../api';
import { handleApiError } from '../../../utils/errorHandling';
import { responseValidators } from '../../../utils/apiHelpers';
import { requestDeduplicator } from '../../../utils/requestDeduplication';
import { ENDPOINTS } from '../../../constants/endpoints';
import type { Category, CategoryFormData } from '../types';

export const categoriesApi = {
  /**
   * Get all categories
   */
  getCategories: async (params?: Record<string, any>, clearCache = false): Promise<Category[]> => {
    try {
      // Clear cache if requested to ensure fresh data
      if (clearCache) {
        apiClient.clearCache();
      }

      const response = await apiClient.get<any>('/categories', { params });

      // Handle the backend response structure: { success, message, data: [...], pagination }
      // The API client wraps this in: { data: backendResponse, error, status, metadata }
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        // Extract the actual categories array from the nested structure
        const categoriesArray = response.data.data;
        if (Array.isArray(categoriesArray)) {
          return categoriesArray;
        }
      }

      // Fallback to original validation for backward compatibility
      return responseValidators.getList(response, 'categories');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get a category by ID
   */
  getCategoryById: async (id: string): Promise<Category> => {
    const key = requestDeduplicator.generateApiKey(`/categories/${id}`, 'GET');
    return requestDeduplicator.execute(key, async () => {
      try {
        const response = await apiClient.get<any>(`/categories/${id}`);

        // Handle the backend response structure: { success, message, data: {...} }
        // The API client wraps this in: { data: backendResponse, error, status, metadata }
        if (response.data && typeof response.data === 'object' && 'data' in response.data) {
          // Extract the actual category object from the nested structure
          return response.data.data;
        }

        // Fallback to original validation for backward compatibility
        return responseValidators.getById(response, 'category', id);
      } catch (error) {
        throw handleApiError(error);
      }
    });
  },

  /**
   * Create a new category
   */
  createCategory: async (categoryData: CategoryFormData): Promise<Category> => {
    try {
      const response = await apiClient.post<any>('/categories', categoryData);

      // Handle the backend response structure: { success, message, data: {...} }
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        return response.data.data;
      }

      // Fallback to original validation for backward compatibility
      return responseValidators.create(response, 'category');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update a category
   */
  updateCategory: async (id: string, categoryData: Partial<CategoryFormData>): Promise<Category> => {
    try {
      const response = await apiClient.put<any>(`/categories/${id}`, categoryData);

      // Handle the backend response structure: { success, message, data: {...} }
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        return response.data.data;
      }

      // Fallback to original validation for backward compatibility
      return responseValidators.update(response, 'category', id);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete a category
   */
  deleteCategory: async (id: string): Promise<void> => {
    try {
      const response = await apiClient.delete(`/categories/${id}`);
      return responseValidators.delete(response, 'category', id);
    } catch (error) {
      throw handleApiError(error);
    }
  },



  /**
   * Get products for a category
   */
  getCategoryProducts: async (categoryId: string): Promise<any[]> => {
    try {
      const response = await apiClient.get<any>(ENDPOINTS.CATEGORIES.PRODUCTS(categoryId));

      // Handle the backend response structure: { success, message, data: [...], pagination }
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        const productsArray = response.data.data;
        if (Array.isArray(productsArray)) {
          return productsArray;
        }
      }

      // Fallback to original validation for backward compatibility
      return responseValidators.getList(response, 'products', true);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update category status (ban/unban)
   */
  updateCategoryStatus: async (id: string, status: 'active' | 'inactive'): Promise<Category> => {
    try {
      const response = await apiClient.put<any>(ENDPOINTS.CATEGORIES.STATUS(id), { status });

      // Handle the backend response structure: { success, message, data: {...} }
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        return response.data.data;
      }

      // Fallback to original validation for backward compatibility
      return responseValidators.update(response, 'category', id);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Clear categories cache
   */
  clearCache: () => {
    apiClient.clearCache();
  }
};

export default categoriesApi;

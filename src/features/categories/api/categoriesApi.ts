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
import type { Category, CategoryFormData, CategoryImageUploadData } from '../types';

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

      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        // Extract the actual categories array from the nested structure
        const categoriesArray = response.data.data;
        if (Array.isArray(categoriesArray)) {
          return categoriesArray;
        }
      }

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
      // Use FormData to handle file upload with multer middleware
      const formData = new FormData();
      formData.append('name', categoryData.name.trim());
      formData.append('description', categoryData.description.trim());
      formData.append('status', categoryData.status);

      // Include image file if provided
      if (categoryData.image) {
        formData.append('image', categoryData.image);
      }

      const response = await apiClient.post<any>('/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

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
   * Update a category with atomic operation support
   * Supports both text-only updates and multipart updates with image
   */
  updateCategory: async (id: string, categoryData: Partial<CategoryFormData>): Promise<Category> => {
    try {
      let response;

      // Check if image file is provided to determine request format
      if (categoryData.image instanceof File) {
        // Use FormData for multipart request when image is included
        const formData = new FormData();

        // Add text fields if provided
        if (categoryData.name !== undefined) {
          formData.append('name', categoryData.name.trim());
        }
        if (categoryData.description !== undefined) {
          formData.append('description', categoryData.description.trim());
        }
        if (categoryData.status !== undefined) {
          formData.append('status', categoryData.status);
        }

        // Add image file
        formData.append('image', categoryData.image);

        response = await apiClient.put<any>(`/categories/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Use JSON for text-only updates
        const { image, ...textData } = categoryData;
        response = await apiClient.put<any>(`/categories/${id}`, textData);
      }

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
   * Update category status (ban/unban)
   */
  updateCategoryStatus: async (id: string, status: 'active' | 'inactive'): Promise<Category> => {
    try {
      const response = await apiClient.put<any>(ENDPOINTS.CATEGORIES.STATUS(id), { status });

      // Handle the backend response structure: { success, message, data: {category: {...}, updatedProductsCount: number} }
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        // For status update, the category is nested under data.category
        if (response.data.data && typeof response.data.data === 'object' && 'category' in response.data.data) {
          return response.data.data.category;
        }
        // Fallback to direct data access for backward compatibility
        return response.data.data;
      }

      // Fallback to original validation for backward compatibility
      return responseValidators.update(response, 'category', id);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Upload category image
   * @deprecated Use updateCategory with image file instead for atomic operations
   * @param categoryId - The category ID
   * @param file - The image file to upload
   * @returns Promise resolving to upload response
   */
  uploadCategoryImage: async (categoryId: string, file: File): Promise<CategoryImageUploadData> => {
    try {
      if (!categoryId) {
        throw new Error('Category ID is required');
      }

      if (!file) {
        throw new Error('Image file is required');
      }

      const formData = new FormData();
      formData.append('image', file);

      const response = await apiClient.post(ENDPOINTS.CATEGORIES.UPLOAD_IMAGE(categoryId), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle the backend response structure: { success, message, data: {...} }
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        return response.data.data as CategoryImageUploadData;
      }

      // Fallback to original validation for backward compatibility
      if (!response.data) {
        throw new Error('No response data received');
      }

      return response.data as CategoryImageUploadData;
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

/**
 * Categories API Service
 * 
 * This file provides methods for interacting with the categories API endpoints.
 */

import apiClient from '../../../api';
import { handleApiError } from '../../../utils/errorHandling';
import { responseValidators } from '../../../utils/apiHelpers';
import type { Category, CategoryFormData } from '../types';

export const categoriesApi = {
  /**
   * Get all categories
   */
  getCategories: async (params?: Record<string, any>): Promise<Category[]> => {
    try {
      const response = await apiClient.get<Category[]>('/categories', { params });
      return responseValidators.getList(response, 'categories');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get a category by ID
   */
  getCategoryById: async (id: string): Promise<Category> => {
    try {
      const response = await apiClient.get<Category>(`/categories/${id}`);
      return responseValidators.getById(response, 'category', id);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create a new category
   */
  createCategory: async (categoryData: CategoryFormData): Promise<Category> => {
    try {
      const response = await apiClient.post<Category>('/categories', categoryData);
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
      const response = await apiClient.put<Category>(`/categories/${id}`, categoryData);
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
   * Get subcategories for a parent category
   */
  getSubcategories: async (parentId: string): Promise<Category[]> => {
    try {
      const response = await apiClient.get<Category[]>('/categories', { params: { parentId } });
      return responseValidators.getList(response, 'subcategories', true);
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

export default categoriesApi;

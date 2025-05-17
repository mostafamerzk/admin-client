/**
 * Categories API Service
 * 
 * This file provides methods for interacting with the categories API endpoints.
 */

import api from '../../../services/api.ts';
import { Category, CategoryFormData } from '../types/index.ts';

export const categoriesApi = {
  /**
   * Get all categories
   */
  getCategories: async (params?: Record<string, any>): Promise<Category[]> => {
    try {
      const response = await api.get('/categories', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  /**
   * Get a category by ID
   */
  getCategoryById: async (id: string): Promise<Category> => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new category
   */
  createCategory: async (categoryData: CategoryFormData): Promise<Category> => {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  /**
   * Update a category
   */
  updateCategory: async (id: string, categoryData: Partial<CategoryFormData>): Promise<Category> => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a category
   */
  deleteCategory: async (id: string): Promise<void> => {
    try {
      await api.delete(`/categories/${id}`);
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get subcategories for a category
   */
  getSubcategories: async (parentId: string): Promise<Category[]> => {
    try {
      const response = await api.get('/categories', { params: { parentId } });
      return response.data;
    } catch (error) {
      console.error(`Error fetching subcategories for ${parentId}:`, error);
      throw error;
    }
  }
};

export default categoriesApi;

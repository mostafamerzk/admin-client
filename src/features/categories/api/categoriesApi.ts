/**
 * Categories API Service
 * 
 * This file provides methods for interacting with the categories API endpoints.
 */

import apiClient from '../../../api';
import type { Category, CategoryFormData } from '../types';

export const categoriesApi = {
  /**
   * Get all categories
   */
  getCategories: async (params?: Record<string, any>): Promise<Category[]> => {
    try {
      const response = await apiClient.get<Category[]>('/categories', { params });
      if (!response.data) {
        throw new Error('No categories data received');
      }
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
      const response = await apiClient.get<Category>(`/categories/${id}`);
      if (!response.data) {
        throw new Error(`No category data received for ID: ${id}`);
      }
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
      const response = await apiClient.post<Category>('/categories', categoryData);
      if (!response.data) {
        throw new Error('Failed to create category');
      }
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
      const response = await apiClient.put<Category>(`/categories/${id}`, categoryData);
      if (!response.data) {
        throw new Error(`Failed to update category ${id}`);
      }
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
      await apiClient.delete(`/categories/${id}`);
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get subcategories for a parent category
   */
  getSubcategories: async (parentId: string): Promise<Category[]> => {
    try {
      const response = await apiClient.get<Category[]>('/categories', { params: { parentId } });
      if (!response.data) {
        throw new Error(`No subcategories found for parent ID: ${parentId}`);
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching subcategories for parent ${parentId}:`, error);
      throw error;
    }
  }
};

export default categoriesApi;

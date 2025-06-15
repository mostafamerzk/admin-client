/**
 * Users API Service
 *
 * This file provides methods for interacting with the users API endpoints.
 */

import apiClient from '../../../api';
import { handleApiError } from '../../../utils/errorHandling';
import { responseValidators } from '../../../utils/apiHelpers';
import type { User, UserFormData } from '../types';

/**
 * Users API service with methods for managing user data
 */
export const usersApi = {
  /**
   * Get all users with optional filtering
   * @param params - Optional query parameters for filtering users
   * @returns Promise resolving to an array of users
   */
  getUsers: async (params?: Record<string, any>): Promise<User[]> => {
    try {
      const response = await apiClient.get<User[]>('/users', { params });
      return responseValidators.getList(response, 'users');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get a user by their ID
   * @param id - The user's unique identifier
   * @returns Promise resolving to a single user
   */
  getUserById: async (id: string): Promise<User> => {
    try {
      const response = await apiClient.get<User>(`/users/${id}`);
      return responseValidators.getById(response, 'user', id);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create a new user
   * @param userData - The user data to create
   * @returns Promise resolving to the created user
   */
  createUser: async (userData: UserFormData): Promise<User> => {
    try {
      const response = await apiClient.post<User>('/users', userData);
      return responseValidators.create(response, 'user');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update an existing user
   * @param id - The user's unique identifier
   * @param userData - The user data to update
   * @returns Promise resolving to the updated user
   */
  updateUser: async (id: string, userData: UserFormData): Promise<User> => {
    try {
      const response = await apiClient.put<User>(`/users/${id}`, userData);
      return responseValidators.update(response, 'user', id);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete a user
   * @param id - The user's unique identifier
   * @returns Promise resolving to a success indicator
   */
  deleteUser: async (id: string): Promise<void> => {
    try {
      const response = await apiClient.delete(`/users/${id}`);
      return responseValidators.delete(response, 'user', id);
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Toggle a user's status between active and banned
   * @param id - The user's unique identifier
   * @param status - The new status to set
   * @returns Promise resolving to the updated user
   */
  toggleUserStatus: async (id: string, status: 'active' | 'banned'): Promise<User> => {
    try {
      const response = await apiClient.put<User>(`/users/${id}/status`, { status });
      return responseValidators.update(response, 'user', id);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Search for users by name or email
   * @param query - The search query string
   * @returns Promise resolving to an array of matching users
   */
  searchUsers: async (query: string): Promise<User[]> => {
    try {
      const response = await apiClient.get<User[]>('/users', {
        params: { search: query }
      });
      return responseValidators.getList(response, 'users', true);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get users filtered by type
   * @param type - The user type to filter by
   * @returns Promise resolving to an array of users of the specified type
   */
  getUsersByType: async (type: 'customer' | 'supplier' | 'admin'): Promise<User[]> => {
    try {
      const response = await apiClient.get<User[]>('/users', {
        params: { type }
      });
      return responseValidators.getList(response, 'users', true);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Upload user image
   * @param file - The image file to upload
   * @returns Promise resolving to the uploaded image URL
   */
  uploadUserImage: async (file: File): Promise<{ imageUrl: string }> => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await apiClient.post<{ imageUrl: string }>('/users/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return responseValidators.create(response, 'user image');
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

// Export individual methods for more flexible importing
export const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  searchUsers,
  getUsersByType,
  uploadUserImage
} = usersApi;

export default usersApi;



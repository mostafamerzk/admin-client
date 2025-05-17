/**
 * Users API Service
 * 
 * This file provides methods for interacting with the users API endpoints.
 */

import api from '../../../services/api.ts';
import { User, UserFormData } from '../types/index.ts';

export const usersApi = {
  /**
   * Get all users
   */
  getUsers: async (params?: Record<string, any>): Promise<User[]> => {
    try {
      const response = await api.get('/users', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  /**
   * Get a user by ID
   */
  getUserById: async (id: string): Promise<User> => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new user
   */
  createUser: async (userData: UserFormData): Promise<User> => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  /**
   * Update a user
   */
  updateUser: async (id: string, userData: Partial<UserFormData>): Promise<User> => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a user
   */
  deleteUser: async (id: string): Promise<void> => {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  },

  /**
   * Toggle user status (active/banned)
   */
  toggleUserStatus: async (id: string, status: 'active' | 'banned'): Promise<User> => {
    try {
      const response = await api.put(`/users/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error toggling user status ${id}:`, error);
      throw error;
    }
  }
};

export default usersApi;

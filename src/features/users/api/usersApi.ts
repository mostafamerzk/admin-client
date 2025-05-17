/**
 * Users API Service
 * 
 * This file provides methods for interacting with the users API endpoints.
 */

import apiClient from '../../../api';
import type { User, UserFormData } from '../types';

export const usersApi = {
  /**
   * Get all users
   */
  getUsers: async (params?: Record<string, any>): Promise<User[]> => {
    try {
      const response = await apiClient.get<User[]>('/users', { params });
      if (!response.data) {
        throw new Error('No users data received');
      }
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
      const response = await apiClient.get<User>(`/users/${id}`);
      if (!response.data) {
        throw new Error(`No user data received for ID: ${id}`);
      }
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
      const response = await apiClient.post<User>('/users', userData);
      if (!response.data) {
        throw new Error('Failed to create user');
      }
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
      const response = await apiClient.put<User>(`/users/${id}`, userData);
      if (!response.data) {
        throw new Error(`Failed to update user ${id}`);
      }
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
      await apiClient.delete(`/users/${id}`);
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
      const response = await apiClient.put<User>(`/users/${id}/status`, { status });
      if (!response.data) {
        throw new Error(`Failed to toggle status for user ${id}`);
      }
      return response.data;
    } catch (error) {
      console.error(`Error toggling user status ${id}:`, error);
      throw error;
    }
  }
};

export default usersApi;

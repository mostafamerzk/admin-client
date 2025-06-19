// src/features/users/hooks/useUsers.ts
/**
 * Users Hook
 * 
 * This hook provides methods and state for working with users.
 */

import { useCallback, useRef, useEffect } from 'react';
import { useEntityData } from '../../../hooks/useEntityData';
import usersApi from '../api/usersApi';
import type { User, UserFormDataFrontend, UserQueryParams } from '../types';
import useNotification from '../../../hooks/useNotification';
import apiClient from '../../../api';

export const useUsers = (options = { initialFetch: true }) => {
  // Clear any cached users data on hook initialization
  useEffect(() => {
    // Clear cache for users endpoint
    apiClient.clearCache();
  }, []);

  // Create an adapter that maps usersApi methods to what useEntityData expects
  // Note: We need to adapt the new paginated response format
  const apiAdapter = {
    getAll: async () => {
      const response = await usersApi.getUsers();
      return response.data; // Extract just the data array for useEntityData
    },
    getById: usersApi.getUserById,
    create: usersApi.createUser,
    update: usersApi.updateUser,
    delete: usersApi.deleteUser
  };

  const baseHook = useEntityData<User>(apiAdapter, {
    entityName: 'users',
    initialFetch: options.initialFetch
  });

  const { showNotification } = useNotification();

  // Use ref to avoid dependency issues
  const showNotificationRef = useRef(showNotification);

  // Update ref when showNotification changes
  useEffect(() => {
    showNotificationRef.current = showNotification;
  });
  
  // User-specific methods
  const updateUserStatus = useCallback(async (id: string, status: 'active' | 'banned') => {
    try {
      await usersApi.updateUserStatus(id, status);

      // Update the local state immediately using setEntities
      const currentEntities = baseHook.entities as User[];
      const updatedEntities = currentEntities.map(user =>
        user.id === id ? { ...user, status } : user
      );

      // Use the exposed setEntities function to update the state
      baseHook.setEntities(updatedEntities);

      showNotificationRef.current({
        type: 'success',
        title: 'Success',
        message: `User ${status === 'active' ? 'activated' : 'banned'} successfully`
      });
    } catch (error) {
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: `Failed to ${status === 'active' ? 'activate' : 'ban'} user`
      });
      throw error;
    }
  }, [baseHook]);
  
  // Add updateUser method
  const updateUser = useCallback(async (id: string, userData: UserFormDataFrontend) => {
    try {
      const updatedUser = await usersApi.updateUser(id, userData);

      // Update the local state using setEntities
      const currentEntities = baseHook.entities as User[];
      const updatedEntities = currentEntities.map(user =>
        user.id === id ? updatedUser : user
      );

      // Use the exposed setEntities function to update the state
      baseHook.setEntities(updatedEntities);

      showNotificationRef.current({
        type: 'success',
        title: 'Success',
        message: 'User updated successfully'
      });

      return updatedUser;
    } catch (error) {
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to update user'
      });
      throw error;
    }
  }, [baseHook]);

  // Add search method with pagination support
  const searchUsers = useCallback(async (query: string, params?: Omit<UserQueryParams, 'search'>) => {
    try {
      return await usersApi.searchUsers(query, params);
    } catch (error) {
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to search users'
      });
      throw error;
    }
  }, []);

  // Add method to get users with pagination
  const getUsersWithPagination = useCallback(async (params?: UserQueryParams) => {
    try {
      return await usersApi.getUsers(params);
    } catch (error) {
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch users'
      });
      throw error;
    }
  }, []);
  
  return {
    ...baseHook,
    users: baseHook.entities as User[], // Rename for clarity
    fetchUsers: baseHook.fetchEntities, // Rename for clarity
    getUserById: baseHook.getEntityById, // Rename for clarity
    createEntity: baseHook.createEntity, // Expose create method
    deleteEntity: baseHook.deleteEntity, // Expose delete method
    updateUserStatus, // Updated method name
    updateUser, // Add the new method to the return object
    searchUsers, // Add search method
    getUsersWithPagination // Add pagination method
  };
};

export default useUsers;
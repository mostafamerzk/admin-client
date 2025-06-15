// src/features/users/hooks/useUsers.ts
/**
 * Users Hook
 * 
 * This hook provides methods and state for working with users.
 */

import { useCallback, useRef, useEffect } from 'react';
import { useEntityData } from '../../../hooks/useEntityData';
import usersApi from '../api/usersApi';
import type { User, UserFormData } from '../types';
import useNotification from '../../../hooks/useNotification';

export const useUsers = (options = { initialFetch: true }) => {
  // Create an adapter that maps usersApi methods to what useEntityData expects
  const apiAdapter = {
    getAll: usersApi.getUsers,
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
  const toggleUserStatus = useCallback(async (id: string, status: 'active' | 'banned') => {
    try {
      const updatedUser = await usersApi.toggleUserStatus(id, status);

      // Update the local state immediately using setEntities
      const currentEntities = baseHook.entities as User[];
      const updatedEntities = currentEntities.map(user =>
        user.id === id ? updatedUser : user
      );

      // Use the exposed setEntities function to update the state
      baseHook.setEntities(updatedEntities);

      showNotificationRef.current({
        type: 'success',
        title: 'Success',
        message: `User ${status === 'active' ? 'activated' : 'banned'} successfully`
      });

      return updatedUser;
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
  const updateUser = useCallback(async (id: string, userData: UserFormData) => {
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
  
  return {
    ...baseHook,
    users: baseHook.entities as User[], // Rename for clarity
    fetchUsers: baseHook.fetchEntities, // Rename for clarity
    getUserById: baseHook.getEntityById, // Rename for clarity
    createEntity: baseHook.createEntity, // Expose create method
    deleteEntity: baseHook.deleteEntity, // Expose delete method
    toggleUserStatus,
    updateUser // Add the new method to the return object
  };
};

export default useUsers;
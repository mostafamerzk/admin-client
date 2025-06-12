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
      // Update the local state if the user exists in the current list
      baseHook.entities.forEach((user, index) => {
        if ((user as User).id === id) {
          const updatedEntities = [...baseHook.entities];
          updatedEntities[index] = updatedUser;
          // Use the setEntities method from baseHook if exposed, or implement a custom solution
        }
      });

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
  }, [baseHook.entities]);
  
  // Add updateUser method
  const updateUser = useCallback(async (id: string, userData: UserFormData) => {
    try {
      const updatedUser = await usersApi.updateUser(id, userData);

      // Update the local state if the user exists in the current list
      const updatedEntities = [...baseHook.entities];
      const userIndex = updatedEntities.findIndex((user) => (user as User).id === id);

      if (userIndex !== -1) {
        updatedEntities[userIndex] = updatedUser;
        // If baseHook exposes a setEntities method, use it here
      }

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
  }, [baseHook.entities]);
  
  return {
    ...baseHook,
    users: baseHook.entities as User[], // Rename for clarity
    fetchUsers: baseHook.fetchEntities, // Rename for clarity
    getUserById: baseHook.getEntityById, // Rename for clarity
    toggleUserStatus,
    updateUser // Add the new method to the return object
  };
};

export default useUsers;
/**
 * Users Hook
 * 
 * This hook provides methods and state for working with users.
 */

import { useState, useCallback, useEffect } from 'react';
import type { User, UserFormData } from '../types/index.ts';
import usersApi from '../api/usersApi.ts';
import useNotification from '../../../hooks/useNotification.ts';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showNotification } = useNotification();

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await usersApi.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch users'
      });
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Create a new user
  const createUser = useCallback(async (userData: UserFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newUser = await usersApi.createUser(userData);
      setUsers(prevUsers => [...prevUsers, newUser]);
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'User created successfully'
      });
      return newUser;
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to create user'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Update a user
  const updateUser = useCallback(async (id: string, userData: Partial<UserFormData>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedUser = await usersApi.updateUser(id, userData);
      setUsers(prevUsers => 
        prevUsers.map(user => user.id === id ? updatedUser : user)
      );
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'User updated successfully'
      });
      return updatedUser;
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update user'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Delete a user
  const deleteUser = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await usersApi.deleteUser(id);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'User deleted successfully'
      });
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete user'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Toggle user status
  const toggleUserStatus = useCallback(async (id: string, status: 'active' | 'banned') => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedUser = await usersApi.toggleUserStatus(id, status);
      setUsers(prevUsers => 
        prevUsers.map(user => user.id === id ? updatedUser : user)
      );
      showNotification({
        type: 'success',
        title: 'Success',
        message: `User ${status === 'active' ? 'activated' : 'banned'} successfully`
      });
      return updatedUser;
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: `Failed to ${status === 'active' ? 'activate' : 'ban'} user`
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Load users on mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus
  };
};

export default useUsers;

/**
 * User Mappers
 * 
 * Utility functions to map between different user data formats
 */

import type{ User } from '../types/index';
import { users as mockUsers } from '../../../mockData/entities/users';

/**
 * Maps a mock user to the application user format
 */
export const mapMockUserToUser = (mockUser: any): User => {
  // Filter out admin users as they're not part of the regular user interface
  if (mockUser.type === 'admin') {
    return null as unknown as User;
  }
  
  const result: User = {
    id: mockUser.id,
    name: mockUser.name,
    email: mockUser.email,
    type: mockUser.type as 'customer' | 'supplier',
    status: mockUser.status === 'pending' ? 'active' : mockUser.status // Map 'pending' to 'active' for compatibility
  };

  if (mockUser.lastLogin) {
    result.lastLogin = new Date(mockUser.lastLogin).toISOString().split('T')[0]!;
  }
  if (mockUser.avatar) {
    result.avatar = mockUser.avatar;
  }

  return result;
};

/**
 * Get all users from mock data
 */
export const getMockUsers = (): User[] => {
  return mockUsers
    .map(mapMockUserToUser)
    .filter(user => user !== null); // Filter out null values (admin users)
};

/**
 * Get a user by ID from mock data
 */
export const getMockUserById = (id: string): User | undefined => {
  const mockUser = mockUsers.find(u => u.id === id);
  if (!mockUser || mockUser.type === 'admin') return undefined;
  return mapMockUserToUser(mockUser);
};

export default {
  mapMockUserToUser,
  getMockUsers,
  getMockUserById
};

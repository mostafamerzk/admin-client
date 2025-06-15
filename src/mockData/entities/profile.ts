/**
 * Mock Profile Data
 * 
 * This file contains mock data for user profiles used in development and testing.
 */

import type { UserProfile, ActivityLogItem } from '../../features/profile/types';

// Mock profile data for the current user
export const mockProfile: UserProfile = {
  id: '1',
  name: 'Admin User',
  email: 'admin@connectchain.com',
  phone: '+1 (555) 123-4567',
  role: 'Administrator',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  joinDate: '2023-10-15',
  twoFactorEnabled: true,
  notificationsEnabled: {
    email: true,
    push: false,
    sms: true
  },
  adminNotifications: {
    newUsers: true,
    newOrders: true,
    supplierVerifications: false
  },
  preferences: {
    theme: 'light',
    language: 'en',
    timezone: 'America/New_York'
  },
  lastLogin: '2024-01-20 14:30:25',
  lastIp: '192.168.1.1'
};

// Mock activity log data
export const mockActivityLog: ActivityLogItem[] = [
  {
    id: 1,
    content: 'Logged in from Chrome on Windows',
    date: '2024-01-20 14:30:25',
    type: 'login'
  },
  {
    id: 2,
    content: 'Updated profile information',
    date: '2024-01-19 09:15:30',
    type: 'profile'
  },
  {
    id: 3,
    content: 'Changed password',
    date: '2024-01-18 16:45:12',
    type: 'password'
  },
  {
    id: 4,
    content: 'Enabled two-factor authentication',
    date: '2024-01-17 11:20:45',
    type: 'security'
  },
  {
    id: 5,
    content: 'Updated notification preferences',
    date: '2024-01-16 13:55:18',
    type: 'notifications'
  },
  {
    id: 6,
    content: 'Logged in from Safari on macOS',
    date: '2024-01-15 08:30:22',
    type: 'login'
  },
  {
    id: 7,
    content: 'Account created',
    date: '2023-10-15 10:00:00',
    type: 'account'
  }
];

// Helper function to generate avatar URL
export const generateAvatarUrl = (name: string): string => {
  const encodedName = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${encodedName}&background=3b82f6&color=fff&size=128`;
};

// Helper function to update profile with new data
export const updateProfileData = (updates: Partial<UserProfile>): UserProfile => {
  return {
    ...mockProfile,
    ...updates
  };
};

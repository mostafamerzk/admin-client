/**
 * Profile API Service
 * 
 * This file provides methods for interacting with the profile API endpoints.
 */

import api from '../../../services/api.ts';
import { Profile, ProfileUpdateData, PasswordChangeData } from '../types/index.ts';

export const profileApi = {
  /**
   * Get the current user's profile
   */
  getProfile: async (): Promise<Profile> => {
    try {
      const response = await api.get('/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  /**
   * Update the current user's profile
   */
  updateProfile: async (profileData: ProfileUpdateData): Promise<Profile> => {
    try {
      const response = await api.put('/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  /**
   * Update the current user's avatar
   */
  updateAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post('/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating avatar:', error);
      throw error;
    }
  },

  /**
   * Change the current user's password
   */
  changePassword: async (passwordData: PasswordChangeData): Promise<{ success: boolean }> => {
    try {
      const response = await api.post('/profile/change-password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },

  /**
   * Update profile preferences
   */
  updatePreferences: async (preferences: Profile['preferences']): Promise<Profile['preferences']> => {
    try {
      const response = await api.put('/profile/preferences', preferences);
      return response.data;
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  },

  /**
   * Get activity log for the current user
   */
  getActivityLog: async (params?: { page?: number; limit?: number }): Promise<any> => {
    try {
      const response = await api.get('/profile/activity', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching activity log:', error);
      throw error;
    }
  }
};

export default profileApi;

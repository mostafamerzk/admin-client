/**
 * Profile API Service
 * 
 * This file provides methods for interacting with the profile API endpoints.
 */

import apiClient from '../../../api';
import type { UserProfile, ProfileUpdateRequest, PasswordChangeRequest, ActivityLogItem } from '../types';

export const profileApi = {
  /**
   * Get user profile
   */
  getProfile: async (): Promise<UserProfile> => {
    try {
      const response = await apiClient.get<UserProfile>('/profile');
      if (!response.data) {
        throw new Error('No profile data received');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (profileData: ProfileUpdateRequest): Promise<UserProfile> => {
    try {
      const response = await apiClient.put<UserProfile>('/profile', profileData);
      if (!response.data) {
        throw new Error('Failed to update profile');
      }
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  /**
   * Update profile picture
   */
  updateProfilePicture: async (file: File): Promise<UserProfile> => {
    try {
      const formData = new FormData();
      formData.append('picture', file);

      const response = await apiClient.put<UserProfile>('/profile/picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (!response.data) {
        throw new Error('Failed to update profile picture');
      }
      return response.data;
    } catch (error) {
      console.error('Error updating profile picture:', error);
      throw error;
    }
  },

  /**
   * Change password
   */
  changePassword: async (passwordData: PasswordChangeRequest): Promise<{ success: boolean }> => {
    try {
      await apiClient.put('/profile/password', passwordData);
      return { success: true };
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },

  /**
   * Delete profile picture
   */
  deleteProfilePicture: async (): Promise<UserProfile> => {
    try {
      const response = await apiClient.delete<UserProfile>('/profile/picture');
      if (!response.data) {
        throw new Error('Failed to delete profile picture');
      }
      return response.data;
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      throw error;
    }
  },

  /**
   * Update avatar (alias for updateProfilePicture)
   */
  updateAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    try {
      const profile = await profileApi.updateProfilePicture(file);
      return { avatarUrl: profile.avatar || '' };
    } catch (error) {
      console.error('Error updating avatar:', error);
      throw error;
    }
  },

  /**
   * Update profile preferences
   */
  updatePreferences: async (preferences: UserProfile['notificationsEnabled']): Promise<UserProfile['notificationsEnabled']> => {
    try {
      const response = await apiClient.put<{ preferences: UserProfile['notificationsEnabled'] }>('/profile/preferences', { preferences });
      if (!response.data) {
        throw new Error('Failed to update preferences');
      }
      return response.data.preferences;
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  },

  /**
   * Get activity log
   */
  getActivityLog: async (params?: { page?: number; limit?: number }): Promise<ActivityLogItem[]> => {
    try {
      const response = await apiClient.get<ActivityLogItem[]>('/profile/activity', { params });
      if (!response.data) {
        throw new Error('No activity log data received');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching activity log:', error);
      throw error;
    }
  }
};

export default profileApi;

/**
 * Profile API Service
 * 
 * This file provides methods for interacting with the profile API endpoints.
 */

import apiClient from '../../../api';
import { handleApiError } from '../../../utils/errorHandling';
import { responseValidators } from '../../../utils/apiHelpers';
import { authApi } from '../../auth/api/authApi';
import type { UserProfile, ProfileUpdateRequest, PasswordChangeRequest, ActivityLogItem } from '../types';
import type { AuthUser } from '../../auth/types';

export const profileApi = {
  /**
   * Get user profile using auth/me endpoint
   */
  getProfile: async (): Promise<UserProfile> => {
    try {
      // Use the auth/me endpoint to get current user info
      const authUser: AuthUser = await authApi.getCurrentUser();

      // Transform AuthUser to UserProfile format
      const userProfile: UserProfile = {
        id: authUser.id,
        name: authUser.name,
        email: authUser.email,
        phone: '', // Default empty, can be updated via profile update
        role: authUser.role ?? 'User',
        twoFactorEnabled: false, // Default, should come from backend
        notificationsEnabled: {
          email: true,
          push: false,
          sms: false
        },
        preferences: {
          theme: 'light' as const,
          language: 'en',
          timezone: 'UTC'
        },
        lastLogin: new Date().toISOString(), // Default to now, should come from backend
        lastIp: '0.0.0.0' // Default, should come from backend
      };

      // Add optional fields conditionally
      if (authUser.avatar) {
        userProfile.avatar = authUser.avatar;
      }

      if (authUser.type === 'admin') {
        userProfile.adminNotifications = {
          newUsers: true,
          newOrders: true,
          supplierVerifications: false
        };
      }

      return userProfile;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (profileData: ProfileUpdateRequest): Promise<UserProfile> => {
    try {
      const response = await apiClient.put<UserProfile>('/profile', profileData);
      return responseValidators.update(response, 'profile', 'current');
    } catch (error) {
      throw handleApiError(error);
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

      return responseValidators.update(response, 'profile picture', 'current');
    } catch (error) {
      throw handleApiError(error);
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
      throw handleApiError(error);
    }
  },

  /**
   * Delete profile picture
   */
  deleteProfilePicture: async (): Promise<UserProfile> => {
    try {
      const response = await apiClient.delete<UserProfile>('/profile/picture');
      return responseValidators.update(response, 'profile picture', 'current');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update avatar (alias for updateProfilePicture)
   */
  updateAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    try {
      const profile = await profileApi.updateProfilePicture(file);
      const avatarUrl = profile.avatar || '';
      return { avatarUrl };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update profile preferences
   */
  updatePreferences: async (preferences: UserProfile['notificationsEnabled']): Promise<UserProfile['notificationsEnabled']> => {
    try {
      const response = await apiClient.put<{ preferences: UserProfile['notificationsEnabled'] }>('/profile/preferences', { preferences });
      const data = responseValidators.update(response, 'preferences', 'current');
      return data.preferences;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get activity log
   */
  getActivityLog: async (params?: { page?: number; limit?: number }): Promise<ActivityLogItem[]> => {
    try {
      const response = await apiClient.get<ActivityLogItem[]>('/profile/activity', { params });
      return responseValidators.getList(response, 'activity log', true);
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

export default profileApi;

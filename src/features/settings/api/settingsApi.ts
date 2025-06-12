/**
 * Settings API Service
 * 
 * This file provides methods for interacting with the settings API endpoints.
 */

import apiClient from '../../../api';
import type { Settings, NotificationSettings, GeneralSettings, SecuritySettings, AppearanceSettings } from '../types';

export const settingsApi = {
  /**
   * Get all settings
   */
  getSettings: async (): Promise<Settings> => {
    try {
      const response = await apiClient.get<Settings>('/settings');
      if (!response.data) {
        throw new Error('No settings data received');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  },

  /**
   * Update settings
   */
  updateSettings: async (settings: Partial<Settings>): Promise<Settings> => {
    try {
      const response = await apiClient.put<Settings>('/settings', settings);
      if (!response.data) {
        throw new Error('Failed to update settings');
      }
      return response.data;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },

  /**
   * Get notification settings
   */
  getNotificationSettings: async (): Promise<NotificationSettings> => {
    try {
      const response = await apiClient.get<NotificationSettings>('/settings/notifications');
      if (!response.data) {
        throw new Error('No notification settings received');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      throw error;
    }
  },

  /**
   * Update notification settings
   */
  updateNotificationSettings: async (settings: Partial<NotificationSettings>): Promise<NotificationSettings> => {
    try {
      const response = await apiClient.put<NotificationSettings>('/settings/notifications', settings);
      if (!response.data) {
        throw new Error('Failed to update notification settings');
      }
      return response.data;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  },

  /**
   * Update general settings
   */
  updateGeneralSettings: async (settings: Partial<GeneralSettings>): Promise<GeneralSettings> => {
    try {
      const response = await apiClient.put<GeneralSettings>('/settings/general', settings);
      if (!response.data) {
        throw new Error('Failed to update general settings');
      }
      return response.data;
    } catch (error) {
      console.error('Error updating general settings:', error);
      throw error;
    }
  },

  /**
   * Update security settings
   */
  updateSecuritySettings: async (settings: Partial<SecuritySettings>): Promise<SecuritySettings> => {
    try {
      const response = await apiClient.put<SecuritySettings>('/settings/security', settings);
      if (!response.data) {
        throw new Error('Failed to update security settings');
      }
      return response.data;
    } catch (error) {
      console.error('Error updating security settings:', error);
      throw error;
    }
  },

  /**
   * Update appearance settings
   */
  updateAppearanceSettings: async (settings: Partial<AppearanceSettings>): Promise<AppearanceSettings> => {
    try {
      const response = await apiClient.put<AppearanceSettings>('/settings/appearance', settings);
      if (!response.data) {
        throw new Error('Failed to update appearance settings');
      }
      return response.data;
    } catch (error) {
      console.error('Error updating appearance settings:', error);
      throw error;
    }
  },

  /**
   * Reset settings to defaults
   */
  resetSettings: async (): Promise<Settings> => {
    try {
      const response = await apiClient.post<Settings>('/settings/reset');
      if (!response.data) {
        throw new Error('Failed to reset settings');
      }
      return response.data;
    } catch (error) {
      console.error('Error resetting settings:', error);
      throw error;
    }
  }
};

export default settingsApi;

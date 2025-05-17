/**
 * Settings API Service
 * 
 * This file provides methods for interacting with the settings API endpoints.
 */

import apiClient from '../../../api';
import type { Settings, NotificationSettings } from '../types';

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
  }
};

export default settingsApi;

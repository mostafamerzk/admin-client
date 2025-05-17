/**
 * Settings API Service
 * 
 * This file provides methods for interacting with the settings API endpoints.
 */

import api from '../../../services/api.ts';
import { 
  Settings, 
  GeneralSettings, 
  NotificationSettings, 
  SecuritySettings, 
  AppearanceSettings 
} from '../types/index.ts';

export const settingsApi = {
  /**
   * Get all settings
   */
  getSettings: async (): Promise<Settings> => {
    try {
      const response = await api.get('/settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  },

  /**
   * Update general settings
   */
  updateGeneralSettings: async (settings: Partial<GeneralSettings>): Promise<GeneralSettings> => {
    try {
      const response = await api.put('/settings/general', settings);
      return response.data;
    } catch (error) {
      console.error('Error updating general settings:', error);
      throw error;
    }
  },

  /**
   * Update notification settings
   */
  updateNotificationSettings: async (settings: Partial<NotificationSettings>): Promise<NotificationSettings> => {
    try {
      const response = await api.put('/settings/notifications', settings);
      return response.data;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  },

  /**
   * Update security settings
   */
  updateSecuritySettings: async (settings: Partial<SecuritySettings>): Promise<SecuritySettings> => {
    try {
      const response = await api.put('/settings/security', settings);
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
      const response = await api.put('/settings/appearance', settings);
      return response.data;
    } catch (error) {
      console.error('Error updating appearance settings:', error);
      throw error;
    }
  },

  /**
   * Reset settings to default
   */
  resetSettings: async (): Promise<Settings> => {
    try {
      const response = await api.post('/settings/reset');
      return response.data;
    } catch (error) {
      console.error('Error resetting settings:', error);
      throw error;
    }
  }
};

export default settingsApi;

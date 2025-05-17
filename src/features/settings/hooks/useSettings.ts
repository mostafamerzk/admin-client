/**
 * Settings Hook
 * 
 * This hook provides methods and state for working with settings.
 */

import { useState, useCallback, useEffect } from 'react';
import { 
  Settings, 
  GeneralSettings, 
  NotificationSettings, 
  SecuritySettings, 
  AppearanceSettings 
} from '../types/index.ts';
import settingsApi from '../api/settingsApi.ts';
import useNotification from '../../../hooks/useNotification.ts';

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showNotification } = useNotification();

  // Fetch all settings
  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await settingsApi.getSettings();
      setSettings(data);
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch settings'
      });
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Update general settings
  const updateGeneralSettings = useCallback(async (generalSettings: Partial<GeneralSettings>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedGeneralSettings = await settingsApi.updateGeneralSettings(generalSettings);
      setSettings(prevSettings => {
        if (!prevSettings) return null;
        return {
          ...prevSettings,
          general: updatedGeneralSettings
        };
      });
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'General settings updated successfully'
      });
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update general settings'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Update notification settings
  const updateNotificationSettings = useCallback(async (notificationSettings: Partial<NotificationSettings>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedNotificationSettings = await settingsApi.updateNotificationSettings(notificationSettings);
      setSettings(prevSettings => {
        if (!prevSettings) return null;
        return {
          ...prevSettings,
          notifications: updatedNotificationSettings
        };
      });
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'Notification settings updated successfully'
      });
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update notification settings'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Update security settings
  const updateSecuritySettings = useCallback(async (securitySettings: Partial<SecuritySettings>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedSecuritySettings = await settingsApi.updateSecuritySettings(securitySettings);
      setSettings(prevSettings => {
        if (!prevSettings) return null;
        return {
          ...prevSettings,
          security: updatedSecuritySettings
        };
      });
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'Security settings updated successfully'
      });
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update security settings'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Update appearance settings
  const updateAppearanceSettings = useCallback(async (appearanceSettings: Partial<AppearanceSettings>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedAppearanceSettings = await settingsApi.updateAppearanceSettings(appearanceSettings);
      setSettings(prevSettings => {
        if (!prevSettings) return null;
        return {
          ...prevSettings,
          appearance: updatedAppearanceSettings
        };
      });
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'Appearance settings updated successfully'
      });
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update appearance settings'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Reset settings to default
  const resetSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const defaultSettings = await settingsApi.resetSettings();
      setSettings(defaultSettings);
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'Settings reset to default successfully'
      });
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to reset settings'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Load settings on mount
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    isLoading,
    error,
    fetchSettings,
    updateGeneralSettings,
    updateNotificationSettings,
    updateSecuritySettings,
    updateAppearanceSettings,
    resetSettings
  };
};

export default useSettings;

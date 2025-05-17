/**
 * Profile Hook
 * 
 * This hook provides methods and state for working with the user profile.
 */

import { useState, useCallback, useEffect } from 'react';
import { Profile, ProfileUpdateData, PasswordChangeData } from '../types/index.ts';
import profileApi from '../api/profileApi.ts';
import useNotification from '../../../hooks/useNotification.ts';

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showNotification } = useNotification();

  // Fetch the current user's profile
  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await profileApi.getProfile();
      setProfile(data);
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch profile'
      });
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Update the current user's profile
  const updateProfile = useCallback(async (profileData: ProfileUpdateData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedProfile = await profileApi.updateProfile(profileData);
      setProfile(updatedProfile);
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'Profile updated successfully'
      });
      return updatedProfile;
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update profile'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Update the current user's avatar
  const updateAvatar = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const { avatarUrl } = await profileApi.updateAvatar(file);
      setProfile(prevProfile => {
        if (!prevProfile) return null;
        return {
          ...prevProfile,
          avatar: avatarUrl
        };
      });
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'Avatar updated successfully'
      });
      return avatarUrl;
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update avatar'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Change the current user's password
  const changePassword = useCallback(async (passwordData: PasswordChangeData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await profileApi.changePassword(passwordData);
      if (result.success) {
        showNotification({
          type: 'success',
          title: 'Success',
          message: 'Password changed successfully'
        });
      }
      return result;
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to change password'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Update profile preferences
  const updatePreferences = useCallback(async (preferences: Profile['preferences']) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedPreferences = await profileApi.updatePreferences(preferences);
      setProfile(prevProfile => {
        if (!prevProfile) return null;
        return {
          ...prevProfile,
          preferences: updatedPreferences
        };
      });
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'Preferences updated successfully'
      });
      return updatedPreferences;
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update preferences'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Get activity log for the current user
  const getActivityLog = useCallback(async (params?: { page?: number; limit?: number }) => {
    setIsLoading(true);
    setError(null);
    try {
      const activityLog = await profileApi.getActivityLog(params);
      return activityLog;
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch activity log'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Load profile on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
    updateAvatar,
    changePassword,
    updatePreferences,
    getActivityLog
  };
};

export default useProfile;

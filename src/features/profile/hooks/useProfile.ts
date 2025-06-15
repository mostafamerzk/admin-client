/**
 * Profile Hook
 * 
 * This hook provides methods and state for working with the user profile.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { Profile, ProfileUpdateData, PasswordChangeData } from '../types/index';
import profileApi from '../api/profileApi';
import useNotification from '../../../hooks/useNotification';

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showNotification } = useNotification();

  // Use ref to avoid dependency issues with showNotification
  const showNotificationRef = useRef(showNotification);
  const hasInitialFetched = useRef(false);
  const cacheRef = useRef<{ data: Profile; timestamp: number } | null>(null);
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  // Update ref when showNotification changes
  useEffect(() => {
    showNotificationRef.current = showNotification;
  });

  // Check if cached data is still valid
  const isCacheValid = useCallback(() => {
    if (!cacheRef.current) return false;
    return Date.now() - cacheRef.current.timestamp < CACHE_TTL;
  }, [CACHE_TTL]);

  // Fetch the current user's profile
  const fetchProfile = useCallback(async (forceRefresh = false) => {
    // Use cache if available and valid, unless force refresh is requested
    if (!forceRefresh && isCacheValid() && cacheRef.current) {
      setProfile(cacheRef.current.data);
      return cacheRef.current.data;
    }

    setIsLoading(true);
    setError(null);
    try {
      console.log('[useProfile] Fetching profile...');
      const data = await profileApi.getProfile();
      console.log('[useProfile] Profile fetched successfully:', data);
      setProfile(data);
      // Cache the data
      cacheRef.current = {
        data,
        timestamp: Date.now()
      };
      return data;
    } catch (err) {
      console.error('[useProfile] Error fetching profile:', err);
      const error = err as Error;
      setError(error);

      // Provide more specific error messages
      let errorMessage = 'Failed to fetch profile';
      if (error.message.includes('Network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        errorMessage = 'You are not authorized to view this profile. Please log in again.';
      } else if (error.message.includes('404') || error.message.includes('Not found')) {
        errorMessage = 'Profile not found. Please contact support if this issue persists.';
      } else if (error.message.includes('500') || error.message.includes('Server')) {
        errorMessage = 'Server error. Please try again later.';
      }

      showNotificationRef.current({
        type: 'error',
        title: 'Profile Error',
        message: errorMessage
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isCacheValid]); // Remove showNotification dependency

  // Update the current user's profile
  const updateProfile = useCallback(async (profileData: ProfileUpdateData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedProfile = await profileApi.updateProfile(profileData);
      setProfile(updatedProfile);
      // Update cache
      cacheRef.current = {
        data: updatedProfile,
        timestamp: Date.now()
      };
      showNotificationRef.current({
        type: 'success',
        title: 'Success',
        message: 'Profile updated successfully'
      });
      return updatedProfile;
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to update profile'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []); // Remove showNotification dependency

  // Update the current user's avatar
  const updateAvatar = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const { avatarUrl } = await profileApi.updateAvatar(file);
      const updatedProfile = profile ? { ...profile, avatar: avatarUrl } : null;
      setProfile(updatedProfile);
      // Update cache
      if (updatedProfile) {
        cacheRef.current = {
          data: updatedProfile,
          timestamp: Date.now()
        };
      }
      showNotificationRef.current({
        type: 'success',
        title: 'Success',
        message: 'Avatar updated successfully'
      });
      return avatarUrl;
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to update avatar'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [profile]); // Add profile dependency

  // Change the current user's password
  const changePassword = useCallback(async (passwordData: PasswordChangeData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await profileApi.changePassword(passwordData);
      if (result.success) {
        showNotificationRef.current({
          type: 'success',
          title: 'Success',
          message: 'Password changed successfully'
        });
      }
      return result;
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to change password'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []); // Remove showNotification dependency

  // Update profile preferences
  const updatePreferences = useCallback(async (preferences: Profile['notificationsEnabled']) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedPreferences = await profileApi.updatePreferences(preferences);
      const updatedProfile = profile ? { ...profile, notificationsEnabled: updatedPreferences } : null;
      setProfile(updatedProfile);
      // Update cache
      if (updatedProfile) {
        cacheRef.current = {
          data: updatedProfile,
          timestamp: Date.now()
        };
      }
      showNotificationRef.current({
        type: 'success',
        title: 'Success',
        message: 'Preferences updated successfully'
      });
      return updatedPreferences;
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to update preferences'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [profile]); // Add profile dependency

  // Get activity log for the current user
  const getActivityLog = useCallback(async (params?: { page?: number; limit?: number }) => {
    setIsLoading(true);
    setError(null);
    try {
      const activityLog = await profileApi.getActivityLog(params);
      return activityLog;
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch activity log'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []); // Remove showNotification dependency

  // Load profile on mount (only if not already fetched)
  useEffect(() => {
    if (!hasInitialFetched.current) {
      hasInitialFetched.current = true;
      fetchProfile();
    }
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

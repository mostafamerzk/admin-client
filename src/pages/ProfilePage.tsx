/**
 * Profile Page
 *
 * This page displays and allows editing of the user's profile.
 */

import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PageHeader from '../components/layout/PageHeader';
import useAuth from '../hooks/useAuth';
import {
  ProfileTabs,
  ProfileInfo,
  SecuritySettings,
  NotificationSettings,
  ActivityLog,
  useProfile,
  UserProfile,
  ProfileTab,
  ActivityLogItem
} from '../features/profile/index';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const {
    profile: profileData,
    isLoading: profileLoading,
    error: profileError,
    updateProfile,
    updateAvatar,
    getActivityLog
  } = useProfile();

  const [activeTab, setActiveTab] = useState<ProfileTab>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activities, setActivities] = useState<ActivityLogItem[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);

  // Create a working profile state that syncs with the hook
  const [localProfileChanges, setLocalProfileChanges] = useState<Partial<UserProfile>>({});

  // Merge hook profile data with local changes for editing
  const profile = profileData ? { ...profileData, ...localProfileChanges } : null;

  // Debug logging
  console.log('[ProfilePage] Render state:', {
    user,
    profileData,
    profileLoading,
    profileError: profileError?.message,
    localProfileChanges
  });

  // Load activity log when activity tab is accessed
  useEffect(() => {
    if (activeTab === 'activity' && getActivityLog && activities.length === 0) {
      const loadActivities = async () => {
        setActivitiesLoading(true);
        try {
          const activityData = await getActivityLog();
          setActivities(activityData);
        } catch (error) {
          console.error('Failed to load activity log:', error);
          // Fallback to empty array - error is handled by the hook
          setActivities([]);
        } finally {
          setActivitiesLoading(false);
        }
      };
      loadActivities();
    }
  }, [activeTab, getActivityLog, activities.length]);

  const handleSaveProfile = async () => {
    if (!updateProfile || !profile) return;

    setIsSaving(true);
    try {
      const updateData = {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        ...(profile.avatar && profile.avatar.trim() && { avatar: profile.avatar })
      };

      await updateProfile(updateData);
      setLocalProfileChanges({}); // Clear local changes after successful save
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalProfileChanges(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleChange = (setting: string) => {
    if (!profile) return;

    if (setting.startsWith('notifications.')) {
      const notificationType = setting.split('.')[1];
      if (notificationType && notificationType in profile.notificationsEnabled) {
        const notifKey = notificationType as keyof typeof profile.notificationsEnabled;
        setLocalProfileChanges(prev => ({
          ...prev,
          notificationsEnabled: {
            ...profile.notificationsEnabled,
            ...prev.notificationsEnabled,
            [notifKey]: !profile.notificationsEnabled[notifKey]
          }
        }));
      }
    } else if (setting.startsWith('adminNotifications.')) {
      const adminNotificationType = setting.split('.')[1];
      // Safe access to adminNotifications with proper null checking
      const currentAdminNotifications = profile.adminNotifications;
      if (adminNotificationType && currentAdminNotifications && adminNotificationType in currentAdminNotifications) {
        const adminNotifKey = adminNotificationType as keyof NonNullable<typeof profile.adminNotifications>;
        setLocalProfileChanges(prev => ({
          ...prev,
          adminNotifications: {
            ...currentAdminNotifications,
            ...prev.adminNotifications,
            [adminNotifKey]: !currentAdminNotifications[adminNotifKey]
          }
        }));
      }
    } else if (setting in profile) {
      const profileKey = setting as keyof typeof profile;
      setLocalProfileChanges(prev => ({
        ...prev,
        [profileKey]: !profile[profileKey]
      }));
    }
  };

  const handleChangePassword = () => {
    console.log('Change password');
  };

  const handleSignOutAllDevices = () => {
    console.log('Sign out all devices');
  };

  const handleAvatarChange = async (file: File) => {
    if (!updateAvatar) return;

    try {
      await updateAvatar(file);
      // The hook will update the profile state automatically
      // We just need to clear any local avatar changes
      setLocalProfileChanges(prev => {
        const { avatar: _avatar, ...rest } = prev;
        return rest;
      });
    } catch (error) {
      console.error('Failed to update avatar:', error);
    }
  };

  // Check if user is admin (in real app, this would come from auth context)
  const isAdmin = profile?.role === 'Administrator';

  const renderTabContent = () => {
    switch (activeTab) {
      case 'security':
        return (
          <SecuritySettings
            profile={profile}
            onToggleChange={handleToggleChange}
            onChangePassword={handleChangePassword}
            onSignOutAllDevices={handleSignOutAllDevices}
          />
        );
      case 'notifications':
        return (
          <NotificationSettings
            profile={profile}
            onToggleChange={handleToggleChange}
            isAdmin={isAdmin}
          />
        );
      case 'activity':
        return (
          <ActivityLog
            activities={activities}
            isLoading={activitiesLoading}
          />
        );
      default:
        return (
          <ProfileInfo
            profile={profile}
            isEditing={isEditing}
            onInputChange={handleInputChange}
            onAvatarChange={handleAvatarChange}
          />
        );
    }
  };

  // Show loading state while profile is being fetched
  if (profileLoading && !profile) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="My Profile"
          description="View and manage your profile information and notification preferences"
        />
        <Card>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <LoadingSpinner size="md" />
              <p className="mt-2 text-sm text-gray-500">Loading profile...</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Show error state if profile failed to load
  if (profileError && !profile) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="My Profile"
          description="View and manage your profile information and notification preferences"
        />
        <Card>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-600 mb-2">Failed to load profile</p>
              <p className="text-sm text-gray-500">{profileError.message}</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Don't render if no profile data
  if (!profile) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="View and manage your profile information and notification preferences"
        actions={
          activeTab === 'profile' && (
            isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setLocalProfileChanges({}); // Clear unsaved changes
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  loading={isSaving}
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )
          )
        }
      />



      <Card>
        <ProfileTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <div className="mt-6">
          {renderTabContent()}
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;

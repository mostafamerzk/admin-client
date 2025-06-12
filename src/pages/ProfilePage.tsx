/**
 * Profile Page
 *
 * This page displays and allows editing of the user's profile.
 */

import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import PageHeader from '../components/layout/PageHeader';
import useAuth from '../hooks/useAuth';
import { AVATAR_PLACEHOLDER_SERVICE } from '../constants/config';
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

// Utility function to generate avatar URL
const generateAvatarUrl = (name: string): string => {
  const encodedName = encodeURIComponent(name);
  return `${AVATAR_PLACEHOLDER_SERVICE}?name=${encodedName}&background=3b82f6&color=fff&size=128`;
};

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { profile: profileData, isLoading: profileLoading, updateProfile, updateAvatar } = useProfile();

  const [activeTab, setActiveTab] = useState<ProfileTab>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Use real profile data or fallback to user data from auth context
  const defaultName = user?.name || 'Admin User';
  const [profile, setProfile] = useState<UserProfile>({
    id: user?.id || '1',
    name: defaultName,
    email: user?.email || 'admin@connectchain.com',
    phone: '+1 (555) 123-4567',
    role: user?.role || 'Administrator',
    avatar: (user?.avatar && user.avatar.trim()) ? user.avatar : generateAvatarUrl(defaultName),
    joinDate: '2023-10-15',
    twoFactorEnabled: true,
    notificationsEnabled: {
      email: true,
      push: false,
      sms: true
    },
    adminNotifications: {
      newUsers: true,
      newOrders: true,
      supplierVerifications: false
    },
    lastLogin: '2024-01-20 14:30:25',
    lastIp: '192.168.1.1'
  });

  // Update local profile state when profileData or user changes
  useEffect(() => {
    if (profileData) {
      setProfile(profileData);
    } else if (user) {
      setProfile(prev => ({
        ...prev,
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'Administrator',
        avatar: (user.avatar && user.avatar.trim()) ? user.avatar : generateAvatarUrl(user.name)
      }));
    }
  }, [profileData, user]);

  // Mock activity data
  const activities: ActivityLogItem[] = [
    {
      id: 1,
      content: 'Logged in from new device',
      date: '2024-01-20 14:30:25',
      type: 'login'
    },
    {
      id: 2,
      content: 'Changed password',
      date: '2023-12-15 09:45:12',
      type: 'password'
    },
    {
      id: 3,
      content: 'Enabled two-factor authentication',
      date: '2023-11-30 16:22:45',
      type: 'security'
    },
    {
      id: 4,
      content: 'Updated profile information',
      date: '2023-11-10 11:15:30',
      type: 'profile'
    },
    {
      id: 5,
      content: 'Account created',
      date: '2023-10-15 08:00:00',
      type: 'account'
    }
  ];

  const handleSaveProfile = async () => {
    if (!updateProfile) return;

    setIsSaving(true);
    try {
      const updateData = {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        ...(profile.avatar && profile.avatar.trim() && { avatar: profile.avatar })
      };

      await updateProfile(updateData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
  };

  const handleToggleChange = (setting: string) => {
    if (setting.startsWith('notifications.')) {
      const notificationType = setting.split('.')[1];
      if (notificationType && notificationType in profile.notificationsEnabled) {
        const notifKey = notificationType as keyof typeof profile.notificationsEnabled;
        setProfile({
          ...profile,
          notificationsEnabled: {
            ...profile.notificationsEnabled,
            [notifKey]: !profile.notificationsEnabled[notifKey]
          }
        });
      }
    } else if (setting.startsWith('adminNotifications.')) {
      const adminNotificationType = setting.split('.')[1];
      if (adminNotificationType && profile.adminNotifications && adminNotificationType in profile.adminNotifications) {
        const adminNotifKey = adminNotificationType as keyof typeof profile.adminNotifications;
        setProfile({
          ...profile,
          adminNotifications: {
            ...profile.adminNotifications,
            [adminNotifKey]: !profile.adminNotifications[adminNotifKey]
          }
        });
      }
    } else if (setting in profile) {
      const profileKey = setting as keyof typeof profile;
      setProfile({
        ...profile,
        [profileKey]: !profile[profileKey]
      });
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
      const avatarUrl = await updateAvatar(file);
      setProfile(prev => ({
        ...prev,
        avatar: avatarUrl
      }));
    } catch (error) {
      console.error('Failed to update avatar:', error);
    }
  };

  // Check if user is admin (in real app, this would come from auth context)
  const isAdmin = profile.role === 'Administrator';

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
  if (profileLoading && !profile.id) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="My Profile"
          description="View and manage your profile information and notification preferences"
        />
        <Card>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading profile...</p>
            </div>
          </div>
        </Card>
      </div>
    );
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
                  onClick={() => setIsEditing(false)}
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

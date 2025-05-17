/**
 * Profile Page
 *
 * This page displays and allows editing of the user's profile.
 */

import React, { useState } from 'react';
import Card from '../components/common/Card.tsx';
import Button from '../components/common/Button.tsx';
import PageHeader from '../components/layout/PageHeader.tsx';
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
} from '../features/profile/index.ts';

const ProfilePage: React.FC = () => {
  // In a real implementation, we would use the useProfile hook
  // const { profile, isLoading, updateProfile, updateSecurity, updateNotifications, changePassword, signOutAllDevices } = useProfile();

  const [activeTab, setActiveTab] = useState<ProfileTab>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Mock user data
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    name: 'Admin User',
    email: 'admin@connectchain.com',
    phone: '+1 (555) 123-4567',
    role: 'Administrator',
    avatar: '',
    joinDate: '2023-10-15',
    twoFactorEnabled: true,
    notificationsEnabled: {
      email: true,
      push: false,
      sms: true
    },
    lastLogin: '2024-01-20 14:30:25',
    lastIp: '192.168.1.1'
  });

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

  const handleSaveProfile = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
    }, 1500);
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
      setProfile({
        ...profile,
        notificationsEnabled: {
          ...profile.notificationsEnabled,
          [notificationType]: !profile.notificationsEnabled[notificationType as keyof typeof profile.notificationsEnabled]
        }
      });
    } else {
      setProfile({
        ...profile,
        [setting]: !profile[setting as keyof typeof profile]
      });
    }
  };

  const handleChangePassword = () => {
    console.log('Change password');
  };

  const handleSignOutAllDevices = () => {
    console.log('Sign out all devices');
  };

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
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="View and manage your profile information"
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

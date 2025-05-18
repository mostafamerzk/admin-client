/**
 * Notification Settings Component
 * 
 * This component displays and allows editing of the user's notification settings.
 */

import React from 'react';
import type{ UserProfile } from '../types/index.ts';
import ToggleSwitch from '../../../components/common/ToggleSwitch.tsx';

interface NotificationSettingsProps {
  profile: UserProfile;
  onToggleChange: (setting: string) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  profile,
  onToggleChange
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between py-4 border-b border-gray-100">
        <div>
          <h3 className="text-base font-medium text-gray-800">Email Notifications</h3>
          <p className="text-sm text-gray-500 mt-1">Receive notifications via email</p>
        </div>
        <ToggleSwitch
          enabled={profile.notificationsEnabled.email}
          onChange={() => onToggleChange('notifications.email')}
        />
      </div>

      <div className="flex items-center justify-between py-4 border-b border-gray-100">
        <div>
          <h3 className="text-base font-medium text-gray-800">Push Notifications</h3>
          <p className="text-sm text-gray-500 mt-1">Receive push notifications in browser</p>
        </div>
        <ToggleSwitch
          enabled={profile.notificationsEnabled.push}
          onChange={() => onToggleChange('notifications.push')}
        />
      </div>

      <div className="flex items-center justify-between py-4 border-b border-gray-100">
        <div>
          <h3 className="text-base font-medium text-gray-800">SMS Notifications</h3>
          <p className="text-sm text-gray-500 mt-1">Receive important notifications via SMS</p>
        </div>
        <ToggleSwitch
          enabled={profile.notificationsEnabled.sms}
          onChange={() => onToggleChange('notifications.sms')}
        />
      </div>
    </div>
  );
};

export default NotificationSettings;

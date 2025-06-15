/**
 * Enhanced Notification Settings Component
 *
 * This component displays and allows editing of both personal and admin notification settings.
 * Consolidated from the previous Settings page notifications functionality.
 */

import React from 'react';
import type { UserProfile } from '../types/index';
import ToggleSwitch from '../../../components/common/ToggleSwitch';
import { BellIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

interface NotificationSettingsProps {
  profile: UserProfile | null;
  onToggleChange: (setting: string) => void;
  isAdmin?: boolean;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  profile,
  onToggleChange,
  isAdmin = false
}) => {
  // Return null or loading state if profile is not available
  if (!profile) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500">Notification settings not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Personal Notification Preferences */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <BellIcon className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800">Personal Notifications</h2>
        </div>

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

      {/* Admin Notification Settings - Only show for admin users */}
      {isAdmin && profile.adminNotifications && (
        <div className="space-y-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Cog6ToothIcon className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-800">Admin Notifications</h2>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div>
              <h3 className="text-base font-medium text-gray-800">New User Registrations</h3>
              <p className="text-sm text-gray-500 mt-1">Get notified when a new user registers</p>
            </div>
            <ToggleSwitch
              enabled={profile.adminNotifications.newUsers}
              onChange={() => onToggleChange('adminNotifications.newUsers')}
            />
          </div>

          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div>
              <h3 className="text-base font-medium text-gray-800">New Orders</h3>
              <p className="text-sm text-gray-500 mt-1">Get notified when a new order is placed</p>
            </div>
            <ToggleSwitch
              enabled={profile.adminNotifications.newOrders}
              onChange={() => onToggleChange('adminNotifications.newOrders')}
            />
          </div>

          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div>
              <h3 className="text-base font-medium text-gray-800">Supplier Verification Requests</h3>
              <p className="text-sm text-gray-500 mt-1">Get notified when a supplier requests verification</p>
            </div>
            <ToggleSwitch
              enabled={profile.adminNotifications.supplierVerifications}
              onChange={() => onToggleChange('adminNotifications.supplierVerifications')}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;

/**
 * Security Settings Component
 * 
 * This component displays and allows editing of the user's security settings.
 */

import React from 'react';
import type { UserProfile } from '../types/index';
import Button from '../../../components/common/Button';
import ToggleSwitch from '../../../components/common/ToggleSwitch';

interface SecuritySettingsProps {
  profile: UserProfile | null;
  onToggleChange: (setting: string) => void;
  onChangePassword: () => void;
  onSignOutAllDevices: () => void;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  profile,
  onToggleChange,
  onChangePassword,
  onSignOutAllDevices
}) => {
  // Return null or loading state if profile is not available
  if (!profile) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500">Security settings not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between py-4 border-b border-gray-100">
        <div>
          <h3 className="text-base font-medium text-gray-800">Password</h3>
          <p className="text-sm text-gray-500 mt-1">Last changed 30 days ago</p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onChangePassword}
        >
          Change Password
        </Button>
      </div>

      <div className="flex items-center justify-between py-4 border-b border-gray-100">
        <div>
          <h3 className="text-base font-medium text-gray-800">Two-Factor Authentication</h3>
          <p className="text-sm text-gray-500 mt-1">
            {profile.twoFactorEnabled 
              ? 'Enabled - Using Authenticator App' 
              : 'Disabled - Enable for extra security'}
          </p>
        </div>
        <ToggleSwitch
          enabled={profile.twoFactorEnabled}
          onChange={() => onToggleChange('twoFactorEnabled')}
        />
      </div>

      <div className="flex items-center justify-between py-4 border-b border-gray-100">
        <div>
          <h3 className="text-base font-medium text-gray-800">Login Sessions</h3>
          <p className="text-sm text-gray-500 mt-1">Last login: {profile.lastLogin} from IP {profile.lastIp}</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-red-600 hover:bg-red-50"
          onClick={onSignOutAllDevices}
        >
          Sign Out All Devices
        </Button>
      </div>
    </div>
  );
};

export default SecuritySettings;

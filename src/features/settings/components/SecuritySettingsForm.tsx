/**
 * Security Settings Form Component
 * 
 * This component displays and allows editing of security settings.
 */

import React from 'react';
import { SecuritySettings } from '../types/index';
import Button from '../../../components/common/Button';

interface SecuritySettingsFormProps {
  settings: SecuritySettings;
  onSave: () => void;
  onToggleTwoFactor: () => void;
  onPasswordChange: (field: 'currentPassword' | 'newPassword' | 'confirmPassword', value: string) => void;
}

const SecuritySettingsForm: React.FC<SecuritySettingsFormProps> = ({
  settings,
  onSave,
  onToggleTwoFactor,
  onPasswordChange
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-800">Change Password</h3>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              type="password"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              value={settings.currentPassword || ''}
              onChange={(e) => onPasswordChange('currentPassword', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              value={settings.newPassword || ''}
              onChange={(e) => onPasswordChange('newPassword', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              value={settings.confirmPassword || ''}
              onChange={(e) => onPasswordChange('confirmPassword', e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-800">Two-Factor Authentication</h3>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Protect your account with two-factor authentication</p>
              <p className="text-xs text-gray-500 mt-1">
                {settings.twoFactorEnabled ? 'Currently enabled' : 'Currently disabled'}
              </p>
            </div>
            <Button 
              variant="outline"
              onClick={onToggleTwoFactor}
            >
              {settings.twoFactorEnabled ? 'Disable' : 'Enable'}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button variant="primary" onClick={onSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default SecuritySettingsForm;

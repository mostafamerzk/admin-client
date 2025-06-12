/**
 * Notification Settings Form Component
 * 
 * This component displays and allows editing of notification settings.
 */

import React from 'react';
import { NotificationSettings } from '../types/index';
import Button from '../../../components/common/Button';

interface NotificationSettingsFormProps {
  settings: NotificationSettings;
  onSave: () => void;
  onToggle: (field: keyof NotificationSettings) => void;
}

const NotificationSettingsForm: React.FC<NotificationSettingsFormProps> = ({
  settings,
  onSave,
  onToggle
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-800">Email Notifications</h3>
        <div className="mt-4 space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="new-users"
                name="new-users"
                type="checkbox"
                checked={settings.newUsers}
                onChange={() => onToggle('newUsers')}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="new-users" className="font-medium text-gray-700">New user registrations</label>
              <p className="text-gray-500">Get notified when a new user registers</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="new-orders"
                name="new-orders"
                type="checkbox"
                checked={settings.newOrders}
                onChange={() => onToggle('newOrders')}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="new-orders" className="font-medium text-gray-700">New orders</label>
              <p className="text-gray-500">Get notified when a new order is placed</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="supplier-verifications"
                name="supplier-verifications"
                type="checkbox"
                checked={settings.supplierVerifications}
                onChange={() => onToggle('supplierVerifications')}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="supplier-verifications" className="font-medium text-gray-700">Supplier verification requests</label>
              <p className="text-gray-500">Get notified when a supplier requests verification</p>
            </div>
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

export default NotificationSettingsForm;

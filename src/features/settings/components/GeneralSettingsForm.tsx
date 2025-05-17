/**
 * General Settings Form Component
 * 
 * This component displays and allows editing of general settings.
 */

import React from 'react';
import { GeneralSettings } from '../types/index.ts';
import Button from '../../../components/common/Button.tsx';

interface GeneralSettingsFormProps {
  settings: GeneralSettings;
  onSave: () => void;
  onChange: (field: keyof GeneralSettings, value: string) => void;
}

const GeneralSettingsForm: React.FC<GeneralSettingsFormProps> = ({
  settings,
  onSave,
  onChange
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Platform Name
        </label>
        <input
          type="text"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          value={settings.platformName}
          onChange={(e) => onChange('platformName', e.target.value)}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Contact Email
        </label>
        <input
          type="email"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          value={settings.contactEmail}
          onChange={(e) => onChange('contactEmail', e.target.value)}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Default Language
        </label>
        <select
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          value={settings.defaultLanguage}
          onChange={(e) => onChange('defaultLanguage', e.target.value)}
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Timezone
        </label>
        <select
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          value={settings.timezone}
          onChange={(e) => onChange('timezone', e.target.value)}
        >
          <option value="UTC">UTC</option>
          <option value="EST">Eastern Time (EST)</option>
          <option value="CST">Central Time (CST)</option>
          <option value="PST">Pacific Time (PST)</option>
        </select>
      </div>
      
      <div className="flex justify-end">
        <Button variant="primary" onClick={onSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default GeneralSettingsForm;

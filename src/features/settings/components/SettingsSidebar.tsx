/**
 * Settings Sidebar Component
 * 
 * This component displays the sidebar navigation for the settings page.
 */

import React from 'react';
import { SettingsTab } from '../types/index.ts';
import Card from '../../../components/common/Card.tsx';

interface SettingsSidebarProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  activeTab,
  onTabChange
}) => {
  const tabs = [
    {
      id: 'general',
      label: 'General Settings'
    },
    {
      id: 'security',
      label: 'Security'
    },
    {
      id: 'notifications',
      label: 'Notifications'
    },
    {
      id: 'api',
      label: 'API Keys'
    },
    {
      id: 'billing',
      label: 'Billing'
    }
  ];

  return (
    <Card noPadding>
      <ul className="divide-y divide-gray-100">
        {tabs.map((tab) => (
          <li key={tab.id}>
            <button
              className={`w-full text-left px-4 py-3 ${
                activeTab === tab.id ? 'bg-primary bg-opacity-5 text-primary font-medium' : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => onTabChange(tab.id as SettingsTab)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default SettingsSidebar;

/**
 * Profile Tabs Component
 * 
 * This component displays the tabs for the profile page.
 */

import React from 'react';
import { ProfileTab } from '../types/index.ts';
import {
  UserCircleIcon,
  ShieldCheckIcon,
  BellIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface ProfileTabsProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
      icon: <UserCircleIcon className="w-5 h-5 mr-2" />
    },
    {
      id: 'security',
      label: 'Security',
      icon: <ShieldCheckIcon className="w-5 h-5 mr-2" />
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <BellIcon className="w-5 h-5 mr-2" />
    },
    {
      id: 'activity',
      label: 'Activity',
      icon: <ClockIcon className="w-5 h-5 mr-2" />
    }
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => onTabChange(tab.id as ProfileTab)}
          >
            <div className="flex items-center">
              {tab.icon}
              {tab.label}
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ProfileTabs;

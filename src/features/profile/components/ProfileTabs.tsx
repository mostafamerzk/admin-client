/**
 * Profile Tabs Component
 * 
 * This component displays the tabs for the profile page.
 */

import React from 'react';
import type { ProfileTab } from '../types/index.ts';
import Tabs, { type Tab } from '../../../components/common/Tabs.tsx';
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
  const tabsData = [
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

  // Convert our tabs data to the format expected by the Tabs component
  const tabs = tabsData.map(tab => ({
    id: tab.id,
    label: (
      <div className="flex items-center">
        {tab.icon}
        {tab.label}
      </div>
    )
  }));

  return (
    <Tabs
      tabs={tabs as unknown as Tab[]}
      activeTab={activeTab}
      onChange={(tabId) => onTabChange(tabId as ProfileTab)}
    />
  );
};

export default ProfileTabs;


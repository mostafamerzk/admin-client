/**
 * Activity Log Component
 * 
 * This component displays the user's activity log.
 */

import React from 'react';
import type { ActivityLogItem } from '../types/index';
import {
  UserCircleIcon,
  KeyIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ComputerDesktopIcon,
  CogIcon,
  BellIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';

interface ActivityLogProps {
  activities: ActivityLogItem[];
  isLoading?: boolean;
}

const ActivityLog: React.FC<ActivityLogProps> = ({
  activities,
  isLoading = false
}) => {
  // Helper function to get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <ComputerDesktopIcon className="h-5 w-5" />;
      case 'password':
        return <KeyIcon className="h-5 w-5" />;
      case 'security':
        return <ShieldCheckIcon className="h-5 w-5" />;
      case 'account':
        return <PlusCircleIcon className="h-5 w-5" />;
      case 'profile':
        return <UserCircleIcon className="h-5 w-5" />;
      case 'settings':
        return <CogIcon className="h-5 w-5" />;
      case 'notifications':
        return <BellIcon className="h-5 w-5" />;
      default:
        return <CheckCircleIcon className="h-5 w-5" />;
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading activity log...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state
  if (activities.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-gray-500">No activity found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flow-root">
        <ul className="-mb-8">
          {activities.map((activity, activityIdx) => (
            <li key={activity.id}>
              <div className="relative pb-8">
                {activityIdx !== activities.length - 1 ? (
                  <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                ) : null}
                <div className="relative flex items-start space-x-3">
                  <div>
                    <div className="relative px-1">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white icon-container">
                        <div className="text-gray-600">
                          {activity.icon || getActivityIcon(activity.type)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 py-1.5">
                    <div className="text-sm text-gray-500">
                      <div className="font-medium text-gray-900">{activity.content}</div>
                      <span className="whitespace-nowrap">{new Date(activity.date).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ActivityLog;

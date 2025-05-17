/**
 * Activity Log Component
 * 
 * This component displays the user's activity log.
 */

import React from 'react';
import { ActivityLogItem } from '../types/index.ts';
import {
  UserCircleIcon,
  KeyIcon,
  ShieldCheckIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface ActivityLogProps {
  activities: ActivityLogItem[];
}

const ActivityLog: React.FC<ActivityLogProps> = ({
  activities
}) => {
  // Helper function to get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <UserCircleIcon className="h-5 w-5" />;
      case 'password':
        return <KeyIcon className="h-5 w-5" />;
      case 'security':
        return <ShieldCheckIcon className="h-5 w-5" />;
      case 'account':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'profile':
      default:
        return <UserCircleIcon className="h-5 w-5" />;
    }
  };

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
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary bg-opacity-10 ring-8 ring-white">
                        <span className="text-primary">
                          {activity.icon || getActivityIcon(activity.type)}
                        </span>
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

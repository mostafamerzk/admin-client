/**
 * User Details Component
 * 
 * This component displays detailed information about a user.
 */

import React from 'react';
import type { User } from '../types/index.ts';

interface UserDetailsProps {
  user: User;
}

const UserDetails: React.FC<UserDetailsProps> = ({ user }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">
            {user.name.charAt(0)}
          </div>
        )}
        <div>
          <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.type.charAt(0).toUpperCase() + user.type.slice(1)}</p>
          <div className="mt-1">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              user.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">User ID</dt>
            <dd className="mt-1 text-sm text-gray-900">{user.id}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Last Login</dt>
            <dd className="mt-1 text-sm text-gray-900">{user.lastLogin}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Account Type</dt>
            <dd className="mt-1 text-sm text-gray-900">{user.type.charAt(0).toUpperCase() + user.type.slice(1)}</dd>
          </div>
        </dl>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-medium text-gray-500">Recent Activity</h4>
        <ul className="mt-2 space-y-2">
          <li className="text-sm text-gray-600">Logged in on {user.lastLogin}</li>
          <li className="text-sm text-gray-600">Updated profile information on 2024-01-05</li>
          <li className="text-sm text-gray-600">Changed password on 2023-12-20</li>
        </ul>
      </div>
    </div>
  );
};

export default UserDetails;

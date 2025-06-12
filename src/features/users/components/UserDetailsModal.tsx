/**
 * User Details Modal Component
 *
 * This component displays detailed information about a user in a modal format.
 * It's specifically designed for the modal popup and matches the Supplier Details modal design.
 */

import React from 'react';
import Avatar from '../../../components/common/Avatar';
import type{ User } from '../types';
import {
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface UserDetailsModalProps {
  user: User;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ user }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar
            {...(user.avatar && { src: user.avatar })}
            alt={user.name}
            name={user.name}
            size="xl"
          />
          <div>
            <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500">ID: {user.id}</p>
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h4>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs text-gray-500">Email</dt>
              <dd className="text-sm text-gray-900">{user.email}</dd>
            </div>
            {user.phone && (
              <div>
                <dt className="text-xs text-gray-500">Phone</dt>
                <dd className="text-sm text-gray-900">{user.phone}</dd>
              </div>
            )}
            <div>
              <dt className="text-xs text-gray-500">Last Login</dt>
              <dd className="text-sm text-gray-900">{user.lastLogin}</dd>
            </div>
          </dl>
        </div>

        {user.address && (
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-3">Address</h4>
            <address className="not-italic text-sm text-gray-900">
              {user.address}
            </address>
          </div>
        )}
      </div>

      {user.businessType && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Business Type</h4>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {user.businessType}
          </span>
        </div>
      )}

      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-medium text-gray-500 mb-2">Account Status</h4>
        <div className="flex items-center space-x-2">
          {user.status === 'active' ? (
            <CheckCircleIcon className="w-5 h-5 text-green-500" />
          ) : (
            <XCircleIcon className="w-5 h-5 text-red-500" />
          )}
          <span className="text-sm text-gray-700">
            {user.status === 'active'
              ? `Active since ${user.lastLogin}`
              : 'Account is banned'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;

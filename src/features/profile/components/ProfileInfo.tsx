/**
 * Profile Info Component
 * 
 * This component displays and allows editing of the user's profile information.
 */

import React from 'react';
import type{ UserProfile } from '../types/index.ts';
import { CameraIcon } from '@heroicons/react/24/outline';

interface ProfileInfoProps {
  profile: UserProfile;
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  profile,
  isEditing,
  onInputChange
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100">
        <div className="relative">
          {profile.avatar ? (
            <img 
              src={profile.avatar} 
              alt={profile.name} 
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary bg-opacity-10 flex items-center justify-center text-primary text-3xl font-bold">
              {profile.name.charAt(0)}
            </div>
          )}
          {isEditing && (
            <button className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-50">
              <CameraIcon className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800">{profile.name}</h3>
          <p className="text-gray-500">{profile.role}</p>
          <p className="text-sm text-gray-500 mt-1">Member since {new Date(profile.joinDate).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800">{profile.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800">{profile.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800">{profile.phone}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <p className="text-gray-800">{profile.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;

/**
 * Profile Info Component
 * 
 * This component displays and allows editing of the user's profile information.
 */

import React, { useRef } from 'react';
import type{ UserProfile } from '../types/index';
import { CameraIcon } from '@heroicons/react/24/outline';
import Avatar from '../../../components/common/Avatar';

interface ProfileInfoProps {
  profile: UserProfile;
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAvatarChange?: (file: File) => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  profile,
  isEditing,
  onInputChange,
  onAvatarChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onAvatarChange) {
      onAvatarChange(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100">
        <div className="relative">
          <Avatar
            {...(profile.avatar && profile.avatar.trim() && { src: profile.avatar })}
            alt={profile.name}
            name={profile.name}
            size="2xl"
            className="w-24 h-24"
          />
          {isEditing && (
            <>
              <button
                onClick={handleAvatarClick}
                className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-50"
              >
                <CameraIcon className="w-5 h-5 text-gray-600" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </>
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

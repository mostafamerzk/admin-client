import React, { useState } from 'react';
import Card from '../components/Card.tsx';
import Button from '../components/Button.tsx';
import {
  UserCircleIcon,
  KeyIcon,
  BellIcon,
  ShieldCheckIcon,
  CameraIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'activity'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Mock user data
  const [userData, setUserData] = useState({
    name: 'Admin User',
    email: 'admin@connectchain.com',
    phone: '+1 (555) 123-4567',
    role: 'Administrator',
    avatar: '',
    joinDate: '2023-10-15',
    twoFactorEnabled: true,
    notificationsEnabled: {
      email: true,
      push: false,
      sms: true
    },
    lastLogin: '2024-01-20 14:30:25',
    lastIp: '192.168.1.1'
  });

  const handleSaveProfile = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleToggleChange = (setting: string) => {
    if (setting.startsWith('notifications.')) {
      const notificationType = setting.split('.')[1];
      setUserData({
        ...userData,
        notificationsEnabled: {
          ...userData.notificationsEnabled,
          [notificationType]: !userData.notificationsEnabled[notificationType as keyof typeof userData.notificationsEnabled]
        }
      });
    } else {
      setUserData({
        ...userData,
        [setting]: !userData[setting as keyof typeof userData]
      });
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100">
        <div className="relative">
          {userData.avatar ? (
            <img 
              src={userData.avatar} 
              alt={userData.name} 
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary bg-opacity-10 flex items-center justify-center text-primary text-3xl font-bold">
              {userData.name.charAt(0)}
            </div>
          )}
          {isEditing && (
            <button className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-50">
              <CameraIcon className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800">{userData.name}</h3>
          <p className="text-gray-500">{userData.role}</p>
          <p className="text-sm text-gray-500 mt-1">Member since {new Date(userData.joinDate).toLocaleDateString()}</p>
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
                value={userData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800">{userData.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800">{userData.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={userData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800">{userData.phone}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <p className="text-gray-800">{userData.role}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between py-4 border-b border-gray-100">
        <div>
          <h3 className="text-base font-medium text-gray-800">Password</h3>
          <p className="text-sm text-gray-500 mt-1">Last changed 30 days ago</p>
        </div>
        <Button variant="outline" size="sm">Change Password</Button>
      </div>

      <div className="flex items-center justify-between py-4 border-b border-gray-100">
        <div>
          <h3 className="text-base font-medium text-gray-800">Two-Factor Authentication</h3>
          <p className="text-sm text-gray-500 mt-1">
            {userData.twoFactorEnabled 
              ? 'Enabled - Using Authenticator App' 
              : 'Disabled - Enable for extra security'}
          </p>
        </div>
        <div className="flex items-center">
          <button 
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              userData.twoFactorEnabled ? 'bg-primary' : 'bg-gray-200'
            }`}
            onClick={() => handleToggleChange('twoFactorEnabled')}
          >
            <span 
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                userData.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
              }`} 
            />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between py-4 border-b border-gray-100">
        <div>
          <h3 className="text-base font-medium text-gray-800">Login Sessions</h3>
          <p className="text-sm text-gray-500 mt-1">Last login: {userData.lastLogin} from IP {userData.lastIp}</p>
        </div>
        <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
          Sign Out All Devices
        </Button>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between py-4 border-b border-gray-100">
        <div>
          <h3 className="text-base font-medium text-gray-800">Email Notifications</h3>
          <p className="text-sm text-gray-500 mt-1">Receive notifications via email</p>
        </div>
        <div className="flex items-center">
          <button 
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              userData.notificationsEnabled.email ? 'bg-primary' : 'bg-gray-200'
            }`}
            onClick={() => handleToggleChange('notifications.email')}
          >
            <span 
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                userData.notificationsEnabled.email ? 'translate-x-6' : 'translate-x-1'
              }`} 
            />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between py-4 border-b border-gray-100">
        <div>
          <h3 className="text-base font-medium text-gray-800">Push Notifications</h3>
          <p className="text-sm text-gray-500 mt-1">Receive push notifications in browser</p>
        </div>
        <div className="flex items-center">
          <button 
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              userData.notificationsEnabled.push ? 'bg-primary' : 'bg-gray-200'
            }`}
            onClick={() => handleToggleChange('notifications.push')}
          >
            <span 
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                userData.notificationsEnabled.push ? 'translate-x-6' : 'translate-x-1'
              }`} 
            />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between py-4 border-b border-gray-100">
        <div>
          <h3 className="text-base font-medium text-gray-800">SMS Notifications</h3>
          <p className="text-sm text-gray-500 mt-1">Receive important notifications via SMS</p>
        </div>
        <div className="flex items-center">
          <button 
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              userData.notificationsEnabled.sms ? 'bg-primary' : 'bg-gray-200'
            }`}
            onClick={() => handleToggleChange('notifications.sms')}
          >
            <span 
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                userData.notificationsEnabled.sms ? 'translate-x-6' : 'translate-x-1'
              }`} 
            />
          </button>
        </div>
      </div>
    </div>
  );

  const renderActivityTab = () => (
    <div className="space-y-4">
      <div className="flow-root">
        <ul className="-mb-8">
          {[
            { 
              id: 1, 
              content: 'Logged in from new device', 
              date: '2024-01-20 14:30:25', 
              icon: <UserCircleIcon className="h-5 w-5" /> 
            },
            { 
              id: 2, 
              content: 'Changed password', 
              date: '2023-12-15 09:45:12', 
              icon: <KeyIcon className="h-5 w-5" /> 
            },
            { 
              id: 3, 
              content: 'Enabled two-factor authentication', 
              date: '2023-11-30 16:22:45', 
              icon: <ShieldCheckIcon className="h-5 w-5" /> 
            },
            { 
              id: 4, 
              content: 'Updated profile information', 
              date: '2023-11-10 11:15:30', 
              icon: <UserCircleIcon className="h-5 w-5" /> 
            },
            { 
              id: 5, 
              content: 'Account created', 
              date: '2023-10-15 08:00:00', 
              icon: <CheckCircleIcon className="h-5 w-5" /> 
            }
          ].map((activity, activityIdx) => (
            <li key={activity.id}>
              <div className="relative pb-8">
                {activityIdx !== 4 ? (
                  <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                ) : null}
                <div className="relative flex items-start space-x-3">
                  <div>
                    <div className="relative px-1">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary bg-opacity-10 ring-8 ring-white">
                        <span className="text-primary">
                          {activity.icon}
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'security':
        return renderSecurityTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'activity':
        return renderActivityTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        <div className="flex space-x-3">
          {activeTab === 'profile' && (
            isEditing ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveProfile}
                  loading={isSaving}
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )
          )}
        </div>
      </div>

      <Card>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              <div className="flex items-center">
                <UserCircleIcon className="w-5 h-5 mr-2" />
                Profile
              </div>
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'security'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('security')}
            >
              <div className="flex items-center">
                <ShieldCheckIcon className="w-5 h-5 mr-2" />
                Security
              </div>
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'notifications'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('notifications')}
            >
              <div className="flex items-center">
                <BellIcon className="w-5 h-5 mr-2" />
                Notifications
              </div>
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'activity'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('activity')}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Activity
              </div>
            </button>
          </nav>
        </div>
        <div className="mt-6">
          {renderTabContent()}
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;

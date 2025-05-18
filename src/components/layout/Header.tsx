/**
 * Header Component
 * 
 * The header component that appears at the top of the layout.
 * It includes the app title, notifications, and user profile dropdown.
 */

import React, { useState, useRef, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { 
  BellIcon, 
  QuestionMarkCircleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import useAuth from '../../hooks/useAuth.ts';
import Avatar from '../common/Avatar.tsx';
import Badge from '../common/Badge.tsx';
import { ROUTES } from '../../constants/routes.ts';

interface HeaderProps {
  className?: string;
  testId?: string;
}

const Header: React.FC<HeaderProps> = ({
  className = '',
  testId,
}) => {
  const { user, logout } = useAuth();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  
  // Mock notifications
  const notifications = [
    {
      id: '1',
      title: 'New Supplier Registration',
      message: 'A new supplier has registered and is awaiting verification.',
      time: '5 minutes ago',
      read: false,
    },
    {
      id: '2',
      title: 'Order Completed',
      message: 'Order #1234 has been completed successfully.',
      time: '1 hour ago',
      read: true,
    },
    {
      id: '3',
      title: 'System Update',
      message: 'The system will undergo maintenance tonight at 2 AM.',
      time: '3 hours ago',
      read: true,
    },
  ];
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
      
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };
  
  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isProfileDropdownOpen) setIsProfileDropdownOpen(false);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  
  return (
    <header 
      className={`bg-white shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-10 ${className}`}
      data-testid={testId}
    >
      <h1 className="text-xl font-semibold text-gray-800">ConnectChain Admin</h1>
      
      <div className="flex items-center space-x-4">
        {/* Help */}
        <button
          className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          aria-label="Help"
        >
          <QuestionMarkCircleIcon className="h-5 w-5" />
        </button>
        
        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            id="notifications-button"
            className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors relative"
            onClick={toggleNotifications}
            aria-label="Notifications"
            aria-expanded={isNotificationsOpen}
            aria-haspopup="true"
          >
            <BellIcon className="h-5 w-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            )}
          </button>
          
          {isNotificationsOpen && (
            <div
              className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-100"
              aria-labelledby="notifications-button"
            >
              <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
                {unreadNotificationsCount > 0 && (
                  <Badge variant="primary" size="xs">
                    {unreadNotificationsCount} new
                  </Badge>
                )}
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium text-gray-800">{notification.title}</h4>
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500 text-sm">
                    No notifications
                  </div>
                )}
              </div>
              
              {notifications.length > 0 && (
                <div className="px-4 py-2 border-t border-gray-100 text-center">
                  <button className="text-xs text-primary hover:text-primary-dark font-medium">
                    View all notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* User Profile */}
        <div className="relative" ref={profileDropdownRef}>
          <button
            id="user-menu-button"
            className="flex items-center space-x-2 focus:outline-none"
            onClick={toggleProfileDropdown}
            aria-expanded={isProfileDropdownOpen}
            aria-haspopup="true"
          >
            <Avatar 
              src={user?.avatar || ''} 
              name={user?.name || 'User'} 
              size="sm" 
            />
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-700">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.email || ''}</p>
            </div>
            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
          </button>
          
          {isProfileDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-100"
              aria-labelledby="user-menu-button"
            >
              <Link
                to={ROUTES.PROFILE}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsProfileDropdownOpen(false)}
              >
                Your Profile
              </Link>
              <Link
                to={ROUTES.SETTINGS}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsProfileDropdownOpen(false)}
              >
                Settings
              </Link>
              <div className="border-t border-gray-100 my-1"></div>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default memo(Header);

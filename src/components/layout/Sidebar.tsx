/**
 * Sidebar Component
 * 
 * The sidebar navigation component that appears on the left side of the layout.
 */

import React, { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  BuildingStorefrontIcon,
  TagIcon,
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronLeftIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';
import useUI from '../../hooks/useUI.ts';
import useAuth from '../../hooks/useAuth.ts';
import { ROUTES } from '../../constants/routes.ts';
import Avatar from '../common/Avatar.tsx';

interface SidebarProps {
  className?: string;
  testId?: string;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeColor?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  className = '',
  testId,
}) => {
  const location = useLocation();
  const { isMobile, isSidebarOpen, toggleSidebar } = useUI();
  const { user } = useAuth();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const navItems: NavItem[] = [
    { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: HomeIcon },
    { path: ROUTES.USERS, label: 'Users', icon: UsersIcon, badge: 12 },
    { path: ROUTES.SUPPLIERS, label: 'Suppliers', icon: BuildingStorefrontIcon, badge: 5, badgeColor: 'bg-yellow-500' },
    { path: ROUTES.CATEGORIES, label: 'Categories', icon: TagIcon },
    { path: ROUTES.ORDERS, label: 'Orders', icon: ShoppingCartIcon, badge: 8, badgeColor: 'bg-blue-500' },
    { path: '/analytics', label: 'Analytics', icon: ChartBarIcon },
    { path: '/verifications', label: 'Verifications', icon: ClipboardDocumentCheckIcon, badge: 3, badgeColor: 'bg-red-500' },
    { path: ROUTES.SETTINGS, label: 'Settings', icon: Cog6ToothIcon },
    { path: ROUTES.PROFILE, label: 'Profile', icon: UserCircleIcon },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={toggleSidebar}
          data-testid={`${testId}-overlay`}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 transition-all duration-300 ease-in-out ${
          isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'
        } ${isSidebarOpen ? 'w-64' : 'w-20'} ${className}`}
        data-testid={testId}
      >
        {/* Logo and toggle button */}
        <div className="flex items-center justify-between p-4 border-b">
          <Link to="/" className="flex-shrink-0">
            {isSidebarOpen ? (
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                ConnectChain
              </span>
            ) : (
              <span className="text-2xl font-bold text-primary">CC</span>
            )}
          </Link>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            aria-label={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            data-testid={`${testId}-toggle`}
          >
            {isSidebarOpen ? (
              <ChevronLeftIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-2 pb-24" aria-label="Main Navigation">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActiveItem = isActive(item.path);
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center ${!isSidebarOpen && 'justify-center'} p-3 rounded-lg transition-all duration-200 group ${
                      isActiveItem
                        ? 'bg-primary text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                    }`}
                    onClick={isMobile ? toggleSidebar : undefined}
                    title={!isSidebarOpen ? item.label : undefined}
                    aria-current={isActiveItem ? 'page' : undefined}
                    data-testid={`${testId}-nav-${item.label.toLowerCase()}`}
                  >
                    <Icon className={`h-5 w-5 flex-shrink-0 ${
                      isActiveItem ? 'text-white' : 'text-gray-500 group-hover:text-primary'
                    }`} />

                    {isSidebarOpen && (
                      <span className="ml-3 font-medium">{item.label}</span>
                    )}
                    
                    {isSidebarOpen && item.badge && (
                      <span className={`ml-auto ${item.badgeColor || 'bg-primary'} text-white px-2 py-0.5 rounded-full text-xs`}>
                        {item.badge}
                      </span>
                    )}
                    
                    {!isSidebarOpen && item.badge && (
                      <span className={`absolute top-0 right-0 ${item.badgeColor || 'bg-primary'} text-white w-4 h-4 rounded-full text-xs flex items-center justify-center`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        {isSidebarOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
            <div className="flex items-center space-x-3">
              <Avatar 
                src={user?.avatar || ''} 
                name={user?.name || 'Admin User'} 
                size="sm" 
              />
              <div>
                <p className="text-sm font-medium text-gray-700">{user?.name || 'Admin User'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'admin@connectchain.com'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default memo(Sidebar);

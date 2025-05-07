import React from 'react';
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
  UserCircleIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile, isOpen, toggleSidebar }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: HomeIcon },
    { path: '/users', label: 'Users', icon: UsersIcon },
    { path: '/suppliers', label: 'Suppliers', icon: BuildingStorefrontIcon },
    { path: '/categories', label: 'Categories', icon: TagIcon },
    { path: '/orders', label: 'Orders', icon: ShoppingCartIcon },
    { path: '/profile', label: 'Profile', icon: UserCircleIcon },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 transition-all duration-300 ease-in-out ${
          isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'
        } ${isOpen ? 'w-64' : 'w-20'}`}
      >
        {/* Logo and toggle button */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex-shrink-0">
            {isOpen ? (
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                ConnectChain
              </span>
            ) : (
              <span className="text-2xl font-bold text-primary">CC</span>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md text-gray-500 hover:bg-gray-100"
            title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {isOpen ? (
              <ChevronLeftIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-2">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center ${!isOpen && 'justify-center'} p-3 rounded-lg transition-all duration-200 group ${
                      isActive(item.path)
                        ? 'bg-primary text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                    }`}
                    onClick={isMobile ? toggleSidebar : undefined}
                    title={!isOpen ? item.label : undefined}
                  >
                    <Icon className={`h-5 w-5 ${
                      isActive(item.path) ? 'text-white' : 'text-gray-500 group-hover:text-primary'
                    }`} />

                    {isOpen && (
                      <>
                        <span className="ml-3 font-medium">{item.label}</span>
                        {isActive(item.path) && (
                          <span className="ml-auto bg-white bg-opacity-20 px-2 py-1 rounded-md text-xs">
                            Active
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        {isOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                A
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Admin User</p>
                <p className="text-xs text-gray-500">admin@connectchain.com</p>
              </div>
            </div>
          </div>
        )}
      </div>


    </>
  );
};

export default Sidebar;

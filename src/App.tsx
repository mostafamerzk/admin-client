import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Sidebar from './components/Sidebar.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import UsersPage from './pages/UsersPage.tsx';
import SuppliersPage from './pages/SuppliersPage.tsx';
import CategoriesPage from './pages/CategoriesPage.tsx';
import OrdersPage from './pages/OrdersPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import { BellIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);

      // If transitioning from mobile to desktop, open the sidebar
      if (isMobile && !newIsMobile) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('#profile-dropdown') && !target.closest('#profile-button')) {
        setIsProfileDropdownOpen(false);
      }
      if (!target.closest('#notifications-dropdown') && !target.closest('#notifications-button')) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isProfileDropdownOpen) setIsProfileDropdownOpen(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-background flex">
        <Sidebar
          isMobile={isMobile}
          isOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <div className={`flex-1 transition-all duration-300 ${
          isMobile ? '' : sidebarOpen ? 'md:ml-64' : 'md:ml-20'
        }`}>
          <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-10">
            <h1 className="text-xl font-semibold text-gray-800">ConnectChain Admin</h1>
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  id="notifications-button"
                  className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors relative"
                  onClick={toggleNotifications}
                >
                  <BellIcon className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                </button>

                {isNotificationsOpen && (
                  <div
                    id="notifications-dropdown"
                    className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-20"
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
                        <button className="text-xs text-primary hover:underline">Mark all as read</button>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      <div className="px-4 py-3 hover:bg-gray-50 border-l-4 border-primary">
                        <p className="text-sm font-medium text-gray-800">New user registered</p>
                        <p className="text-xs text-gray-500 mt-1">John Doe created a new account</p>
                        <p className="text-xs text-gray-400 mt-1">5 minutes ago</p>
                      </div>
                      <div className="px-4 py-3 hover:bg-gray-50">
                        <p className="text-sm font-medium text-gray-800">New order received</p>
                        <p className="text-xs text-gray-500 mt-1">Order #12345 needs processing</p>
                        <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                      </div>
                      <div className="px-4 py-3 hover:bg-gray-50">
                        <p className="text-sm font-medium text-gray-800">Supplier verification needed</p>
                        <p className="text-xs text-gray-500 mt-1">Office Solutions is waiting for verification</p>
                        <p className="text-xs text-gray-400 mt-1">3 hours ago</p>
                      </div>
                    </div>
                    <div className="px-4 py-2 border-t border-gray-100 text-center">
                      <button className="text-sm text-primary hover:underline">View all notifications</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Help */}
              <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                <QuestionMarkCircleIcon className="h-5 w-5" />
              </button>

              {/* Profile */}
              <div className="relative">
                <button
                  id="profile-button"
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={toggleProfileDropdown}
                >
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    A
                  </div>
                </button>

                {isProfileDropdownOpen && (
                  <div
                    id="profile-dropdown"
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20"
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">Admin User</p>
                      <p className="text-xs text-gray-500">admin@connectchain.com</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="p-6">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/suppliers" element={<SuppliersPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
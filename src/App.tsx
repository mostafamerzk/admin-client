/**
 * App Component
 *
 * The main application component that sets up routing and context providers.
 * It implements code splitting and lazy loading for all page components.
 */

import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout.tsx';
import NotificationsContainer from './components/common/NotificationsContainer.tsx';
import ProtectedRoute from './components/common/ProtectedRoute.tsx';
import ErrorBoundary from './components/common/ErrorBoundary.tsx';
import PageLoader from './components/common/PageLoader.tsx';
import { ROUTES } from './constants/routes.ts';
import { preloadRoutes } from './utils/routePreloader.ts';
import { AuthProvider } from './context/AuthContext.tsx';
import { UIProvider } from './context/UIContext.tsx';
import { NotificationProvider } from './context/NotificationContext.tsx';

// Lazy-loaded page components
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const UsersPage = lazy(() => import('./pages/UsersPage'));
const UserEditPage = lazy(() => import('./pages/UserEditPage'));
const SuppliersPage = lazy(() => import('./pages/SuppliersPage'));
const SupplierEditPage = lazy(() => import('./pages/SupplierEditPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const VerificationsPage = lazy(() => import('./pages/VerificationsPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const App: React.FC = () => {
  // Preload routes
  useEffect(() => {
    preloadRoutes([
      { importFn: () => import('./pages/DashboardPage'), name: 'dashboard' },
      { importFn: () => import('./pages/UsersPage'), name: 'users' },
      { importFn: () => import('./pages/UserEditPage'), name: 'user-edit' },
      { importFn: () => import('./pages/SuppliersPage'), name: 'suppliers' },
      { importFn: () => import('./pages/SupplierEditPage'), name: 'supplier-edit' },
      { importFn: () => import('./pages/CategoriesPage'), name: 'categories' },
      { importFn: () => import('./pages/OrdersPage'), name: 'orders' },
      { importFn: () => import('./pages/ProfilePage'), name: 'profile' },
      { importFn: () => import('./pages/SettingsPage'), name: 'settings' },
      { importFn: () => import('./pages/VerificationsPage'), name: 'verifications' },
      { importFn: () => import('./pages/AnalyticsPage'), name: 'analytics' }
    ]);
  }, []);

  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <UIProvider>
            <NotificationProvider>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public routes */}
                  <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                  
                  {/* Protected routes */}
                  <Route element={<ProtectedRoute children={<Outlet />} />}>
                    <Route element={<MainLayout children={<Outlet />} />}>
                      <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
                      <Route path={ROUTES.USERS} element={<UsersPage />} />
                      <Route path={ROUTES.USER_EDIT} element={<UserEditPage />} />
                      <Route path={ROUTES.SUPPLIERS} element={<SuppliersPage />} />
                      <Route path={ROUTES.SUPPLIER_EDIT} element={<SupplierEditPage />} />
                      <Route path={ROUTES.CATEGORIES} element={<CategoriesPage />} />
                      <Route path={ROUTES.ORDERS} element={<OrdersPage />} />
                      <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
                      <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
                      <Route path={ROUTES.VERIFICATIONS} element={<VerificationsPage />} />
                      <Route path={ROUTES.ANALYTICS} element={<AnalyticsPage />} />
                    </Route>
                  </Route>

                  {/* Fallback routes */}
                  <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
              <NotificationsContainer />
            </NotificationProvider>
          </UIProvider>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
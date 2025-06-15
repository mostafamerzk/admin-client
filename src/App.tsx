/**
 * App Component
 *
 * The main application component that sets up routing and context providers.
 * It implements code splitting and lazy loading for all page components.
 */

import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import NotificationsContainer from './components/common/NotificationsContainer';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import PageLoader from './components/common/PageLoader';
import { ROUTES } from './constants/routes';
import { preloadRoutes } from './utils/routePreloader';
import { AuthProvider } from './context/AuthContext';
import { UIProvider } from './context/UIContext';
import { NotificationProvider } from './context/NotificationContext';
import { setupGlobalErrorHandlers } from './utils/errorHandling';

// Lazy-loaded page components
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const UsersPage = lazy(() => import('./pages/UsersPage'));
const UserEditPage = lazy(() => import('./pages/UserEditPage'));
const SuppliersPage = lazy(() => import('./pages/SuppliersPage'));
const SupplierProfilePage = lazy(() => import('./pages/SupplierProfilePage'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));

const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const CategoryManagementPage = lazy(() => import('./pages/CategoryManagementPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const OrderDetailsPage = lazy(() => import('./pages/OrderDetailsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const VerificationsPage = lazy(() => import('./pages/VerificationsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const App: React.FC = () => {
  // Setup global error handlers
  useEffect(() => {
    setupGlobalErrorHandlers();
  }, []);

  // Preload routes
  useEffect(() => {
    preloadRoutes([
      { importFn: () => import('./pages/DashboardPage'), name: 'dashboard' },
      { importFn: () => import('./pages/UsersPage'), name: 'users' },
      { importFn: () => import('./pages/UserEditPage'), name: 'user-edit' },
      { importFn: () => import('./pages/SuppliersPage'), name: 'suppliers' },
      { importFn: () => import('./pages/SupplierProfilePage'), name: 'supplier-profile' },
      { importFn: () => import('./pages/ProductDetailsPage'), name: 'product-details' },

      { importFn: () => import('./pages/CategoriesPage'), name: 'categories' },
      { importFn: () => import('./pages/OrdersPage'), name: 'orders' },
      { importFn: () => import('./pages/OrderDetailsPage'), name: 'order-details' },
      { importFn: () => import('./pages/ProfilePage'), name: 'profile' },
      { importFn: () => import('./pages/VerificationsPage'), name: 'verifications' }
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
                      <Route path={ROUTES.SUPPLIER_PROFILE} element={<SupplierProfilePage />} />
                      <Route path={ROUTES.PRODUCT_DETAILS} element={<ProductDetailsPage />} />

                      <Route path={ROUTES.CATEGORIES} element={<CategoriesPage />} />
                      <Route path={ROUTES.CATEGORY_MANAGEMENT} element={<CategoryManagementPage />} />
                      <Route path={ROUTES.ORDERS} element={<OrdersPage />} />
                      <Route path={ROUTES.ORDER_DETAILS} element={<OrderDetailsPage />} />
                      <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
                      <Route path={ROUTES.VERIFICATIONS} element={<VerificationsPage />} />
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
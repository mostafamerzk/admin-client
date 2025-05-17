/**
 * App Component
 *
 * The main application component that sets up routing and context providers.
 * It implements code splitting and lazy loading for all page components.
 */

import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { UIProvider } from './context/UIContext.tsx';
import { NotificationProvider } from './context/NotificationContext.tsx';
import MainLayout from './components/layout/MainLayout.tsx';
import NotificationsContainer from './components/common/NotificationsContainer.tsx';
import ProtectedRoute from './components/common/ProtectedRoute.tsx';
import { ROUTES } from './constants/routes.ts';

// Lazy-loaded page components with improved naming for better code splitting
const LoginPage = lazy(() => import('./pages/LoginPage.tsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.tsx'));
const UsersPage = lazy(() => import('./pages/UsersPage.tsx'));
const UserEditPage = lazy(() => import('./pages/UserEditPage.tsx'));
const SuppliersPage = lazy(() => import('./pages/SuppliersPage.tsx'));
const SupplierEditPage = lazy(() => import('./pages/SupplierEditPage.tsx'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage.tsx'));
const OrdersPage = lazy(() => import('./pages/OrdersPage.tsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.tsx'));
const SettingsPage = lazy(() => import('./pages/SettingsPage.tsx'));
const VerificationsPage = lazy(() => import('./pages/VerificationsPage.tsx'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage.tsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.tsx'));

// Loading component for suspense fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <UIProvider>
          <NotificationProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public routes */}
                <Route
                  path={ROUTES.LOGIN}
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <LoginPage />
                    </Suspense>
                  }
                />

                {/* Protected routes */}
                <Route
                  path={ROUTES.DASHBOARD}
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Suspense fallback={<PageLoader />}>
                          <DashboardPage />
                        </Suspense>
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path={ROUTES.USERS}
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Suspense fallback={<PageLoader />}>
                          <UsersPage />
                        </Suspense>
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path={ROUTES.USER_EDIT}
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Suspense fallback={<PageLoader />}>
                          <UserEditPage />
                        </Suspense>
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path={ROUTES.SUPPLIERS}
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Suspense fallback={<PageLoader />}>
                          <SuppliersPage />
                        </Suspense>
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path={ROUTES.SUPPLIER_EDIT}
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Suspense fallback={<PageLoader />}>
                          <SupplierEditPage />
                        </Suspense>
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path={ROUTES.CATEGORIES}
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Suspense fallback={<PageLoader />}>
                          <CategoriesPage />
                        </Suspense>
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path={ROUTES.ORDERS}
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Suspense fallback={<PageLoader />}>
                          <OrdersPage />
                        </Suspense>
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path={ROUTES.PROFILE}
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Suspense fallback={<PageLoader />}>
                          <ProfilePage />
                        </Suspense>
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path={ROUTES.SETTINGS}
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Suspense fallback={<PageLoader />}>
                          <SettingsPage />
                        </Suspense>
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path={ROUTES.VERIFICATIONS}
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Suspense fallback={<PageLoader />}>
                          <VerificationsPage />
                        </Suspense>
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path={ROUTES.ANALYTICS}
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Suspense fallback={<PageLoader />}>
                          <AnalyticsPage />
                        </Suspense>
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all redirect for root path */}
                <Route
                  path="/"
                  element={<Navigate to={ROUTES.DASHBOARD} replace />}
                />

                {/* 404 page */}
                <Route
                  path="*"
                  element={
                    <MainLayout>
                      <Suspense fallback={<PageLoader />}>
                        <NotFoundPage />
                      </Suspense>
                    </MainLayout>
                  }
                />
              </Routes>
            </Suspense>

            {/* Global notifications */}
            <NotificationsContainer position="top-right" />
          </NotificationProvider>
        </UIProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
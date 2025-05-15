/**
 * App Component
 *
 * The main application component that sets up routing and context providers.
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

// Lazy-loaded page components
const LoginPage = lazy(() => import('./pages/LoginPage.tsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.tsx'));
const UsersPage = lazy(() => import('./pages/UsersPage.tsx'));
const SuppliersPage = lazy(() => import('./pages/SuppliersPage.tsx'));
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
    <AuthProvider>
      <UIProvider>
        <NotificationProvider>
          <Router>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public routes */}
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />

                {/* Protected routes */}
                <Route
                  path={ROUTES.DASHBOARD}
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <DashboardPage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path={ROUTES.USERS}
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <UsersPage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path={ROUTES.SUPPLIERS}
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <SuppliersPage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path={ROUTES.CATEGORIES}
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <CategoriesPage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path={ROUTES.ORDERS}
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <OrdersPage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path={ROUTES.PROFILE}
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <ProfilePage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path={ROUTES.SETTINGS}
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <SettingsPage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/verifications"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <VerificationsPage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <AnalyticsPage />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Redirect to dashboard if already logged in */}
                <Route
                  path="/"
                  element={<Navigate to={ROUTES.DASHBOARD} replace />}
                />

                {/* 404 page */}
                <Route
                  path="*"
                  element={
                    <MainLayout>
                      <NotFoundPage />
                    </MainLayout>
                  }
                />
              </Routes>
            </Suspense>
          </Router>

          {/* Global notifications */}
          <NotificationsContainer position="top-right" />
        </NotificationProvider>
      </UIProvider>
    </AuthProvider>
  );
};

export default App;
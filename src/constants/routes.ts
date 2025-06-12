/**
 * Routes
 *
 * This file contains constants for all application routes.
 */

export const ROUTES = {
  // Auth routes
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Main routes
  DASHBOARD: '/',
  USERS: '/users',
  USER_DETAILS: '/users/:id',
  USER_EDIT: '/users/:id/edit',
  SUPPLIERS: '/suppliers',
  SUPPLIER_DETAILS: '/suppliers/:id',
  SUPPLIER_PROFILE: '/suppliers/:id/profile',
  SUPPLIER_EDIT: '/suppliers/:id/edit',
  CATEGORIES: '/categories',
  CATEGORY_DETAILS: '/categories/:id',
  ORDERS: '/orders',
  ORDER_DETAILS: '/orders/:id',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  VERIFICATIONS: '/verifications',
  ANALYTICS: '/analytics',

  // Helper function to generate dynamic routes
  getUserDetailsRoute: (id: string) => `/users/${id}`,
  getUserEditRoute: (id: string) => `/users/${id}/edit`,
  getSupplierDetailsRoute: (id: string) => `/suppliers/${id}`,
  getSupplierProfileRoute: (id: string) => `/suppliers/${id}/profile`,
  getSupplierEditRoute: (id: string) => `/suppliers/${id}/edit`,
  getCategoryDetailsRoute: (id: string) => `/categories/${id}`,
  getOrderDetailsRoute: (id: string) => `/orders/${id}`,
};

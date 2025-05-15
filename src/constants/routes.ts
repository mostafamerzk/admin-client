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
  SUPPLIERS: '/suppliers',
  SUPPLIER_DETAILS: '/suppliers/:id',
  CATEGORIES: '/categories',
  CATEGORY_DETAILS: '/categories/:id',
  ORDERS: '/orders',
  ORDER_DETAILS: '/orders/:id',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  
  // Helper function to generate dynamic routes
  getUserDetailsRoute: (id: string) => `/users/${id}`,
  getSupplierDetailsRoute: (id: string) => `/suppliers/${id}`,
  getCategoryDetailsRoute: (id: string) => `/categories/${id}`,
  getOrderDetailsRoute: (id: string) => `/orders/${id}`,
};

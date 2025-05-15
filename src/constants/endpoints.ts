/**
 * API Endpoints
 * 
 * This file contains constants for all API endpoints.
 */

export const ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    CURRENT_USER: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // User endpoints
  USERS: {
    BASE: '/users',
    DETAILS: (id: string) => `/users/${id}`,
    BAN: (id: string) => `/users/${id}/ban`,
    UNBAN: (id: string) => `/users/${id}/unban`,
  },
  
  // Supplier endpoints
  SUPPLIERS: {
    BASE: '/suppliers',
    DETAILS: (id: string) => `/suppliers/${id}`,
    VERIFY: (id: string) => `/suppliers/${id}/verify`,
    REJECT: (id: string) => `/suppliers/${id}/reject`,
    PRODUCTS: (id: string) => `/suppliers/${id}/products`,
  },
  
  // Category endpoints
  CATEGORIES: {
    BASE: '/categories',
    DETAILS: (id: string) => `/categories/${id}`,
    PRODUCTS: (id: string) => `/categories/${id}/products`,
  },
  
  // Order endpoints
  ORDERS: {
    BASE: '/orders',
    DETAILS: (id: string) => `/orders/${id}`,
    APPROVE: (id: string) => `/orders/${id}/approve`,
    REJECT: (id: string) => `/orders/${id}/reject`,
    COMPLETE: (id: string) => `/orders/${id}/complete`,
  },
  
  // Dashboard endpoints
  DASHBOARD: {
    STATS: '/dashboard/stats',
    RECENT_ORDERS: '/dashboard/recent-orders',
    SALES_CHART: '/dashboard/sales-chart',
    USER_GROWTH: '/dashboard/user-growth',
  },
  
  // Settings endpoints
  SETTINGS: {
    BASE: '/settings',
    PROFILE: '/settings/profile',
    SECURITY: '/settings/security',
    NOTIFICATIONS: '/settings/notifications',
  },
};

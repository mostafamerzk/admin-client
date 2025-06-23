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
    STATUS: (id: string) => `/users/${id}/status`,
    BAN: (id: string) => `/users/${id}/ban`,
    UNBAN: (id: string) => `/users/${id}/unban`,
    UPLOAD_IMAGE: '/users/upload-image',
  },
  
  // Supplier endpoints
  SUPPLIERS: {
    BASE: '/suppliers',
    DETAILS: (id: string) => `/suppliers/${id}`,
    VERIFY: (id: string) => `/suppliers/${id}/verify`,
    REJECT: (id: string) => `/suppliers/${id}/reject`,
    PRODUCTS: (id: string) => `/suppliers/${id}/products`,
  },

  // Product endpoints
  PRODUCTS: {
    BASE: '/products',
    DETAILS: (id: string) => `/products/${id}`,
    UPDATE: (id: string) => `/products/${id}`,
    DELETE: (id: string) => `/products/${id}`,
    STATUS: (id: string) => `/products/${id}/status`,
    UPLOAD_IMAGES: (id: string) => `/products/${id}/images`,
    DELETE_IMAGE: (productId: string) => `/products/${productId}/images`,
    VARIANTS: (id: string) => `/products/${id}/variants`,
    SEARCH: '/products/search'
  },
  
  // Category endpoints
  CATEGORIES: {
    BASE: '/categories',
    DETAILS: (id: string) => `/categories/${id}`,
    UPDATE: (id: string) => `/categories/${id}`,
    DELETE: (id: string) => `/categories/${id}`,
    STATUS: (id: string) => `/categories/${id}/status`,
    PRODUCTS: (id: string) => `/categories/${id}/products`,
    UPLOAD_IMAGE: (id: string) => `/categories/${id}/upload-image`,
  },

  // Business Types endpoints
  BUSINESS_TYPES: {
    BASE: '/business-types',
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
    SALES: '/dashboard/sales',
    USER_GROWTH: '/dashboard/user-growth',
    CATEGORY_DISTRIBUTION: '/dashboard/category-distribution',
    RECENT_ORDERS: '/dashboard/recent-orders',
    SALES_CHART: '/dashboard/sales-chart',
  },
};

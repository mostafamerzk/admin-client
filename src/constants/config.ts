/**
 * Application Configuration
 *
 * This file contains configuration values for the application.
 */

// Environment-specific configuration
export const ENV = process.env.NODE_ENV || 'development';
export const IS_DEV = ENV === 'development';
export const IS_PROD = ENV === 'production';
export const IS_TEST = ENV === 'test';

// API configuration
export const API_URL = process.env.REACT_APP_API_URL || 'https://api.connectchain.com';
export const USE_MOCK_API = process.env.REACT_APP_USE_MOCK_API === 'true' || IS_DEV;

// Authentication configuration
export const AUTH_TOKEN_KEY = 'auth_token';
export const USER_DATA_KEY = 'user_data';
export const TOKEN_EXPIRY_MARGIN = 5 * 60 * 1000; // 5 minutes in milliseconds

// UI configuration
export const SIDEBAR_BREAKPOINT = 768; // in pixels
export const NOTIFICATION_DURATION = 5000; // in milliseconds
export const ANIMATION_DURATION = 300; // in milliseconds
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_DEBOUNCE_DELAY = 300; // in milliseconds

// Avatar configuration
export const DEFAULT_AVATAR_URL = 'https://ui-avatars.com/api/?name=Admin+User&background=3b82f6&color=fff&size=128';
export const AVATAR_PLACEHOLDER_SERVICE = 'https://ui-avatars.com/api/';

// Date formats
export const DATE_FORMAT = 'MMM d, yyyy';
export const DATE_TIME_FORMAT = 'MMM d, yyyy h:mm a';
export const TIME_FORMAT = 'h:mm a';

// Feature flags
export const FEATURES = {
  ENABLE_NOTIFICATIONS: true,
  ENABLE_DARK_MODE: false,
  ENABLE_ANALYTICS: IS_PROD,
  ENABLE_EXPORT: true,
};

// Export all configuration as a single object for backward compatibility
export const CONFIG = {
  ENV,
  IS_DEV,
  IS_PROD,
  IS_TEST,
  API_URL,
  USE_MOCK_API,
  AUTH_TOKEN_KEY,
  USER_DATA_KEY,
  TOKEN_EXPIRY_MARGIN,
  SIDEBAR_BREAKPOINT,
  NOTIFICATION_DURATION,
  ANIMATION_DURATION,
  DEFAULT_PAGE_SIZE,
  DEFAULT_DEBOUNCE_DELAY,
  DEFAULT_AVATAR_URL,
  AVATAR_PLACEHOLDER_SERVICE,
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  TIME_FORMAT,
  FEATURES,
};

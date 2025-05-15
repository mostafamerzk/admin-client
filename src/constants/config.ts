/**
 * Application Configuration
 * 
 * This file contains configuration values for the application.
 */

// Environment-specific configuration
const ENV = process.env.NODE_ENV || 'development';
const IS_DEV = ENV === 'development';
const IS_PROD = ENV === 'production';
const IS_TEST = ENV === 'test';

// API configuration
const API_URL = process.env.REACT_APP_API_URL || 'https://api.connectchain.com';
const USE_MOCK_API = process.env.REACT_APP_USE_MOCK_API === 'true' || IS_DEV;

// Authentication configuration
const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';
const TOKEN_EXPIRY_MARGIN = 5 * 60 * 1000; // 5 minutes in milliseconds

// UI configuration
const SIDEBAR_BREAKPOINT = 768; // in pixels
const NOTIFICATION_DURATION = 5000; // in milliseconds
const ANIMATION_DURATION = 300; // in milliseconds
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_DEBOUNCE_DELAY = 300; // in milliseconds

// Date formats
const DATE_FORMAT = 'MMM d, yyyy';
const DATE_TIME_FORMAT = 'MMM d, yyyy h:mm a';
const TIME_FORMAT = 'h:mm a';

// Export configuration
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
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  TIME_FORMAT,
  
  // Feature flags
  FEATURES: {
    ENABLE_NOTIFICATIONS: true,
    ENABLE_DARK_MODE: false,
    ENABLE_ANALYTICS: IS_PROD,
    ENABLE_EXPORT: true,
  },
};

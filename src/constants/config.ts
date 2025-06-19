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

// Environment variables with fallbacks
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
export const USE_MOCK_API = process.env.REACT_APP_USE_MOCK_API === 'true';
export const ENVIRONMENT = process.env.REACT_APP_ENVIRONMENT || 'development';

// Authentication configuration
export const AUTH_TOKEN_KEY = process.env.REACT_APP_AUTH_TOKEN_KEY || 'connectchain_auth_token';
export const USER_DATA_KEY = process.env.REACT_APP_USER_DATA_KEY || 'connectchain_user_data';
export const TOKEN_EXPIRY_MARGIN = 5 * 60 * 1000; // 5 minutes in milliseconds

// API configuration
export const API_TIMEOUT = 30000; // 30 seconds
export const API_RETRY_ATTEMPTS = 3;
export const API_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Development helpers
export const IS_DEVELOPMENT = ENVIRONMENT === 'development';
export const IS_PRODUCTION = ENVIRONMENT === 'production';

// Logging configuration
export const ENABLE_API_LOGGING = IS_DEVELOPMENT;
export const ENABLE_ERROR_REPORTING = IS_PRODUCTION;

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
  ENVIRONMENT,
  AUTH_TOKEN_KEY,
  USER_DATA_KEY,
  TOKEN_EXPIRY_MARGIN,
  API_TIMEOUT,
  API_RETRY_ATTEMPTS,
  API_CACHE_TTL,
  IS_DEVELOPMENT,
  IS_PRODUCTION,
  ENABLE_API_LOGGING,
  ENABLE_ERROR_REPORTING,
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

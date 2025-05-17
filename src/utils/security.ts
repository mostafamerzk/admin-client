/**
 * Security Utilities
 * 
 * This file provides security-related utility functions.
 */

import { TOKEN_EXPIRY_MARGIN } from '../constants/config.ts';

/**
 * Sanitize user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Parse JWT token and extract payload
 */
export const parseJwt = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
};

/**
 * Check if a JWT token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = parseJwt(token);
    if (!payload || !payload.exp) return true;
    
    // Get current time in seconds
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Check if token is expired with a margin for network latency
    return payload.exp < currentTime + TOKEN_EXPIRY_MARGIN / 1000;
  } catch (error) {
    console.error('Error checking token expiry:', error);
    return true;
  }
};

/**
 * Generate a CSRF token
 */
export const generateCsrfToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Store CSRF token in localStorage
 */
export const storeCsrfToken = (token: string): void => {
  localStorage.setItem('csrf_token', token);
};

/**
 * Get CSRF token from localStorage
 */
export const getCsrfToken = (): string | null => {
  return localStorage.getItem('csrf_token');
};

/**
 * Validate password strength
 * Returns an object with validation result and error message
 */
export const validatePasswordStrength = (password: string): { valid: boolean; message?: string } => {
  if (!password) {
    return { valid: false, message: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  
  if (!hasUpperCase) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!hasLowerCase) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!hasNumbers) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  
  if (!hasSpecialChars) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  
  return { valid: true };
};

/**
 * Encrypt sensitive data using AES encryption
 * Note: This is a simple implementation for demonstration purposes.
 * In a real application, use a proper encryption library.
 */
export const encryptData = (data: string, key: string): string => {
  try {
    // Simple XOR encryption for demonstration
    const encrypted = data.split('').map((char, i) => {
      return String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length));
    }).join('');
    
    return btoa(encrypted);
  } catch (error) {
    console.error('Error encrypting data:', error);
    return '';
  }
};

/**
 * Decrypt sensitive data
 * Note: This is a simple implementation for demonstration purposes.
 * In a real application, use a proper encryption library.
 */
export const decryptData = (encryptedData: string, key: string): string => {
  try {
    const data = atob(encryptedData);
    
    // Simple XOR decryption for demonstration
    const decrypted = data.split('').map((char, i) => {
      return String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length));
    }).join('');
    
    return decrypted;
  } catch (error) {
    console.error('Error decrypting data:', error);
    return '';
  }
};

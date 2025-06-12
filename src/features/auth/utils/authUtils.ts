/**
 * Auth Utilities
 * 
 * This file provides utility functions for authentication.
 */

import { isTokenExpired, parseJwt } from '../../../utils/security';
import { AUTH_TOKEN_KEY } from '../../../constants/config';

/**
 * Check if the current user has a specific role
 */
export const hasRole = (userRoles: string | string[], requiredRole: string): boolean => {
  if (!userRoles) return false;
  
  const roles = Array.isArray(userRoles) ? userRoles : [userRoles];
  return roles.includes(requiredRole);
};

/**
 * Check if the current user has any of the specified roles
 */
export const hasAnyRole = (userRoles: string | string[], requiredRoles: string[]): boolean => {
  if (!userRoles) return false;
  
  const roles = Array.isArray(userRoles) ? userRoles : [userRoles];
  return requiredRoles.some(role => roles.includes(role));
};

/**
 * Check if the current user has all of the specified roles
 */
export const hasAllRoles = (userRoles: string | string[], requiredRoles: string[]): boolean => {
  if (!userRoles) return false;
  
  const roles = Array.isArray(userRoles) ? userRoles : [userRoles];
  return requiredRoles.every(role => roles.includes(role));
};

/**
 * Check if the current token is valid
 */
export const isValidToken = (): boolean => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return false;
  
  return !isTokenExpired(token);
};

/**
 * Get user ID from token
 */
export const getUserIdFromToken = (): string | null => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return null;
  
  const payload = parseJwt(token);
  return payload?.sub || null;
};

/**
 * Get token expiration date
 */
export const getTokenExpirationDate = (): Date | null => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return null;
  
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return null;
  
  return new Date(payload.exp * 1000);
};

/**
 * Get remaining token time in seconds
 */
export const getRemainingTokenTime = (): number => {
  const expirationDate = getTokenExpirationDate();
  if (!expirationDate) return 0;
  
  const now = new Date();
  const diffMs = expirationDate.getTime() - now.getTime();
  return Math.max(0, Math.floor(diffMs / 1000));
};

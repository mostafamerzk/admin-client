/**
 * Authentication Service
 *
 * This file provides methods for handling authentication-related operations
 * such as login, logout, and retrieving the current user.
 */

import apiClient from '../api';
import { AUTH_TOKEN_KEY, USER_DATA_KEY } from '../constants/config';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  type: 'customer' | 'supplier' | 'admin';
  avatar?: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

const authService = {
  /**
   * Login with email and password
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
      if (!response.data) throw new Error('No response data received');
      const { user, token, expiresIn } = response.data as LoginResponse;

      // Store token and user data
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));

      return { user, token, expiresIn };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Logout the current user
   */
  logout: async (): Promise<void> => {
    try {
      // Call logout endpoint
      await apiClient.post('/auth/logout', {});
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(USER_DATA_KEY);
    }
  },

  /**
   * Get the current authenticated user
   */
  getCurrentUser: async (): Promise<AuthUser | null> => {
    try {
      // First check if we have user data in localStorage
      const userData = localStorage.getItem(USER_DATA_KEY);
      const token = localStorage.getItem(AUTH_TOKEN_KEY);

      if (!token) {
        return null;
      }

      if (userData) {
        // If we have user data, return it
        return JSON.parse(userData);
      }

      // If no user data but we have a token, fetch the user
      const response = await apiClient.get<AuthUser>('/auth/me');
      const user = response.data;

      // Store user data
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));

      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      // Clear storage on error
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(USER_DATA_KEY);
      return null;
    }
  },

  /**
   * Check if the user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  },

  /**
   * Get the authentication token
   */
  getToken: (): string | null => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }
};

export default authService;





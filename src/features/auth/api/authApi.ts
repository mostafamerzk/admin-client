/**
 * Auth API Service
 * 
 * This file provides methods for interacting with the auth API endpoints.
 */

import api from '../../../services/api.ts';
import { 
  AuthUser, 
  LoginCredentials, 
  LoginResponse, 
  RegisterCredentials,
  ForgotPasswordRequest,
  ResetPasswordRequest
} from '../types/index.ts';
import { AUTH_TOKEN_KEY, USER_DATA_KEY } from '../../../constants/config.ts';
import { handleApiError } from '../../../utils/errorHandling.ts';

export const authApi = {
  /**
   * Login with email and password
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { user, token, expiresIn } = response.data;
      
      // Store token and user data
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
      
      return { user, token, expiresIn };
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Register a new user
   */
  register: async (credentials: RegisterCredentials): Promise<LoginResponse> => {
    try {
      const response = await api.post('/auth/register', credentials);
      const { user, token, expiresIn } = response.data;
      
      // Store token and user data
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
      
      return { user, token, expiresIn };
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Logout the current user
   */
  logout: async (): Promise<void> => {
    try {
      // Call logout endpoint
      await api.post('/auth/logout', {});
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
      const response = await api.get('/auth/me');
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
   * Request password reset
   */
  forgotPassword: async (request: ForgotPasswordRequest): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.post('/auth/forgot-password', request);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Reset password with token
   */
  resetPassword: async (request: ResetPasswordRequest): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.post('/auth/reset-password', request);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
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

export default authApi;

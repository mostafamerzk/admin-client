/**
 * Auth API Service
 * 
 * This file provides methods for interacting with the auth API endpoints.
 */

import apiClient from '../../../api';
import type {
  AuthUser,
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  BackendLoginResponse
} from '../types';
import { AUTH_TOKEN_KEY, USER_DATA_KEY } from '../../../constants/config';
import { handleApiError } from '../../../utils/errorHandling';
import { responseValidators } from '../../../utils/apiHelpers';
import {
  transformLoginRequest,
  transformLoginResponse,
  transformUserProfileResponse,
  validateBackendResponse,
  extractErrorMessage
} from '../utils/apiTransformers';

export const authApi = {
  /**
   * Login with email and password
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      // Transform frontend credentials to backend format
      const backendRequest = transformLoginRequest(credentials);

      // Make API call
      const response = await apiClient.post<BackendLoginResponse>('/auth/login', backendRequest);

      // Handle API client error wrapper
      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error('No response data received');
      }

      // Validate and transform backend response
      validateBackendResponse(response.data, ['user', 'token']);
      const loginData = transformLoginResponse(response.data);

      const { user, token, expiresIn } = loginData;

      // Store token and user data
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));

      return { user, token, expiresIn };
    } catch (error: any) {
      // Enhanced error handling for backend-specific errors
      if (error.response?.data) {
        const errorMessage = extractErrorMessage(error.response.data);
        throw new Error(errorMessage);
      }
      throw handleApiError(error);
    }
  },
  
  /**
   * Register a new user
   */
  register: async (credentials: RegisterCredentials): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/register', credentials);
      const registrationData = responseValidators.create(response, 'registration');
      const { user, token, expiresIn } = registrationData;

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
  getCurrentUser: async (): Promise<AuthUser> => {
    try {
      // Check if token exists and is not expired before making request
      const token = authApi.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Basic token expiration check (if token contains exp claim)
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3 && tokenParts[1]) {
          const payload = JSON.parse(atob(tokenParts[1]));
          if (payload.exp && payload.exp * 1000 < Date.now()) {
            // Token is expired, remove it
            authApi.removeToken();
            throw new Error('Authentication token has expired');
          }
        }
      } catch (tokenError) {
        // If token parsing fails, it might be a mock token, continue with request
        if (process.env.REACT_APP_ENVIRONMENT === 'production') {
          console.warn('Failed to parse JWT token:', tokenError);
        }
      }

      // Make API call
      const response = await apiClient.get('/auth/me');

      // Handle API client error wrapper
      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error('No response data received');
      }

      // Transform backend response to frontend format
      return transformUserProfileResponse(response.data);
    } catch (error: any) {
      // Enhanced error handling for backend-specific errors
      if (error.response?.data) {
        const errorMessage = extractErrorMessage(error.response.data);
        throw new Error(errorMessage);
      }
      throw handleApiError(error);
    }
  },
  
  /**
   * Request password reset
   */
  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    try {
      await apiClient.post('/auth/forgot-password', data);
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Reset password with token
   */
  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    try {
      await apiClient.post('/auth/reset-password', data);
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
  },

  /**
   * Set the authentication token
   */
  setToken: (token: string): void => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  },

  /**
   * Remove the authentication token
   */
  removeToken: (): void => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  },

  /**
   * Get user data from localStorage
   */
  getUserData: (): any | null => {
    try {
      const userData = localStorage.getItem(USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  /**
   * Set user data in localStorage
   */
  setUserData: (user: any): void => {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  }
};

export default authApi;

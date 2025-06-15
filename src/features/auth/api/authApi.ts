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
  ResetPasswordRequest
} from '../types';
import { AUTH_TOKEN_KEY, USER_DATA_KEY } from '../../../constants/config';
import { handleApiError } from '../../../utils/errorHandling';
import { responseValidators } from '../../../utils/apiHelpers';

export const authApi = {
  /**
   * Login with email and password
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
      const loginData = responseValidators.create(response, 'login');
      const { user, token, expiresIn } = loginData;

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
      const response = await apiClient.get<AuthUser>('/auth/me');
      return responseValidators.getById(response, 'current user', 'me');
    } catch (error) {
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

/**
 * Auth Hook
 * 
 * This hook provides methods and state for working with authentication.
 */

import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AuthUser, 
  LoginCredentials, 
  RegisterCredentials,
  ForgotPasswordRequest,
  ResetPasswordRequest
} from '../types/index.ts';
import authApi from '../api/authApi.ts';
import useNotification from '../../../hooks/useNotification.ts';
import { ROUTES } from '../../../constants/routes.ts';

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  // Login user
  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'Logged in successfully'
      });
      return response;
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: (err as Error).message || 'Failed to login'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Register user
  const register = useCallback(async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.register(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'Registered successfully'
      });
      return response;
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: (err as Error).message || 'Failed to register'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Logout user
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
      setUser(null);
      setIsAuthenticated(false);
      navigate(ROUTES.LOGIN);
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'Logged out successfully'
      });
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to logout'
      });
    } finally {
      setIsLoading(false);
    }
  }, [navigate, showNotification]);

  // Get current user
  const getCurrentUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);
      return currentUser;
    } catch (err) {
      setError(err as Error);
      setUser(null);
      setIsAuthenticated(false);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Request password reset
  const forgotPassword = useCallback(async (request: ForgotPasswordRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.forgotPassword(request);
      showNotification({
        type: 'success',
        title: 'Success',
        message: response.message || 'Password reset instructions sent to your email'
      });
      return response;
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: (err as Error).message || 'Failed to request password reset'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Reset password
  const resetPassword = useCallback(async (request: ResetPasswordRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.resetPassword(request);
      showNotification({
        type: 'success',
        title: 'Success',
        message: response.message || 'Password reset successfully'
      });
      return response;
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: (err as Error).message || 'Failed to reset password'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      await getCurrentUser();
    };
    checkAuth();
  }, [getCurrentUser]);

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
    login,
    register,
    logout,
    getCurrentUser,
    forgotPassword,
    resetPassword
  };
};

export default useAuth;

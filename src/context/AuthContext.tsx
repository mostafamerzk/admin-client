/**
 * Authentication Context
 *
 * This context provides authentication state and methods to the entire application.
 * It handles user authentication, login, logout, and loading states.
 */

import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import{
  authApi,
  type AuthUser,
  type LoginCredentials,
  type ForgotPasswordRequest,
  type ResetPasswordRequest
} from '../features/auth/index.ts';
import useNotification from '../hooks/useNotification.ts';
import { ROUTES } from '../constants/routes.ts';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (request: ForgotPasswordRequest) => Promise<void>;
  resetPassword: (request: ResetPasswordRequest) => Promise<void>;
  error: string | null;
}

// Create the context with a default value
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  forgotPassword: async () => {},
  resetPassword: async () => {},
  error: null,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotification();

  // Check if the user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Auth check error:', err);
        setError('Failed to authenticate user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      const { user } = await authApi.login(credentials);
      setUser(user);
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'Logged in successfully'
      });
      // The navigation will be handled by the component that calls login
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
      showNotification({
        type: 'error',
        title: 'Error',
        message: err.message || 'Failed to login'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      await authApi.logout();
      setUser(null);
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'Logged out successfully'
      });
      // The navigation will be handled by the component that calls logout
      // or by the ProtectedRoute component when it detects the user is no longer authenticated
      navigate(ROUTES.LOGIN);
    } catch (err) {
      console.error('Logout error:', err);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to logout'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password function
  const forgotPassword = async (request: ForgotPasswordRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      await authApi.forgotPassword(request);
      showNotification({
        type: 'success',
        title: 'Success',
        message:  'Password reset instructions sent to your email'
      });
    } catch (err: any) {
      console.error('Forgot password error:', err);
      setError(err.message || 'Failed to request password reset');
      showNotification({
        type: 'error',
        title: 'Error',
        message: err.message || 'Failed to request password reset'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (request: ResetPasswordRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      await authApi.resetPassword(request);
      showNotification({
        type: 'success',
        title: 'Success',
        message:'Password reset successfully'
      });
      // The navigation will be handled by the component that calls resetPassword
      navigate(ROUTES.LOGIN);
    } catch (err: any) {
      console.error('Reset password error:', err);
      setError(err.message || 'Failed to reset password');
      showNotification({
        type: 'error',
        title: 'Error',
        message: err.message || 'Failed to reset password'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    forgotPassword,
    resetPassword,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

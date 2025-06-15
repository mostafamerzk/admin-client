/**
 * LoginPage Component
 *
 * The login page for the ConnectChain admin panel.
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useNotification from '../hooks/useNotification';
import Button from '../components/common/Button';
import { ROUTES } from '../constants/routes';
import { mockDb } from '../mockData/db';
import { validateForm, validationRules } from '../utils/validation';
import useErrorHandler from '../hooks/useErrorHandler';
import { safeLocalStorage } from '../utils/errorHandling';
import withErrorBoundary from '../components/common/withErrorBoundary';

interface LocationState {
  from?: {
    pathname?: string;
  };
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { showError, showSuccess } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  // Error handling
  const {
    handleFormError,
    withFormErrorHandling,
    clearError
  } = useErrorHandler({
    enableNotifications: true,
    enableReporting: true
  });

  const locationState = location.state as LocationState;
  const from = locationState?.from?.pathname || ROUTES.DASHBOARD;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Validate form
    const validationErrors = validateForm({
      email: formData.email,
      password: formData.password
    }, {
      email: [validationRules.required(), validationRules.email()],
      password: [validationRules.required()]
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    const result = await withFormErrorHandling(async () => {
      await login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      });

      showSuccess('Login successful');
      navigate(from, { replace: true });
      return true;
    }, (field, message) => {
      setErrors(prev => ({ ...prev, [field]: message }));
    }, 'User Login');

    setIsLoading(false);

    if (!result) {
      console.error('Login failed');
    }
  };

  // Reset the mock database (for development troubleshooting)
  const handleResetMockDb = () => {
    const success = safeLocalStorage.removeItem('mock_db_users');
    const success2 = safeLocalStorage.removeItem('mock_db_suppliers');
    const success3 = safeLocalStorage.removeItem('mock_db_categories');
    const success4 = safeLocalStorage.removeItem('mock_db_orders');

    if (success && success2 && success3 && success4) {
      try {
        mockDb.forceReset();
        showSuccess('Mock database has been reset. Please try logging in again.');
        // Clear form
        setFormData({
          email: '',
          password: '',
          rememberMe: false
        });
        setErrors({});
        clearError();
      } catch (error) {
        handleFormError(error, (field, message) => {
          setErrors(prev => ({ ...prev, [field]: message }));
        });
      }
    } else {
      showError('Failed to reset mock database - localStorage error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
            ConnectChain
          </h1>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-800">
            Admin Panel
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account to access the admin dashboard
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData['email']}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${errors['email'] ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                  placeholder="admin@connectchain.com"
                />
                {errors['email'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['email']}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData['password']}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${errors['password'] ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                  placeholder="••••••••"
                />
                {errors['password'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['password']}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button
                  className="text-primary hover:text-primary-dark text-sm font-medium"
                  onClick={() => {}}
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                loading={isLoading}
                disabled={isLoading}
              >
                Sign in
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo Credentials</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <div className="text-sm text-center text-gray-600">
                <p>Email: <span className="font-medium">admin@connectchain.com</span></p>
                <p>Password: <span className="font-medium">password123</span></p>
              </div>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={handleResetMockDb}
                  className="text-xs text-primary hover:text-primary-dark underline"
                >
                  Reset Mock Database
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  If you're having trouble logging in, try resetting the mock database.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrap with error boundary
export default withErrorBoundary(LoginPage, {
  fallback: ({ error, resetError }) => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">🔐</div>
          <h2 className="text-xl font-semibold mb-2">Login Page Error</h2>
          <p className="text-gray-600 mb-4">
            {error.message || 'An error occurred while loading the login page'}
          </p>
          <button
            onClick={resetError}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  ),
  context: 'LoginPage'
});

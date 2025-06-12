/**
 * Error Handler Hook
 * 
 * This hook provides React-specific error handling utilities and state management.
 */

import { useState, useCallback } from 'react';
import { 
  handleApiError, 
  handleValidationError, 
  handleFormError,
  logError,
  reportError,
  type ApiError,
  type ValidationError 
} from '../utils/errorHandling';
import useNotification from './useNotification';

interface ErrorState {
  hasError: boolean;
  error: Error | ApiError | ValidationError | null;
  errorType: 'api' | 'validation' | 'form' | 'general' | null;
  context?: string;
}

interface UseErrorHandlerOptions {
  enableNotifications?: boolean;
  enableReporting?: boolean;
  onError?: (error: any, context?: string) => void;
}

export const useErrorHandler = (options: UseErrorHandlerOptions = {}) => {
  const { enableNotifications = true, enableReporting = true, onError } = options;
  const { showNotification } = useNotification();
  
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    error: null,
    errorType: null
  });

  // Clear error state
  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      errorType: null
    });
  }, []);

  // Handle API errors
  const handleApiErrorWithState = useCallback((error: any, context?: string) => {
    const apiError = handleApiError(
      error,
      enableNotifications ? (notification: { type: string; title: string; message: string }) => {
        showNotification({
          type: notification.type as 'error' | 'success' | 'warning' | 'info',
          title: notification.title,
          message: notification.message
        });
      } : undefined
    );

    setErrorState({
      hasError: true,
      error: apiError,
      errorType: 'api',
      ...(context && { context })
    });

    if (enableReporting && error instanceof Error) {
      reportError(error, context);
    }

    if (onError) {
      onError(error, context);
    }

    return apiError;
  }, [enableNotifications, enableReporting, showNotification, onError]);

  // Handle validation errors
  const handleValidationErrorWithState = useCallback((
    field: string,
    message: string,
    code?: string,
    context?: string
  ) => {
    const validationError = handleValidationError(field, message, code);

    setErrorState({
      hasError: true,
      error: validationError,
      errorType: 'validation',
      ...(context && { context })
    });

    if (enableNotifications) {
      showNotification({
        type: 'error',
        title: 'Validation Error',
        message: validationError.message
      });
    }

    if (onError) {
      onError(validationError, context);
    }

    return validationError;
  }, [enableNotifications, showNotification, onError]);

  // Handle form errors
  const handleFormErrorWithState = useCallback((
    error: any,
    setFieldError?: (field: string, message: string) => void,
    context?: string
  ) => {
    handleFormError(
      error,
      setFieldError,
      enableNotifications ? (notification: { type: string; title: string; message: string }) => {
        showNotification({
          type: notification.type as 'error' | 'success' | 'warning' | 'info',
          title: notification.title,
          message: notification.message
        });
      } : undefined
    );

    setErrorState({
      hasError: true,
      error,
      errorType: 'form',
      ...(context && { context })
    });

    if (enableReporting && error instanceof Error) {
      reportError(error, context);
    }

    if (onError) {
      onError(error, context);
    }
  }, [enableNotifications, enableReporting, showNotification, onError]);

  // Handle general errors
  const handleGeneralError = useCallback((error: any, context?: string) => {
    const errorObj = error instanceof Error ? error : new Error(String(error));

    setErrorState({
      hasError: true,
      error: errorObj,
      errorType: 'general',
      ...(context && { context })
    });

    if (enableNotifications) {
      showNotification({
        type: 'error',
        title: 'Error',
        message: errorObj.message
      });
    }

    if (enableReporting) {
      reportError(errorObj, context);
    }

    logError(errorObj, context);

    if (onError) {
      onError(error, context);
    }

    return errorObj;
  }, [enableNotifications, enableReporting, showNotification, onError]);

  // Async operation wrapper with error handling
  const withErrorHandling = useCallback(async <T>(
    operation: () => Promise<T>,
    context?: string
  ): Promise<T | null> => {
    try {
      clearError();
      return await operation();
    } catch (error) {
      handleApiErrorWithState(error, context);
      return null;
    }
  }, [clearError, handleApiErrorWithState]);

  // Form submission wrapper with error handling
  const withFormErrorHandling = useCallback(async <T>(
    operation: () => Promise<T>,
    setFieldError?: (field: string, message: string) => void,
    context?: string
  ): Promise<T | null> => {
    try {
      clearError();
      return await operation();
    } catch (error) {
      handleFormErrorWithState(error, setFieldError, context);
      return null;
    }
  }, [clearError, handleFormErrorWithState]);

  return {
    // Error state
    ...errorState,
    
    // Error handlers
    handleApiError: handleApiErrorWithState,
    handleValidationError: handleValidationErrorWithState,
    handleFormError: handleFormErrorWithState,
    handleGeneralError,
    clearError,
    
    // Wrapper functions
    withErrorHandling,
    withFormErrorHandling,
    
    // Utility functions
    isApiError: (error: any): error is ApiError => 
      error && typeof error === 'object' && 'status' in error,
    isValidationError: (error: any): error is ValidationError => 
      error && typeof error === 'object' && 'field' in error,
  };
};

export default useErrorHandler;

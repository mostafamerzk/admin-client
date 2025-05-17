/**
 * Error Handling Utilities
 * 
 * This file provides error handling utility functions.
 */

import { AxiosError } from 'axios';

/**
 * API Error interface
 */
export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: any;
}

/**
 * Parse API error from Axios error
 */
export const parseApiError = (error: any): ApiError => {
  if (error.isAxiosError) {
    const axiosError = error as AxiosError;
    
    // Handle network errors
    if (!axiosError.response) {
      return {
        status: 0,
        message: 'Network error. Please check your internet connection.',
        code: 'NETWORK_ERROR'
      };
    }
    
    // Handle API errors with response
    const status = axiosError.response.status;
    const responseData = axiosError.response.data as any;
    
    return {
      status,
      message: responseData.message || getDefaultErrorMessage(status),
      code: responseData.code,
      details: responseData.details
    };
  }
  
  // Handle non-Axios errors
  return {
    status: 500,
    message: error.message || 'An unexpected error occurred.',
    code: 'UNKNOWN_ERROR'
  };
};

/**
 * Get default error message based on HTTP status code
 */
export const getDefaultErrorMessage = (status: number): string => {
  switch (status) {
    case 400:
      return 'Bad request. Please check your input.';
    case 401:
      return 'Unauthorized. Please log in again.';
    case 403:
      return 'Forbidden. You do not have permission to access this resource.';
    case 404:
      return 'Resource not found.';
    case 409:
      return 'Conflict. The resource already exists or has been modified.';
    case 422:
      return 'Validation error. Please check your input.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'Internal server error. Please try again later.';
    case 502:
      return 'Bad gateway. Please try again later.';
    case 503:
      return 'Service unavailable. Please try again later.';
    case 504:
      return 'Gateway timeout. Please try again later.';
    default:
      return 'An unexpected error occurred.';
  }
};

/**
 * Format validation errors
 */
export const formatValidationErrors = (errors: Record<string, string[]>): string => {
  return Object.entries(errors)
    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
    .join('\n');
};

/**
 * Log error to console with additional context
 */
export const logError = (error: any, context?: string): void => {
  const timestamp = new Date().toISOString();
  const errorMessage = error.message || 'Unknown error';
  const errorStack = error.stack || '';
  
  console.error(`[${timestamp}] ${context ? `[${context}] ` : ''}Error: ${errorMessage}`);
  console.error(errorStack);
  
  // In a real application, you might want to send this to a logging service
};

/**
 * Handle API errors in a consistent way
 */
export const handleApiError = (
  error: any,
  showNotification?: (notification: { type: string; title: string; message: string }) => void,
  onUnauthorized?: () => void
): ApiError => {
  const apiError = parseApiError(error);
  
  // Log the error
  logError(error, 'API Error');
  
  // Handle unauthorized errors
  if (apiError.status === 401 && onUnauthorized) {
    onUnauthorized();
  }
  
  // Show notification if provided
  if (showNotification) {
    showNotification({
      type: 'error',
      title: `Error ${apiError.status || ''}`,
      message: apiError.message
    });
  }
  
  return apiError;
};

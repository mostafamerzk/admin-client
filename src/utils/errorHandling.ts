/**
 * Error Handling Utilities
 *
 * This file provides comprehensive error handling utility functions for the application.
 * Includes API errors, validation errors, file upload errors, and more.
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
 * Validation Error interface
 */
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

/**
 * File Upload Error interface
 */
export interface FileUploadError {
  file: string;
  message: string;
  code: 'FILE_TOO_LARGE' | 'INVALID_TYPE' | 'UPLOAD_FAILED' | 'FILE_CORRUPTED';
  maxSize?: number;
  allowedTypes?: string[];
}

/**
 * Data Transformation Error interface
 */
export interface DataTransformationError {
  source: string;
  message: string;
  code: 'PARSE_ERROR' | 'MAPPING_ERROR' | 'TYPE_ERROR' | 'VALIDATION_ERROR' | 'UNKNOWN_ERROR';
  originalData?: any;
}

/**
 * Async Operation Error interface
 */
export interface AsyncOperationError {
  operation: string;
  message: string;
  code: 'TIMEOUT' | 'CANCELLED' | 'NETWORK_ERROR' | 'UNKNOWN_ERROR';
  retryable: boolean;
}

/**
 * Generic Error Response interface
 */
export interface ErrorResponse {
  type: 'api' | 'validation' | 'file' | 'transformation' | 'async' | 'unknown';
  error: ApiError | ValidationError | FileUploadError | DataTransformationError | AsyncOperationError;
  timestamp: number;
  context?: string;
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

/**
 * Handle validation errors
 */
export const handleValidationError = (
  field: string,
  message: string,
  code?: string
): ValidationError => {
  const validationError: ValidationError = {
    field,
    message,
    ...(code && { code })
  };

  logError(new Error(message), `Validation Error - ${field}`);
  return validationError;
};

/**
 * Handle file upload errors
 */
export const handleFileUploadError = (
  file: File | string,
  error: any,
  maxSize?: number,
  allowedTypes?: string[]
): FileUploadError => {
  const fileName = typeof file === 'string' ? file : file.name;
  let code: FileUploadError['code'] = 'UPLOAD_FAILED';
  let message = 'File upload failed';

  if (error.message?.includes('size') || error.code === 'FILE_TOO_LARGE') {
    code = 'FILE_TOO_LARGE';
    message = `File "${fileName}" is too large. Maximum size allowed is ${maxSize ? `${Math.round(maxSize / 1024 / 1024)}MB` : 'unknown'}`;
  } else if (error.message?.includes('type') || error.code === 'INVALID_TYPE') {
    code = 'INVALID_TYPE';
    message = `File "${fileName}" has an invalid type. Allowed types: ${allowedTypes?.join(', ') || 'unknown'}`;
  } else if (error.message?.includes('corrupt') || error.code === 'FILE_CORRUPTED') {
    code = 'FILE_CORRUPTED';
    message = `File "${fileName}" appears to be corrupted`;
  }

  const fileError: FileUploadError = {
    file: fileName,
    message,
    code,
    ...(maxSize && { maxSize }),
    ...(allowedTypes && { allowedTypes })
  };

  logError(error, `File Upload Error - ${fileName}`);
  return fileError;
};

/**
 * Handle data transformation errors
 */
export const handleDataTransformationError = (
  source: string,
  error: any,
  originalData?: any
): DataTransformationError => {
  let code: DataTransformationError['code'] = 'UNKNOWN_ERROR';
  let message = 'Data transformation failed';

  if (error instanceof SyntaxError || error.message?.includes('parse')) {
    code = 'PARSE_ERROR';
    message = `Failed to parse data from ${source}`;
  } else if (error.message?.includes('map') || error.message?.includes('transform')) {
    code = 'MAPPING_ERROR';
    message = `Failed to map data from ${source}`;
  } else if (error instanceof TypeError) {
    code = 'TYPE_ERROR';
    message = `Type error while transforming data from ${source}`;
  } else if (error.message?.includes('valid')) {
    code = 'VALIDATION_ERROR';
    message = `Data validation failed for ${source}`;
  }

  const transformationError: DataTransformationError = {
    source,
    message,
    code,
    originalData
  };

  logError(error, `Data Transformation Error - ${source}`);
  return transformationError;
};

/**
 * Handle async operation errors
 */
export const handleAsyncOperationError = (
  operation: string,
  error: any
): AsyncOperationError => {
  let code: AsyncOperationError['code'] = 'UNKNOWN_ERROR';
  let retryable = false;
  let message = `Async operation "${operation}" failed`;

  if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
    code = 'TIMEOUT';
    message = `Operation "${operation}" timed out`;
    retryable = true;
  } else if (error.name === 'AbortError' || error.message?.includes('abort')) {
    code = 'CANCELLED';
    message = `Operation "${operation}" was cancelled`;
    retryable = false;
  } else if (error.message?.includes('network') || error.code === 'NETWORK_ERROR') {
    code = 'NETWORK_ERROR';
    message = `Network error during operation "${operation}"`;
    retryable = true;
  }

  const asyncError: AsyncOperationError = {
    operation,
    message,
    code,
    retryable
  };

  logError(error, `Async Operation Error - ${operation}`);
  return asyncError;
};

/**
 * Create a comprehensive error response
 */
export const createErrorResponse = (
  type: ErrorResponse['type'],
  error: any,
  context?: string
): ErrorResponse => {
  return {
    type,
    error,
    timestamp: Date.now(),
    ...(context && { context })
  };
};

/**
 * Safe JSON parse with error handling
 */
export const safeJsonParse = <T = any>(
  jsonString: string
): { success: true; data: T } | { success: false; error: DataTransformationError } => {
  try {
    const data = JSON.parse(jsonString) as T;
    return { success: true, data };
  } catch (error) {
    const transformationError = handleDataTransformationError(
      'JSON string',
      error,
      jsonString
    );
    return { success: false, error: transformationError };
  }
};

/**
 * Safe localStorage operations with error handling
 */
export const safeLocalStorage = {
  getItem: <T = string>(key: string, fallback?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return fallback || null;

      // Try to parse as JSON, fallback to string
      try {
        return JSON.parse(item) as T;
      } catch {
        return item as unknown as T;
      }
    } catch (error) {
      logError(error, `localStorage.getItem - ${key}`);
      return fallback || null;
    }
  },

  setItem: (key: string, value: any): boolean => {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, stringValue);
      return true;
    } catch (error) {
      logError(error, `localStorage.setItem - ${key}`);
      return false;
    }
  },

  removeItem: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      logError(error, `localStorage.removeItem - ${key}`);
      return false;
    }
  }
};

/**
 * Safe async operation wrapper with timeout and retry
 */
export const safeAsyncOperation = async <T>(
  operation: () => Promise<T>,
  options: {
    timeout?: number;
    retries?: number;
    retryDelay?: number;
    operationName?: string;
  } = {}
): Promise<{ success: true; data: T } | { success: false; error: AsyncOperationError }> => {
  const {
    timeout = 10000,
    retries = 0,
    retryDelay = 1000,
    operationName = 'Unknown operation'
  } = options;

  let lastError: any;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Operation timed out')), timeout);
      });

      const data = await Promise.race([operation(), timeoutPromise]);
      return { success: true, data };
    } catch (error) {
      lastError = error;

      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        continue;
      }
    }
  }

  const asyncError = handleAsyncOperationError(operationName, lastError);
  return { success: false, error: asyncError };
};

/**
 * Validate file before upload
 */
export const validateFile = (
  file: File,
  options: {
    maxSize?: number;
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}
): { valid: true } | { valid: false; error: FileUploadError } => {
  const { maxSize, allowedTypes, allowedExtensions } = options;

  // Check file size
  if (maxSize && file.size > maxSize) {
    const error = handleFileUploadError(
      file,
      { code: 'FILE_TOO_LARGE' },
      maxSize,
      allowedTypes
    );
    return { valid: false, error };
  }

  // Check file type
  if (allowedTypes && !allowedTypes.includes(file.type)) {
    const error = handleFileUploadError(
      file,
      { code: 'INVALID_TYPE' },
      maxSize,
      allowedTypes
    );
    return { valid: false, error };
  }

  // Check file extension
  if (allowedExtensions) {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      const error = handleFileUploadError(
        file,
        { code: 'INVALID_TYPE' },
        maxSize,
        allowedTypes
      );
      return { valid: false, error };
    }
  }

  return { valid: true };
};

/**
 * Error boundary helper configuration
 */
export const createErrorBoundaryConfig = (
  onError?: (error: Error, errorInfo: any) => void,
  fallbackComponent?: any
) => {
  return {
    onError: onError || ((error: Error, errorInfo: any) => {
      logError(error, 'Error Boundary');
      reportError(error, 'Error Boundary', errorInfo);
    }),
    fallback: fallbackComponent
  };
};

/**
 * Form error handler
 */
export const handleFormError = (
  error: any,
  setFieldError?: (field: string, message: string) => void,
  showNotification?: (notification: { type: string; title: string; message: string }) => void
): void => {
  if (error.response?.data?.errors) {
    // Handle validation errors from API
    const errors = error.response.data.errors;
    let hasFieldErrors = false;

    Object.entries(errors).forEach(([field, messages]) => {
      const message = Array.isArray(messages) ? messages[0] : messages;
      if (setFieldError) {
        setFieldError(field, message as string);
        hasFieldErrors = true;
      }
    });

    // Only show notification if no field errors were handled
    if (!hasFieldErrors && showNotification) {
      const apiError = parseApiError(error);
      showNotification({
        type: 'error',
        title: 'Form Error',
        message: apiError.message
      });
    }
  } else {
    // Handle general form errors - check if it's a specific API error first
    const apiError = parseApiError(error);

    // Check if this is a field-specific error that can be mapped
    if (setFieldError && apiError.message.toLowerCase().includes('email already in use')) {
      setFieldError('email', 'Email already in use');
    } else if (setFieldError && apiError.message.toLowerCase().includes('email')) {
      setFieldError('email', apiError.message);
    } else if (showNotification) {
      // Only show generic notification if we couldn't map to a specific field
      showNotification({
        type: 'error',
        title: 'Form Error',
        message: apiError.message
      });
    }
  }

  logError(error, 'Form Error');
};

/**
 * Network connectivity checker
 */
export const checkNetworkConnectivity = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/health', {
      method: 'HEAD',
      cache: 'no-cache'
    });
    return response.ok;
  } catch {
    return navigator.onLine;
  }
};

/**
 * Retry mechanism for failed operations
 */
export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
  backoff: boolean = true
): Promise<T> => {
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries) {
        const waitTime = backoff ? delay * Math.pow(2, attempt) : delay;
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError;
};

/**
 * Global error handler for unhandled promise rejections
 */
export const setupGlobalErrorHandlers = (): void => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logError(event.reason, 'Unhandled Promise Rejection');

    // Prevent the default browser behavior
    event.preventDefault();
  });

  // Handle global errors
  window.addEventListener('error', (event) => {
    logError(event.error, 'Global Error');
  });
};

/**
 * Error reporting service integration
 */
export const reportError = async (
  error: Error,
  context?: string,
  additionalData?: Record<string, any>
): Promise<void> => {
  try {
    // In a real application, this would send to an error reporting service
    // like Sentry, Bugsnag, or a custom endpoint
    const errorReport = {
      message: error.message,
      stack: error.stack,
      context,
      additionalData,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // For now, just log to console
    console.error('[Error Report]', errorReport);

    // TODO: Implement actual error reporting service integration
    // await fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorReport)
    // });
  } catch (reportingError) {
    console.error('Failed to report error:', reportingError);
  }
};

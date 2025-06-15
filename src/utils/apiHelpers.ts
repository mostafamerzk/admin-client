/**
 * API Response Helper Utilities
 * 
 * This file provides standardized utilities for handling API responses,
 * validation, and common response patterns across all API services.
 */

import type { ApiResponse } from '../api/client/types';

/**
 * Configuration for response validation
 */
export interface ResponseValidationConfig {
  /** Custom error message for missing data */
  errorMessage?: string;
  /** Whether to allow null/undefined data (default: false) */
  allowEmpty?: boolean;
  /** Custom validation function */
  customValidator?: (data: any) => boolean;
  /** Context information for better error messages */
  context?: {
    operation?: string;
    resource?: string;
    id?: string;
  };
}

/**
 * Validates API response and extracts data
 * Throws standardized errors for invalid responses
 */
export const validateApiResponse = <T>(
  response: ApiResponse<T>,
  config: ResponseValidationConfig = {}
): T => {
  const {
    errorMessage,
    allowEmpty = false,
    customValidator,
    context = {}
  } = config;

  // Check for API-level errors first
  if (response.error) {
    throw new Error(response.error);
  }

  // Check for missing data
  if (!allowEmpty && (response.data === null || response.data === undefined)) {
    const defaultMessage = generateDefaultErrorMessage('NO_DATA', context);
    throw new Error(errorMessage || defaultMessage);
  }

  // Run custom validation if provided
  if (customValidator && !customValidator(response.data)) {
    const defaultMessage = generateDefaultErrorMessage('VALIDATION_FAILED', context);
    throw new Error(errorMessage || defaultMessage);
  }

  return response.data as T;
};

/**
 * Validates API response for array data
 * Ensures the response contains an array and optionally checks if it's not empty
 */
export const validateArrayResponse = <T>(
  response: ApiResponse<T[]>,
  config: ResponseValidationConfig & { allowEmptyArray?: boolean } = {}
): T[] => {
  const { allowEmptyArray = true, ...baseConfig } = config;
  
  const data = validateApiResponse(response, baseConfig);
  
  // Ensure data is an array
  if (!Array.isArray(data)) {
    const defaultMessage = generateDefaultErrorMessage('INVALID_ARRAY', baseConfig.context);
    throw new Error(baseConfig.errorMessage || defaultMessage);
  }

  // Check if empty array is allowed
  if (!allowEmptyArray && data.length === 0) {
    const defaultMessage = generateDefaultErrorMessage('EMPTY_ARRAY', baseConfig.context);
    throw new Error(baseConfig.errorMessage || defaultMessage);
  }

  return data;
};

/**
 * Validates API response for object data
 * Ensures the response contains an object and optionally validates specific properties
 */
export const validateObjectResponse = <T extends Record<string, any>>(
  response: ApiResponse<T>,
  config: ResponseValidationConfig & { requiredProperties?: (keyof T)[] } = {}
): T => {
  const { requiredProperties = [], ...baseConfig } = config;
  
  const data = validateApiResponse(response, baseConfig);
  
  // Ensure data is an object
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    const defaultMessage = generateDefaultErrorMessage('INVALID_OBJECT', baseConfig.context);
    throw new Error(baseConfig.errorMessage || defaultMessage);
  }

  // Check required properties
  for (const prop of requiredProperties) {
    if (!(prop in data) || data[prop] === undefined || data[prop] === null) {
      const defaultMessage = generateDefaultErrorMessage('MISSING_PROPERTY', {
        ...baseConfig.context,
        property: String(prop)
      });
      throw new Error(baseConfig.errorMessage || defaultMessage);
    }
  }

  return data;
};

/**
 * Validates API response for void operations (like delete)
 * Checks that the operation completed successfully
 */
export const validateVoidResponse = (
  response: ApiResponse<any>,
  config: ResponseValidationConfig = {}
): void => {
  // For void operations, we only care about errors, not data
  if (response.error) {
    throw new Error(response.error);
  }

  // Check for successful status codes
  if (response.status < 200 || response.status >= 300) {
    const defaultMessage = generateDefaultErrorMessage('OPERATION_FAILED', config.context);
    throw new Error(config.errorMessage || defaultMessage);
  }
};

/**
 * Generates default error messages based on error type and context
 */
const generateDefaultErrorMessage = (
  errorType: 'NO_DATA' | 'VALIDATION_FAILED' | 'INVALID_ARRAY' | 'EMPTY_ARRAY' | 'INVALID_OBJECT' | 'MISSING_PROPERTY' | 'OPERATION_FAILED',
  context: ResponseValidationConfig['context'] & { property?: string } = {}
): string => {
  const { operation, resource, id, property } = context;
  
  const resourceText = resource ? ` ${resource}` : '';
  const idText = id ? ` for ID: ${id}` : '';
  const operationText = operation ? ` during ${operation}` : '';
  const propertyText = property ? ` (missing property: ${property})` : '';

  switch (errorType) {
    case 'NO_DATA':
      return `No${resourceText} data received${idText}${operationText}`;
    
    case 'VALIDATION_FAILED':
      return `Invalid${resourceText} data received${idText}${operationText}`;
    
    case 'INVALID_ARRAY':
      return `Expected array of${resourceText} data but received invalid format${idText}${operationText}`;
    
    case 'EMPTY_ARRAY':
      return `No${resourceText} items found${idText}${operationText}`;
    
    case 'INVALID_OBJECT':
      return `Expected${resourceText} object but received invalid format${idText}${operationText}`;
    
    case 'MISSING_PROPERTY':
      return `Invalid${resourceText} data structure${propertyText}${idText}${operationText}`;
    
    case 'OPERATION_FAILED':
      return `Failed to complete${operationText}${resourceText ? ` on ${resource}` : ''}${idText}`;
    
    default:
      return `An error occurred${operationText}${resourceText}${idText}`;
  }
};

/**
 * Common response validation patterns for typical CRUD operations
 */
export const responseValidators = {
  /**
   * Validates response for GET operations that should return a single item
   */
  getById: <T>(response: ApiResponse<T>, resource: string, id: string): T => {
    return validateApiResponse(response, {
      context: { operation: 'fetch', resource, id }
    });
  },

  /**
   * Validates response for GET operations that should return an array
   */
  getList: <T>(response: ApiResponse<T[]>, resource: string, allowEmpty = true): T[] => {
    return validateArrayResponse(response, {
      allowEmptyArray: allowEmpty,
      context: { operation: 'fetch', resource }
    });
  },

  /**
   * Validates response for POST operations (create)
   */
  create: <T>(response: ApiResponse<T>, resource: string): T => {
    return validateApiResponse(response, {
      context: { operation: 'create', resource }
    });
  },

  /**
   * Validates response for PUT/PATCH operations (update)
   */
  update: <T>(response: ApiResponse<T>, resource: string, id: string): T => {
    return validateApiResponse(response, {
      context: { operation: 'update', resource, id }
    });
  },

  /**
   * Validates response for DELETE operations
   */
  delete: (response: ApiResponse<any>, resource: string, id: string): void => {
    return validateVoidResponse(response, {
      context: { operation: 'delete', resource, id }
    });
  }
};

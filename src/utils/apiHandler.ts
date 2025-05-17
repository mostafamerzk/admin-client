/**
 * API Handler Utility
 * 
 * Provides consistent handling of API responses and errors across the application.
 */

import type { ApiResponse, ApiError } from '../api/client';

/**
 * Handles API response and returns a standardized format
 * @param response The API response to handle
 * @returns A standardized response object
 */
export const handleApiResponse = <T>(response: ApiResponse<T>): {
  data: T | null;
  error: ApiError | null;
  isLoading: boolean;
} => {
  if (response.error) {
    return {
      data: null,
      error: {
        message: response.error,
        code: 'API_ERROR',
        status: response.status,
        details: response.metadata,
      },
      isLoading: false,
    };
  }

  return {
    data: response.data,
    error: null,
    isLoading: false,
  };
};

/**
 * Creates a loading state
 * @returns A loading state object
 */
export const createLoadingState = () => ({
  data: null,
  error: null,
  isLoading: true,
});

/**
 * Creates an error state
 * @param error The error to create a state for
 * @returns An error state object
 */
export const createErrorState = (error: ApiError) => ({
  data: null,
  error,
  isLoading: false,
});

/**
 * Creates a success state
 * @param data The data to create a state for
 * @returns A success state object
 */
export const createSuccessState = <T>(data: T) => ({
  data,
  error: null,
  isLoading: false,
});

/**
 * Type for the standard API state
 */
export interface ApiState<T> {
  data: T | null;
  error: ApiError | null;
  isLoading: boolean;
}

/**
 * Type for the standard API action
 */
export interface ApiAction<T> {
  type: 'LOADING' | 'SUCCESS' | 'ERROR';
  payload?: T | ApiError;
}

/**
 * Reducer for handling API state updates
 * @param state The current state
 * @param action The action to perform
 * @returns The new state
 */
export const apiReducer = <T>(state: ApiState<T>, action: ApiAction<T>): ApiState<T> => {
  switch (action.type) {
    case 'LOADING':
      return createLoadingState();
    case 'SUCCESS':
      return createSuccessState(action.payload as T);
    case 'ERROR':
      return createErrorState(action.payload as ApiError);
    default:
      return state;
  }
}; 
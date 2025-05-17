/**
 * Custom hook for using the API client with TypeScript support
 */

import { useState, useCallback } from 'react';
import apiClient from '../api/client';
import type { ApiResponse, ApiError } from '../api/client';
import type { ApiState, ApiAction } from '../utils/apiHandler';
import { apiReducer, createLoadingState } from '../utils/apiHandler';

/**
 * Custom hook for making API requests with TypeScript support
 * @param initialState Optional initial state
 * @returns An object containing the API state and request functions
 */
export function useApi<T = any>(initialState: Partial<ApiState<T>> = {}) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    error: null,
    isLoading: false,
    ...initialState,
  });

  const makeRequest = useCallback(async <R extends T>(
    requestFn: () => Promise<ApiResponse<R>>,
    options: {
      onSuccess?: (data: R) => void;
      onError?: (error: ApiError) => void;
    } = {}
  ) => {
    setState(createLoadingState());

    try {
      const response = await requestFn();
      
      if (response.error) {
        const error: ApiError = {
          message: response.error,
          code: 'API_ERROR',
          status: response.status,
          details: response.metadata,
        };
        setState(prev => apiReducer(prev, { type: 'ERROR', payload: error }));
        options.onError?.(error);
      } else {
        setState(prev => apiReducer(prev, { type: 'SUCCESS', payload: response.data }));
        options.onSuccess?.(response.data);
      }
    } catch (error) {
      const apiError: ApiError = {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: 'API_ERROR',
        status: 500,
        details: error,
      };
      setState(prev => apiReducer(prev, { type: 'ERROR', payload: apiError }));
      options.onError?.(apiError);
    }
  }, []);

  const get = useCallback(<R extends T>(
    url: string,
    config?: any,
    options?: {
      onSuccess?: (data: R) => void;
      onError?: (error: ApiError) => void;
    }
  ) => {
    return makeRequest<R>(
      () => apiClient.get<R>(url, config),
      options
    );
  }, [makeRequest]);

  const post = useCallback(<R extends T>(
    url: string,
    data?: any,
    config?: any,
    options?: {
      onSuccess?: (data: R) => void;
      onError?: (error: ApiError) => void;
    }
  ) => {
    return makeRequest<R>(
      () => apiClient.post<R>(url, data, config),
      options
    );
  }, [makeRequest]);

  const put = useCallback(<R extends T>(
    url: string,
    data?: any,
    config?: any,
    options?: {
      onSuccess?: (data: R) => void;
      onError?: (error: ApiError) => void;
    }
  ) => {
    return makeRequest<R>(
      () => apiClient.put<R>(url, data, config),
      options
    );
  }, [makeRequest]);

  const del = useCallback(<R extends T>(
    url: string,
    config?: any,
    options?: {
      onSuccess?: (data: R) => void;
      onError?: (error: ApiError) => void;
    }
  ) => {
    return makeRequest<R>(
      () => apiClient.delete<R>(url, config),
      options
    );
  }, [makeRequest]);

  const reset = useCallback(() => {
    setState(createLoadingState());
  }, []);

  return {
    ...state,
    get,
    post,
    put,
    delete: del,
    reset,
  };
}

export default useApi; 
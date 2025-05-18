/**
 * Custom hook for using the API client with TypeScript support
 */

import { useState, useCallback, useEffect } from 'react';
import { defaultApiClient, createApiClient } from '../api/client';
import type { ApiResponse } from '../api/client/types';

interface UseApiOptions<T> {
  url?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  config?: {
    cache?: boolean;
    retry?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
  };
}

interface UseApiState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  status: number | null;
  metadata: {
    timestamp: number | null;
    requestId: string | null;
  };
}

export function useApi<T = any>(options: UseApiOptions<T> = {}) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    error: null,
    loading: false,
    status: null,
    metadata: {
      timestamp: null,
      requestId: null,
    },
  });

  const execute = useCallback(async (overrideOptions?: Partial<UseApiOptions<T>>) => {
    const finalOptions = { ...options, ...overrideOptions };
    const { url, method = 'GET', data, config } = finalOptions;

    if (!url) {
      console.warn('useApi: No URL provided');
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      let response: ApiResponse<T>;

      switch (method) {
        case 'GET':
          response = await defaultApiClient.get<T>(url);
          break;
        case 'POST':
          response = await defaultApiClient.post<T>(url, data);
          break;
        case 'PUT':
          response = await defaultApiClient.put<T>(url, data);
          break;
        case 'DELETE':
          response = await defaultApiClient.delete<T>(url);
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }

      setState({
        data: response.data,
        error: response.error,
        loading: false,
        status: response.status,
        metadata: response.metadata || {
          timestamp: Date.now(),
          requestId: null,
        },
      });

      if (response.data && config?.onSuccess) {
        config.onSuccess(response.data);
      }
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
        status: error.response?.status || 500,
        metadata: {
          timestamp: Date.now(),
          requestId: error.config?.headers?.['x-request-id'] || null,
        },
      }));

      if (config?.onError) {
        config.onError(errorMessage);
      }
    }
  }, [options]);

  // Auto-execute if URL is provided
  useEffect(() => {
    if (options.url) {
      execute();
    }
  }, [options.url, execute]);

  return {
    ...state,
    execute,
    reset: () => setState({
      data: null,
      error: null,
      loading: false,
      status: null,
      metadata: {
        timestamp: null,
        requestId: null,
      },
    }),
  };
}

// Entity-specific hook for CRUD operations
export function useEntityApi<T = any>(baseUrl: string) {
  const {
    data,
    error,
    loading,
    status,
    metadata,
    execute,
    reset,
  } = useApi<T>();

  const create = useCallback((data: Partial<T>) => {
    return execute({
      url: baseUrl,
      method: 'POST',
      data,
    });
  }, [execute, baseUrl]);

  const read = useCallback((id?: string | number) => {
    const url = id ? `${baseUrl}/${id}` : baseUrl;
    return execute({
      url,
      method: 'GET',
    });
  }, [execute, baseUrl]);

  const update = useCallback((id: string | number, data: Partial<T>) => {
    return execute({
      url: `${baseUrl}/${id}`,
      method: 'PUT',
      data,
    });
  }, [execute, baseUrl]);

  const remove = useCallback((id: string | number) => {
    return execute({
      url: `${baseUrl}/${id}`,
      method: 'DELETE',
    });
  }, [execute, baseUrl]);

  return {
    data,
    error,
    loading,
    status,
    metadata,
    create,
    read,
    update,
    remove,
    reset,
  };
} 
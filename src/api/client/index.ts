import axios from 'axios';
import {
  API_URL,
  USE_MOCK_API,
  API_TIMEOUT,
  API_RETRY_ATTEMPTS,
  API_CACHE_TTL
} from '../../constants/config';
import mockApi from '../../services/mockApi';
import type { AxiosInstance, AxiosRequestConfig } from './types';
import type { ApiResponse, MiddlewareConfig, CacheConfig, RetryConfig } from './types';
import { authMiddleware, loggingMiddleware } from './middlewares';
import { CacheManager } from './cache';
import { setupInterceptors } from './interceptors';

// Default middlewares
const defaultMiddlewares: MiddlewareConfig[] = [
  authMiddleware,
  loggingMiddleware,
];

export class ApiClient {
  private instance: AxiosInstance;
  private middlewares: MiddlewareConfig[];
  private cacheManager: CacheManager;
  private retryConfig: RetryConfig;

  constructor(_baseURL: string = API_URL, middlewares: MiddlewareConfig[] = []) {
    this.middlewares = [
      ...defaultMiddlewares,
      ...middlewares,
    ];

    this.cacheManager = new CacheManager({
      enabled: true,
      ttl: API_CACHE_TTL,
    });

    this.retryConfig = {
      maxRetries: API_RETRY_ATTEMPTS,
      initialDelay: 1000,
      maxDelay: 10000,
    };

    if (USE_MOCK_API) {
      this.instance = mockApi as AxiosInstance;
    } else {
      this.instance = this.createApiInstance();
    }
  }

  private createApiInstance(): AxiosInstance {
    const instance = axios.create({
      baseURL: API_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest', // Helps with CORS
      },
      // Enable credentials for cross-origin requests
      withCredentials: false, // Set to true if your backend requires cookies
    });

    setupInterceptors(instance, this.middlewares, this.cacheManager, this.retryConfig);
    return instance;
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.get<T>(url, config);
      return {
        data: response.data,
        error: null,
        status: response.status,
        metadata: {
          timestamp: Date.now(),
          requestId: response.headers['x-request-id'] || Math.random().toString(36).substring(7),
        },
      };
    } catch (error: any) {
      // Better error message handling to prevent [object Object]
      let errorMessage = 'An unexpected error occurred';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error);
      }

      // Safely extract request ID
      let requestId: string;
      try {
        requestId = error.config?.headers?.['x-request-id'] ||
                   error.response?.headers?.['x-request-id'] ||
                   Math.random().toString(36).substring(7);
      } catch {
        requestId = Math.random().toString(36).substring(7);
      }

      return {
        data: null,
        error: errorMessage,
        status: error.response?.status || 500,
        metadata: {
          timestamp: Date.now(),
          requestId,
        },
      };
    }
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.post<T>(url, data, config);
      return {
        data: response.data,
        error: null,
        status: response.status,
        metadata: {
          timestamp: Date.now(),
          requestId: response.headers['x-request-id'] || Math.random().toString(36).substring(7),
        },
      };
    } catch (error: any) {
      // Safely extract request ID
      let requestId: string;
      try {
        requestId = error.config?.headers?.['x-request-id'] ||
                   error.response?.headers?.['x-request-id'] ||
                   Math.random().toString(36).substring(7);
      } catch {
        requestId = Math.random().toString(36).substring(7);
      }

      return {
        data: null,
        error: error.response?.data?.message || error.message,
        status: error.response?.status || 500,
        metadata: {
          timestamp: Date.now(),
          requestId,
        },
      };
    }
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.put<T>(url, data, config);
      return {
        data: response.data,
        error: null,
        status: response.status,
        metadata: {
          timestamp: Date.now(),
          requestId: response.headers['x-request-id'] || Math.random().toString(36).substring(7),
        },
      };
    } catch (error: any) {
      // Safely extract request ID
      let requestId: string;
      try {
        requestId = error.config?.headers?.['x-request-id'] ||
                   error.response?.headers?.['x-request-id'] ||
                   Math.random().toString(36).substring(7);
      } catch {
        requestId = Math.random().toString(36).substring(7);
      }

      return {
        data: null,
        error: error.response?.data?.message || error.message,
        status: error.response?.status || 500,
        metadata: {
          timestamp: Date.now(),
          requestId,
        },
      };
    }
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.delete<T>(url, config);
      return {
        data: response.data,
        error: null,
        status: response.status,
        metadata: {
          timestamp: Date.now(),
          requestId: response.headers['x-request-id'] || Math.random().toString(36).substring(7),
        },
      };
    } catch (error: any) {
      // Safely extract request ID
      let requestId: string;
      try {
        requestId = error.config?.headers?.['x-request-id'] ||
                   error.response?.headers?.['x-request-id'] ||
                   Math.random().toString(36).substring(7);
      } catch {
        requestId = Math.random().toString(36).substring(7);
      }

      return {
        data: null,
        error: error.response?.data?.message || error.message,
        status: error.response?.status || 500,
        metadata: {
          timestamp: Date.now(),
          requestId,
        },
      };
    }
  }

  public clearCache(): void {
    this.cacheManager.clear();
  }

  public setCacheConfig(config: Partial<CacheConfig>): void {
    this.cacheManager.updateConfig(config);
  }

  public setRetryConfig(config: Partial<RetryConfig>): void {
    this.retryConfig = { ...this.retryConfig, ...config };
  }

  public addMiddleware(middleware: MiddlewareConfig): void {
    this.middlewares.push(middleware);
  }

  public removeMiddleware(middleware: MiddlewareConfig): void {
    this.middlewares = this.middlewares.filter(m => m !== middleware);
  }
}

// Define createApiClient function after ApiClient class is fully defined
export const createApiClient = (
  baseURL: string = API_URL,
  middlewares: MiddlewareConfig[] = [],
  _config: {
    cache?: Partial<CacheConfig>;
    retry?: Partial<RetryConfig>;
  } = {}
) => {
  return new ApiClient(baseURL, [...defaultMiddlewares, ...middlewares]);
};

// Export a default instance after both ApiClient and createApiClient are defined
export const defaultApiClient = createApiClient();

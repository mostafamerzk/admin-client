import axios from 'axios';
import { API_URL, USE_MOCK_API } from '../../constants/config.ts';
import mockApi from '../../services/mockApi.ts';
import type { AxiosInstance, AxiosRequestConfig } from './types.ts';
import type { ApiResponse, MiddlewareConfig, CacheConfig, RetryConfig } from './types.ts';
import { authMiddleware, loggingMiddleware } from './middlewares.ts';
import { CacheManager } from './cache.ts';
import { setupInterceptors } from './interceptors';

export class ApiClient {
  private instance: AxiosInstance;
  private middlewares: MiddlewareConfig[];
  private cacheManager: CacheManager;
  private retryConfig: RetryConfig;

  constructor(baseURL: string = API_URL, middlewares: MiddlewareConfig[] = []) {
    this.middlewares = [
      authMiddleware,
      loggingMiddleware,
      ...middlewares,
    ];

    this.cacheManager = new CacheManager({
      enabled: true,
      ttl: 5 * 60 * 1000, // 5 minutes
    });

    this.retryConfig = {
      maxRetries: 3,
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
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
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
      return {
        data: null,
        error: error.response?.data?.message || error.message,
        status: error.response?.status || 500,
        metadata: {
          timestamp: Date.now(),
          requestId: error.config?.headers?.['x-request-id'] || Math.random().toString(36).substring(7),
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
      return {
        data: null,
        error: error.response?.data?.message || error.message,
        status: error.response?.status || 500,
        metadata: {
          timestamp: Date.now(),
          requestId: error.config?.headers?.['x-request-id'] || Math.random().toString(36).substring(7),
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
      return {
        data: null,
        error: error.response?.data?.message || error.message,
        status: error.response?.status || 500,
        metadata: {
          timestamp: Date.now(),
          requestId: error.config?.headers?.['x-request-id'] || Math.random().toString(36).substring(7),
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
      return {
        data: null,
        error: error.response?.data?.message || error.message,
        status: error.response?.status || 500,
        metadata: {
          timestamp: Date.now(),
          requestId: error.config?.headers?.['x-request-id'] || Math.random().toString(36).substring(7),
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
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from './types';
import type { MiddlewareConfig } from './types';
import { CacheManager } from './cache';
import { authApi } from '../../features/auth/api/authApi';

export const setupInterceptors = (
  instance: AxiosInstance,
  middlewares: MiddlewareConfig[],
  cacheManager: CacheManager,
  retryConfig: { maxRetries: number; initialDelay: number; maxDelay: number }
): void => {
  // Request interceptor
  instance.interceptors.request.use(
    async (config) => {
      // Handle caching (skip caching for users endpoint temporarily)
      if (cacheManager && config.method?.toLowerCase() === 'get' && !config.url?.includes('/users')) {
        const cacheKey = cacheManager.generateCacheKey(config);
        const cachedResponse = cacheManager.get(cacheKey);

        if (cachedResponse) {
          return Promise.reject({
            __CACHE_HIT__: true,
            data: cachedResponse.data,
            config: config, // Include config to prevent undefined access
            response: {
              data: cachedResponse.data,
              status: 200,
              headers: {}
            }
          });
        }
      }

      // Apply middlewares
      for (const middleware of middlewares) {
        if (middleware.onRequest) {
          config = await middleware.onRequest(config);
        }
      }
      return config;
    },
    async (error) => {
      for (const middleware of middlewares) {
        if (middleware.onError) {
          error = await middleware.onError(error);
        }
      }
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    async (response) => {
      // Cache successful GET responses (skip caching for users endpoint temporarily)
      if (cacheManager && response.config.method?.toLowerCase() === 'get' && !response.config.url?.includes('/users')) {
        const cacheKey = cacheManager.generateCacheKey(response.config);
        cacheManager.set(cacheKey, response.data);
      }

      for (const middleware of middlewares) {
        if (middleware.onResponse) {
          response = await middleware.onResponse(response);
        }
      }
      return response;
    },
    async (error) => {
      // Handle cache hits
      if ((error as any).__CACHE_HIT__) {
        return Promise.resolve({
          data: (error as any).data,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: (error as any).config || {}
        } as AxiosResponse);
      }

      // Handle authentication errors
      if (error.response?.status === 401) {
        authApi.removeToken();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // Handle server errors with retry logic
      if (error.response?.status && error.response.status >= 500) {
        const config = error.config as AxiosRequestConfig & { __retryCount?: number };
        config.__retryCount = config.__retryCount || 0;

        if (config.__retryCount < retryConfig.maxRetries) {
          config.__retryCount++;
          const delay = Math.min(
            retryConfig.initialDelay * Math.pow(2, config.__retryCount - 1),
            retryConfig.maxDelay
          );

          await new Promise(resolve => setTimeout(resolve, delay));
          return instance(config);
        }
      }

      for (const middleware of middlewares) {
        if (middleware.onError) {
          error = await middleware.onError(error);
        }
      }
      return Promise.reject(error);
    }
  );
}; 
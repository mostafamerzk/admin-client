import type { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig, AxiosInstance } from 'axios';

export type { 
  AxiosRequestConfig, 
  AxiosResponse, 
  AxiosError, 
  InternalAxiosRequestConfig,
  AxiosInstance 
};

export interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  status: number;
  metadata?: {
    timestamp: number;
    requestId: string;
    [key: string]: any;
  };
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: any;
}

export interface MiddlewareConfig {
  onRequest?: (config: InternalAxiosRequestConfig) => Promise<InternalAxiosRequestConfig>;
  onResponse?: (response: AxiosResponse) => Promise<AxiosResponse>;
  onError?: (error: AxiosError) => Promise<AxiosError>;
}

export interface CacheConfig {
  enabled: boolean;
  ttl: number;
}

export interface CacheEntry {
  data: any;
  timestamp: number;
}

export interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
} 
/**
 * Base API Service
 * 
 * This file provides a base API service for making HTTP requests.
 * It uses Axios for HTTP requests and includes interceptors for authentication and error handling.
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_URL } from '../constants/config.ts';

// Create Axios instance
const createApiInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  // Request interceptor for adding auth token
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for handling errors
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      // Handle authentication errors
      if (error.response?.status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }

      // Handle server errors
      if (error.response?.status && error.response.status >= 500) {
        console.error('Server error:', error);
        // Could dispatch to a notification system here
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Create API instance with the base URL
const baseApi = createApiInstance(API_URL);

export default baseApi;

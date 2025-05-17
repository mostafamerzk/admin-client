/**
 * API Service
 *
 * This file provides a centralized API service for making HTTP requests.
 * It uses Axios for HTTP requests and includes interceptors for authentication and error handling.
 * In development, it can use mock handlers instead of making real HTTP requests.
 */

import baseApi from './baseApi.ts';
import mockApi from './mockApi.ts';
import { USE_MOCK_API } from '../constants/config.ts';

// Export the API service
const api = USE_MOCK_API ? mockApi : baseApi;

export default api;

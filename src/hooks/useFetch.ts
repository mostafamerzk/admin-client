/**
 * useFetch Hook
 * 
 * This hook provides a convenient way to fetch data from the API.
 * It handles loading states, errors, and data caching.
 */

import { useState, useEffect, useCallback } from 'react';
import api from '../services/api.tsx';
import useNotification from './useNotification.tsx';

interface UseFetchOptions {
  initialData?: any;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  showErrorNotification?: boolean;
  errorMessage?: string;
}

const useFetch = <T = any>(
  url: string,
  options: UseFetchOptions = {}
) => {
  const [data, setData] = useState<T | null>(options.initialData || null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { showError } = useNotification();
  
  const fetchData = useCallback(async (params?: any) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api.get(url, { params });
      const responseData = response.data;
      
      setData(responseData);
      
      if (options.onSuccess) {
        options.onSuccess(responseData);
      }
      
      return responseData;
    } catch (err: any) {
      setError(err);
      
      if (options.onError) {
        options.onError(err);
      }
      
      if (options.showErrorNotification !== false) {
        const errorMsg = options.errorMessage || 
          err.response?.data?.message || 
          'An error occurred while fetching data';
        
        showError(errorMsg);
      }
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [url, options, showError]);
  
  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  return { data, isLoading, error, refetch: fetchData };
};

export default useFetch;

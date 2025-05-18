import { useState, useCallback, useEffect } from 'react';
import useNotification from './useNotification';

export interface EntityApi<T, IdType = string> {
  getAll: (params?: any) => Promise<T[]>;
  getById: (id: IdType) => Promise<T>;
  create: (data: any) => Promise<T>;
  update: (id: IdType, data: any) => Promise<T>;
  delete: (id: IdType) => Promise<void>;
}

export interface UseEntityDataOptions {
  entityName: string;
  initialFetch?: boolean;
}

export const useEntityData = <T, IdType = string>(
  apiService: EntityApi<T, IdType>,
  options: UseEntityDataOptions
) => {
  const [entities, setEntities] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showNotification } = useNotification();

  const fetchEntities = useCallback(async (params?: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.getAll(params);
      setEntities(data);
      return data;
    } catch (err) {
      const error = err as Error;
      setError(error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: `Failed to fetch ${options.entityName}`
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [apiService, options.entityName, showNotification]);

  const getEntityById = useCallback(async (id: IdType) => {
    setIsLoading(true);
    setError(null);
    try {
      const entity = await apiService.getById(id);
      return entity;
    } catch (err) {
      const error = err as Error;
      setError(error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: `Failed to fetch ${options.entityName}`
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [apiService, options.entityName, showNotification]);

  // Other common methods (create, update, delete)
  
  useEffect(() => {
    if (options.initialFetch !== false) {
      fetchEntities();
    }
  }, [fetchEntities, options.initialFetch]);

  return {
    entities,
    isLoading,
    error,
    fetchEntities,
    getEntityById,
    // Other methods
  };
};
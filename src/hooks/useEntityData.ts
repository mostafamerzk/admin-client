import { useState, useCallback, useEffect, useRef } from 'react';
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

  // Use refs to store current values and avoid stale closures
  const apiServiceRef = useRef(apiService);
  const showNotificationRef = useRef(showNotification);
  const entityNameRef = useRef(options.entityName);
  const hasInitialFetched = useRef(false);

  // Update refs when values change
  useEffect(() => {
    apiServiceRef.current = apiService;
    showNotificationRef.current = showNotification;
    entityNameRef.current = options.entityName;
  });

  const fetchEntities = useCallback(async (params?: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiServiceRef.current.getAll(params);
      setEntities(data);
      return data;
    } catch (err) {
      const error = err as Error;
      setError(error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: `Failed to fetch ${entityNameRef.current}`
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependencies needed due to refs

  const getEntityById = useCallback(async (id: IdType) => {
    setIsLoading(true);
    setError(null);
    try {
      const entity = await apiServiceRef.current.getById(id);
      return entity;
    } catch (err) {
      const error = err as Error;
      setError(error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: `Failed to fetch ${entityNameRef.current}`
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependencies needed due to refs

  const createEntity = useCallback(async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const newEntity = await apiServiceRef.current.create(data);
      setEntities(prev => [...prev, newEntity]);
      showNotificationRef.current({
        type: 'success',
        title: 'Success',
        message: `${entityNameRef.current} created successfully`
      });
      return newEntity;
    } catch (err) {
      const error = err as Error;
      setError(error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: `Failed to create ${entityNameRef.current}`
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateEntity = useCallback(async (id: IdType, data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedEntity = await apiServiceRef.current.update(id, data);
      setEntities(prev => prev.map(entity =>
        (entity as any).id === id ? updatedEntity : entity
      ));
      showNotificationRef.current({
        type: 'success',
        title: 'Success',
        message: `${entityNameRef.current} updated successfully`
      });
      return updatedEntity;
    } catch (err) {
      const error = err as Error;
      setError(error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: `Failed to update ${entityNameRef.current}`
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteEntity = useCallback(async (id: IdType) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiServiceRef.current.delete(id);
      setEntities(prev => prev.filter(entity => (entity as any).id !== id));
      showNotificationRef.current({
        type: 'success',
        title: 'Success',
        message: `${entityNameRef.current} deleted successfully`
      });
    } catch (err) {
      const error = err as Error;
      setError(error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: `Failed to delete ${entityNameRef.current}`
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch effect - runs only once
  useEffect(() => {
    if (options.initialFetch !== false && !hasInitialFetched.current) {
      console.log(`[useEntityData] Starting initial fetch for ${options.entityName}`);
      hasInitialFetched.current = true;

      const initialFetch = async () => {
        setIsLoading(true);
        setError(null);
        try {
          console.log(`[useEntityData] Calling API for ${options.entityName}`);
          const data = await apiService.getAll();
          console.log(`[useEntityData] Received data for ${options.entityName}:`, data);
          setEntities(data);
        } catch (err) {
          const error = err as Error;
          console.error(`[useEntityData] Error fetching ${options.entityName}:`, error);
          setError(error);
          showNotificationRef.current({
            type: 'error',
            title: 'Error',
            message: `Failed to fetch ${options.entityName}`
          });
        } finally {
          console.log(`[useEntityData] Finished fetch for ${options.entityName}`);
          setIsLoading(false);
        }
      };

      initialFetch();
    }
  }, [
    apiService,
    options.entityName,
    options.initialFetch
  ]); // Empty dependency array - runs only once on mount

  return {
    entities,
    isLoading,
    error,
    fetchEntities,
    getEntityById,
    createEntity,
    updateEntity,
    deleteEntity,
    setEntities // Expose setEntities for custom state updates
  };
};

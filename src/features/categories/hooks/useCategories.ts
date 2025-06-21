/**
 * Categories Hook
 * 
 * This hook provides methods and state for working with categories.
 */

import { useCallback, useMemo } from 'react';
import { useEntityData } from '../../../hooks/useEntityData';
import categoriesApi from '../api/categoriesApi';
import type { Category } from '../types';

export const useCategories = (options = { initialFetch: true }) => {
  // Create stable API service object to prevent unnecessary re-renders
  const apiService = useMemo(() => ({
    getAll: () => categoriesApi.getCategories(undefined, false), // Don't clear cache on every call
    getById: categoriesApi.getCategoryById,
    create: categoriesApi.createCategory,
    update: categoriesApi.updateCategory,
    delete: categoriesApi.deleteCategory
  }), []);

  const baseHook = useEntityData(apiService, {
    entityName: 'categories',
    initialFetch: options.initialFetch
  });
  
  // Note: useNotification is available through useEntityData if needed
  
  // Category-specific methods
  const getCategoryHierarchy = useCallback(() => {
    // In the flat structure, categories directly contain products
    return baseHook.entities as Category[];
  }, [baseHook.entities]);
  
  return {
    ...baseHook,
    categories: baseHook.entities as Category[],
    fetchCategories: baseHook.fetchEntities,
    getCategoryById: baseHook.getEntityById,
    getCategoryHierarchy
  };
};

export default useCategories;




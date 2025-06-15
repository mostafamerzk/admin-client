/**
 * Categories Hook
 * 
 * This hook provides methods and state for working with categories.
 */

import { useCallback } from 'react';
import { useEntityData } from '../../../hooks/useEntityData';
import categoriesApi from '../api/categoriesApi';
import type { Category } from '../types';

export const useCategories = (options = { initialFetch: true }) => {
  const baseHook = useEntityData({
    getAll: categoriesApi.getCategories,
    getById: categoriesApi.getCategoryById,
    create: categoriesApi.createCategory,
    update: categoriesApi.updateCategory,
    delete: categoriesApi.deleteCategory
  }, {
    entityName: 'categories',
    initialFetch: options.initialFetch
  });
  
  // Note: useNotification is available through useEntityData if needed
  
  // Category-specific methods
  const getCategoryHierarchy = useCallback(() => {
    // In the new hierarchy, all categories are top-level
    // Subcategories are now embedded within categories
    return (baseHook.entities as Category[]).map(category => ({
      ...category,
      subcategories: category.subcategories || []
    }));
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




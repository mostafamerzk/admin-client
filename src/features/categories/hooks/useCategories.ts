/**
 * Categories Hook
 * 
 * This hook provides methods and state for working with categories.
 */

import { useCallback } from 'react';
import { useEntityData } from '../../../hooks/useEntityData';
import categoriesApi from '../api/categoriesApi';
import type { Category, CategoryFormData } from '../types';
import useNotification from '../../../hooks/useNotification';

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
  
  const { showNotification } = useNotification();
  
  // Category-specific methods
  const getCategoryHierarchy = useCallback(() => {
    // Get parent categories (those without parentId)
    const parentCategories = (baseHook.entities as Category[]).filter(
      (category) => !category.parentId
    );
    
    // Create a map for quick lookup
    const categoryMap = new Map<string, Category & { subcategories: Category[] }>();
    
    // Initialize parent categories with empty subcategories array
    parentCategories.forEach(category => {
      categoryMap.set(category.id, { ...category as Category, subcategories: [] });
    });

    // Add subcategories to their parents
    (baseHook.entities as Category[]).forEach((category) => {
      if (category.parentId) {
        const parent = categoryMap.get(category.parentId);
        if (parent) {
          parent.subcategories.push(category);
        }
      }
    });
    
    return Array.from(categoryMap.values());
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




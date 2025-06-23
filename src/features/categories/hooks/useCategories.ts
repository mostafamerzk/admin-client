/**
 * Categories Hook
 *
 * This hook provides methods and state for working with categories.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type { Category, CategoryFormData } from '../types';
import categoriesApi from '../api/categoriesApi';
import useNotification from '../../../hooks/useNotification';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showNotification } = useNotification();

  // Use ref to avoid dependency issues with showNotification
  const showNotificationRef = useRef(showNotification);
  const hasInitialFetched = useRef(false);

  // Update ref when showNotification changes
  useEffect(() => {
    showNotificationRef.current = showNotification;
  });

  // Fetch all categories
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await categoriesApi.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch categories'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new category
  const createCategory = useCallback(async (categoryData: CategoryFormData, showNotifications: boolean = true) => {
    setIsLoading(true);
    setError(null);
    try {
      const newCategory = await categoriesApi.createCategory(categoryData);
      setCategories(prevCategories => [...prevCategories, newCategory]);
      if (showNotifications) {
        showNotificationRef.current({
          type: 'success',
          title: 'Success',
          message: 'Category created successfully'
        });
      }
      return newCategory;
    } catch (err) {
      setError(err as Error);
      // Don't show error notifications when showNotifications is false
      // Let the form error handler manage the error display
      if (showNotifications) {
        showNotificationRef.current({
          type: 'error',
          title: 'Error',
          message: 'Failed to create category'
        });
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update a category
  const updateCategory = useCallback(async (id: string, categoryData: Partial<CategoryFormData>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedCategory = await categoriesApi.updateCategory(id, categoryData);
      setCategories(prevCategories =>
        prevCategories.map(category => category.id === id ? updatedCategory : category)
      );
      showNotificationRef.current({
        type: 'success',
        title: 'Success',
        message: 'Category updated successfully'
      });
      return updatedCategory;
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to update category'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete a category
  const deleteCategory = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await categoriesApi.deleteCategory(id);
      setCategories(prevCategories => prevCategories.filter(category => category.id !== id));
      // Note: Success notification is handled by the calling component for better UX
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete category'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get category by ID
  const getCategoryById = useCallback(async (id: string, setLoadingState: boolean = true) => {
    if (setLoadingState) {
      setIsLoading(true);
    }
    setError(null);
    try {
      const category = await categoriesApi.getCategoryById(id);
      return category;
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch category details'
      });
      throw err;
    } finally {
      if (setLoadingState) {
        setIsLoading(false);
      }
    }
  }, []);

  // Update category status
  const updateCategoryStatus = useCallback(async (id: string, status: 'active' | 'inactive') => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedCategory = await categoriesApi.updateCategoryStatus(id, status);
      setCategories(prevCategories =>
        prevCategories.map(category => category.id === id ? updatedCategory : category)
      );
      showNotificationRef.current({
        type: 'success',
        title: 'Success',
        message: `Category ${status === 'active' ? 'activated' : 'deactivated'} successfully`
      });
      return updatedCategory;
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to update category status'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);



  // Category hierarchy helper (for backward compatibility)
  const getCategoryHierarchy = useCallback(() => {
    // In the flat structure, categories directly contain products
    return categories;
  }, [categories]);

  // Load categories on mount
  useEffect(() => {
    if (!hasInitialFetched.current) {
      hasInitialFetched.current = true;
      fetchCategories();
    }
  }, []);

  return {
    categories,
    isLoading,
    error,
    fetchCategories,
    getCategoryById,
    createCategory,
    createEntity: createCategory, // Alias for consistency with other patterns
    updateCategory,
    deleteCategory,
    deleteEntity: deleteCategory, // Alias for consistency with other patterns
    updateCategoryStatus,
    getCategoryHierarchy
  };
};

export default useCategories;




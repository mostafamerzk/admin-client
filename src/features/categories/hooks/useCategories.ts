/**
 * Categories Hook
 * 
 * This hook provides methods and state for working with categories.
 */

import { useState, useCallback, useEffect } from 'react';
import { Category, CategoryFormData } from '../types/index.ts';
import categoriesApi from '../api/categoriesApi.ts';
import useNotification from '../../../hooks/useNotification.ts';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showNotification } = useNotification();

  // Fetch all categories
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await categoriesApi.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch categories'
      });
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Create a new category
  const createCategory = useCallback(async (categoryData: CategoryFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newCategory = await categoriesApi.createCategory(categoryData);
      setCategories(prevCategories => [...prevCategories, newCategory]);
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'Category created successfully'
      });
      return newCategory;
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to create category'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Update a category
  const updateCategory = useCallback(async (id: string, categoryData: Partial<CategoryFormData>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedCategory = await categoriesApi.updateCategory(id, categoryData);
      setCategories(prevCategories => 
        prevCategories.map(category => category.id === id ? updatedCategory : category)
      );
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'Category updated successfully'
      });
      return updatedCategory;
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update category'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Delete a category
  const deleteCategory = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await categoriesApi.deleteCategory(id);
      setCategories(prevCategories => prevCategories.filter(category => category.id !== id));
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'Category deleted successfully'
      });
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete category'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Get subcategories for a category
  const getSubcategories = useCallback(async (parentId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const subcategories = await categoriesApi.getSubcategories(parentId);
      return subcategories;
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch subcategories'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    isLoading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getSubcategories
  };
};

export default useCategories;

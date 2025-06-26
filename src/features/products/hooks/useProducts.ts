/**
 * Products Hook
 * 
 * This hook provides methods and state for working with products.
 */

import { useCallback, useRef, useEffect, useMemo } from 'react';
import { useEntityData } from '../../../hooks/useEntityData';
import productsApi from '../api/productsApi';
import type { Product, ProductQueryParams, FrontendProductFormData } from '../types';
import useNotification from '../../../hooks/useNotification';

export const useProducts = (options = { initialFetch: true }) => {
  // Create stable API adapter to prevent unnecessary re-renders
  const apiAdapter = useMemo(() => ({
    getAll: async () => {
      const response = await productsApi.getProducts();
      return response.data; // Extract just the data array for useEntityData
    },
    getById: productsApi.getProductById,
    create: productsApi.createProduct,
    update: productsApi.updateProduct,
    delete: productsApi.deleteProduct
  }), []);

  const baseHook = useEntityData<Product>(apiAdapter, {
    entityName: 'products',
    initialFetch: options.initialFetch
  });

  // Use refs to store stable references to notification functions
  const { showNotification } = useNotification();
  const showNotificationRef = useRef(showNotification);

  // Update ref when function changes
  useEffect(() => {
    showNotificationRef.current = showNotification;
  }, [showNotification]);

  // Update product status using the unified update API
  const updateProductStatus = useCallback(async (id: string, status: 'active' | 'inactive' | 'out_of_stock') => {
    try {
      // For status updates, we'll use the stock field to determine status
      // Since backend derives status from stock (active if stock > 0, out_of_stock if stock = 0)
      const stockValue = status === 'out_of_stock' ? 0 : 1;
      await productsApi.updateProduct(id, { Stock: stockValue });

      // Update the local state manually
      baseHook.setEntities(prev => prev.map(product =>
        product.id === id ? { ...product, status } : product
      ));

      showNotificationRef.current({
        type: 'success',
        title: 'Success',
        message: 'Product status updated successfully'
      });
    } catch (error) {
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to update product status'
      });
      throw error;
    }
  }, [baseHook]);

  // Get products by category using the main getProducts API with category filter
  const getProductsByCategory = useCallback(async (categoryId: number, params?: Omit<ProductQueryParams, 'category'>): Promise<Product[]> => {
    try {
      if (!categoryId) {
        throw new Error('Category ID is required');
      }

      const searchParams = { ...params, category: categoryId };
      const response = await productsApi.getProducts(searchParams);
      return response.data;
    } catch (error) {
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch category products'
      });
      throw error;
    }
  }, []);







  // Enhanced update method using unified API
  const updateProductUnified = useCallback(async (
    id: string,
    formData: Partial<FrontendProductFormData>,
    showNotifications: boolean = true
  ): Promise<Product> => {
    try {
      const result = await productsApi.updateProductFromFrontend(id, formData);

      // Update local state
      baseHook.updateEntity(id, result);

      if (showNotifications) {
        // Dynamic success message based on operations performed
        let message = 'Product updated successfully';
        if (formData.newImages && formData.newImages.length > 0) {
          message += ` with ${formData.newImages.length} new image(s)`;
        }
        if (formData.imagesToDelete && formData.imagesToDelete.length > 0) {
          message += ` and ${formData.imagesToDelete.length} image(s) deleted`;
        }

        showNotificationRef.current({
          type: 'success',
          title: 'Success',
          message
        });
      }

      return result;
    } catch (error) {
      if (showNotifications) {
        showNotificationRef.current({
          type: 'error',
          title: 'Error',
          message: 'Failed to update product'
        });
      }
      throw error;
    }
  }, [baseHook]);



  return {
    ...baseHook,
    products: baseHook.entities as Product[], // Rename for clarity
    fetchProducts: baseHook.fetchEntities, // Rename for clarity
    getProductById: baseHook.getEntityById, // Rename for clarity
    updateProductStatus, // Product-specific status update
    updateProductUnified, // New unified update method
    getProductsByCategory // Category filter method
  };
};

export default useProducts;

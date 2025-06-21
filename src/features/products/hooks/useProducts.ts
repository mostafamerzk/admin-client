/**
 * Products Hook
 * 
 * This hook provides methods and state for working with products.
 */

import { useCallback, useRef, useEffect, useMemo } from 'react';
import { useEntityData } from '../../../hooks/useEntityData';
import productsApi from '../api/productsApi';
import type { Product, ProductFormData, ProductQueryParams, ImageUploadData, ImageDeletionData } from '../types';
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

  // Update product status
  const updateProductStatus = useCallback(async (id: string, status: 'active' | 'inactive' | 'out_of_stock') => {
    try {
      await productsApi.updateProductStatus(id, status);

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

  // Update product with enhanced error handling
  const updateProduct = useCallback(async (id: string, productData: Partial<ProductFormData>) => {
    try {
      const updatedProduct = await productsApi.updateProduct(id, productData);

      // Update the local state manually
      baseHook.setEntities(prev => prev.map(product =>
        product.id === id ? updatedProduct : product
      ));

      showNotificationRef.current({
        type: 'success',
        title: 'Success',
        message: 'Product updated successfully'
      });

      return updatedProduct;
    } catch (error) {
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to update product'
      });
      throw error;
    }
  }, [baseHook]);

  // Create product with enhanced error handling
  const createProduct = useCallback(async (productData: ProductFormData) => {
    try {
      const newProduct = await productsApi.createProduct(productData);

      // Add to local state manually
      baseHook.setEntities(prev => [...prev, newProduct]);

      showNotificationRef.current({
        type: 'success',
        title: 'Success',
        message: 'Product created successfully'
      });

      return newProduct;
    } catch (error) {
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to create product'
      });
      throw error;
    }
  }, [baseHook]);

  // Delete product with enhanced error handling
  const deleteProduct = useCallback(async (id: string) => {
    try {
      await productsApi.deleteProduct(id);

      // Remove from local state manually
      baseHook.setEntities(prev => prev.filter(product => product.id !== id));

      showNotificationRef.current({
        type: 'success',
        title: 'Success',
        message: 'Product deleted successfully'
      });
    } catch (error) {
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete product'
      });
      throw error;
    }
  }, [baseHook]);

  // Search products with pagination support
  const searchProducts = useCallback(async (query: string, params?: Omit<ProductQueryParams, 'search'>) => {
    try {
      return await productsApi.searchProducts(query, params);
    } catch (error) {
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to search products'
      });
      throw error;
    }
  }, []);

  // Get products with pagination
  const getProductsWithPagination = useCallback(async (params?: ProductQueryParams) => {
    try {
      return await productsApi.getProducts(params);
    } catch (error) {
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch products'
      });
      throw error;
    }
  }, []);

  // Get products by supplier
  const getProductsBySupplier = useCallback(async (supplierId: string, params?: Omit<ProductQueryParams, 'supplierId'>) => {
    try {
      return await productsApi.getProductsBySupplier(supplierId, params);
    } catch (error) {
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch supplier products'
      });
      throw error;
    }
  }, []);

  // Get products by category
  const getProductsByCategory = useCallback(async (categoryId: number, params?: Omit<ProductQueryParams, 'category'>) => {
    try {
      return await productsApi.getProductsByCategory(categoryId, params);
    } catch (error) {
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch category products'
      });
      throw error;
    }
  }, []);

  // Upload product images
  const uploadProductImages = useCallback(async (productId: string, files: File[], showNotifications: boolean = true): Promise<ImageUploadData> => {
    try {
      const result = await productsApi.uploadProductImages(productId, files);

      if (showNotifications) {
        showNotificationRef.current({
          type: 'success',
          title: 'Success',
          message: 'Product images uploaded successfully'
        });
      }

      return result;
    } catch (error) {
      if (showNotifications) {
        showNotificationRef.current({
          type: 'error',
          title: 'Error',
          message: 'Failed to upload product images'
        });
      }
      throw error;
    }
  }, []);

  // Delete product image
  const deleteProductImage = useCallback(async (productId: string, imageUrl: string, showNotifications: boolean = true): Promise<ImageDeletionData> => {
    try {
      const result = await productsApi.deleteProductImage(productId, imageUrl);

      if (showNotifications) {
        showNotificationRef.current({
          type: 'success',
          title: 'Success',
          message: 'Product image deleted successfully'
        });
      }

      return result;
    } catch (error) {
      if (showNotifications) {
        showNotificationRef.current({
          type: 'error',
          title: 'Error',
          message: 'Failed to delete product image'
        });
      }
      throw error;
    }
  }, []);

  return {
    ...baseHook,
    products: baseHook.entities as Product[], // Rename for clarity
    fetchProducts: baseHook.fetchEntities, // Rename for clarity
    getProductById: baseHook.getEntityById, // Rename for clarity
    createEntity: createProduct, // Expose create method
    deleteEntity: deleteProduct, // Expose delete method
    updateProductStatus, // Product-specific status update
    updateProduct, // Enhanced update method
    createProduct, // Enhanced create method
    deleteProduct, // Enhanced delete method
    searchProducts, // Search method
    getProductsWithPagination, // Pagination method
    getProductsBySupplier, // Supplier filter method
    getProductsByCategory, // Category filter method
    uploadProductImages, // Image upload method
    deleteProductImage // Image deletion method
  };
};

export default useProducts;

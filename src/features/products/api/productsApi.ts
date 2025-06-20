/**
 * Products API Service
 *
 * This file provides methods for interacting with the products API endpoints.
 */

import apiClient from '../../../api';
import { handleApiError } from '../../../utils/errorHandling';
import { ENDPOINTS } from '../../../constants/endpoints';
import type {
  Product,
  ProductFormData,
  FrontendProductFormData,
  ProductQueryParams,
  ProductStatusUpdate,
  ImageUploadData,
  ImageDeletionData,
  ApiResponseWrapper,
  ProductsListResponse,
  BackendProduct,
  PaginationInfo
} from '../types';
import {
  transformFrontendFormToBackend,
  transformProductsListResponse,
  transformProductResponse,
  transformQueryParamsToBackend,
  validateBackendResponse,
  extractErrorMessage
} from '../utils/productTransformers';

/**
 * Products API service with methods for managing product data
 */
export const productsApi = {
  /**
   * Get all products with optional filtering and pagination
   * @param params - Optional query parameters for filtering products
   * @returns Promise resolving to paginated product data with pagination info
   */
  getProducts: async (params?: ProductQueryParams): Promise<ApiResponseWrapper<Product[]> & { pagination?: PaginationInfo }> => {
    try {
      const backendParams = params ? transformQueryParamsToBackend(params) : {};
      const response = await apiClient.get(ENDPOINTS.PRODUCTS.BASE, { params: backendParams });

      // Handle API client error wrapper
      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error('No response data received');
      }

      // Validate and transform backend response
      const validatedResponse = validateBackendResponse<BackendProduct[] | ProductsListResponse>(response.data);
      return transformProductsListResponse(validatedResponse.data);
    } catch (error: any) {
      // Enhanced error handling for backend-specific errors
      if (error.response?.data) {
        const errorMessage = extractErrorMessage(error.response.data);
        throw new Error(errorMessage);
      }
      throw handleApiError(error);
    }
  },

  /**
   * Get a product by ID
   * @param id - The product ID (can be string or number, will convert to number for API)
   * @returns Promise resolving to the product data
   */
  getProductById: async (id: string): Promise<Product> => {
    try {
      if (!id) {
        throw new Error('Product ID is required');
      }

      // Use ID as-is for API call (backend expects string in URL)
      const response = await apiClient.get(ENDPOINTS.PRODUCTS.DETAILS(id));

      // Handle API client error wrapper
      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error('No response data received');
      }

      // Validate and transform backend response
      const validatedResponse = validateBackendResponse<BackendProduct>(response.data);
      return transformProductResponse(validatedResponse.data);
    } catch (error: any) {
      // Enhanced error handling for backend-specific errors
      if (error.response?.data) {
        const errorMessage = extractErrorMessage(error.response.data);
        throw new Error(errorMessage);
      }
      throw handleApiError(error);
    }
  },

  /**
   * Create a new product
   * @param productData - The product data to create (in backend format)
   * @returns Promise resolving to the created product
   */
  createProduct: async (productData: ProductFormData): Promise<Product> => {
    try {
      // Data is already in backend format, no transformation needed
      const response = await apiClient.post(ENDPOINTS.PRODUCTS.BASE, productData);

      // Handle API client error wrapper
      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error('No response data received');
      }

      // Validate and transform backend response
      const validatedResponse = validateBackendResponse<BackendProduct>(response.data);
      return transformProductResponse(validatedResponse.data);
    } catch (error: any) {
      // Enhanced error handling for backend-specific errors
      if (error.response?.data) {
        const errorMessage = extractErrorMessage(error.response.data);
        throw new Error(errorMessage);
      }
      throw handleApiError(error);
    }
  },

  /**
   * Create a new product from frontend form data
   * @param frontendFormData - The frontend form data to create
   * @returns Promise resolving to the created product
   */
  createProductFromFrontend: async (frontendFormData: FrontendProductFormData): Promise<Product> => {
    try {
      // Transform frontend data to backend format
      const backendData = transformFrontendFormToBackend(frontendFormData);
      return await productsApi.createProduct(backendData);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update a product
   * @param id - The product ID
   * @param productData - The product data to update (in backend format)
   * @returns Promise resolving to the updated product
   */
  updateProduct: async (id: string, productData: Partial<ProductFormData>): Promise<Product> => {
    try {
      if (!id) {
        throw new Error('Product ID is required');
      }

      // Data is already in backend format, no transformation needed
      const response = await apiClient.put(ENDPOINTS.PRODUCTS.UPDATE(id), productData);

      // Handle API client error wrapper
      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error('No response data received');
      }

      // Validate and transform backend response
      const validatedResponse = validateBackendResponse<BackendProduct>(response.data);
      return transformProductResponse(validatedResponse.data);
    } catch (error: any) {
      // Enhanced error handling for backend-specific errors
      if (error.response?.data) {
        const errorMessage = extractErrorMessage(error.response.data);
        throw new Error(errorMessage);
      }
      throw handleApiError(error);
    }
  },

  /**
   * Update a product from frontend form data
   * @param id - The product ID
   * @param frontendFormData - The frontend form data to update
   * @returns Promise resolving to the updated product
   */
  updateProductFromFrontend: async (id: string, frontendFormData: Partial<FrontendProductFormData>): Promise<Product> => {
    try {
      if (!id) {
        throw new Error('Product ID is required');
      }

      // Transform frontend data to backend format
      const backendData = transformFrontendFormToBackend(frontendFormData as FrontendProductFormData);
      return await productsApi.updateProduct(id, backendData);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete a product
   * @param id - The product ID
   * @returns Promise resolving when the product is deleted
   */
  deleteProduct: async (id: string): Promise<void> => {
    try {
      if (!id) {
        throw new Error('Product ID is required');
      }

      const response = await apiClient.delete(ENDPOINTS.PRODUCTS.DELETE(id));

      // Handle API client error wrapper
      if (response.error) {
        throw new Error(response.error);
      }

      // For delete operations, we don't expect data back
      return;
    } catch (error: any) {
      // Enhanced error handling for backend-specific errors
      if (error.response?.data) {
        const errorMessage = extractErrorMessage(error.response.data);
        throw new Error(errorMessage);
      }
      throw handleApiError(error);
    }
  },

  /**
   * Update product status
   * @param id - The product ID
   * @param status - The new status
   * @returns Promise resolving when the status is updated
   */
  updateProductStatus: async (id: string, status: ProductStatusUpdate['status']): Promise<void> => {
    try {
      if (!id) {
        throw new Error('Product ID is required');
      }

      const response = await apiClient.put(ENDPOINTS.PRODUCTS.STATUS(id), { status });

      // Handle API client error wrapper
      if (response.error) {
        throw new Error(response.error);
      }

      // Status update doesn't return data
      return;
    } catch (error: any) {
      // Enhanced error handling for backend-specific errors
      if (error.response?.data) {
        const errorMessage = extractErrorMessage(error.response.data);
        throw new Error(errorMessage);
      }
      throw handleApiError(error);
    }
  },

  /**
   * Search products
   * @param query - Search query
   * @param params - Additional query parameters
   * @returns Promise resolving to search results
   */
  searchProducts: async (query: string, params?: Omit<ProductQueryParams, 'search'>): Promise<ApiResponseWrapper<Product[]>> => {
    try {
      const searchParams = { ...params, search: query };
      return await productsApi.getProducts(searchParams);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get products by supplier
   * @param supplierId - The supplier ID
   * @param params - Additional query parameters
   * @returns Promise resolving to supplier's products
   */
  getProductsBySupplier: async (supplierId: string, params?: Omit<ProductQueryParams, 'supplierId'>): Promise<Product[]> => {
    try {
      if (!supplierId) {
        throw new Error('Supplier ID is required');
      }

      const searchParams = { ...params, supplierId };
      const response = await productsApi.getProducts(searchParams);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get products by category
   * @param categoryId - The category ID (number)
   * @param params - Additional query parameters
   * @returns Promise resolving to category products
   */
  getProductsByCategory: async (categoryId: number, params?: Omit<ProductQueryParams, 'category'>): Promise<Product[]> => {
    try {
      if (!categoryId) {
        throw new Error('Category ID is required');
      }

      const searchParams = { ...params, category: categoryId };
      const response = await productsApi.getProducts(searchParams);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Upload product images
   * @param productId - The product ID
   * @param files - Array of image files
   * @returns Promise resolving to upload response
   */
  uploadProductImages: async (productId: string, files: File[]): Promise<ImageUploadData> => {
    try {
      if (!productId) {
        throw new Error('Product ID is required');
      }

      if (!files || files.length === 0) {
        throw new Error('At least one image file is required');
      }

      const formData = new FormData();
      files.forEach((file) => {
        formData.append(`images`, file);
      });

      const response = await apiClient.post(ENDPOINTS.PRODUCTS.UPLOAD_IMAGES(productId), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle API client error wrapper
      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error('No response data received');
      }

      // Validate backend response
      const validatedResponse = validateBackendResponse<ImageUploadData>(response.data);
      return validatedResponse.data;
    } catch (error: any) {
      // Enhanced error handling for backend-specific errors
      if (error.response?.data) {
        const errorMessage = extractErrorMessage(error.response.data);
        throw new Error(errorMessage);
      }
      throw handleApiError(error);
    }
  },

  /**
   * Delete a product image
   * @param productId - The product ID
   * @param imageUrl - The image URL to delete
   * @returns Promise resolving to deletion response
   */
  deleteProductImage: async (productId: string, imageUrl: string): Promise<ImageDeletionData> => {
    try {
      if (!productId) {
        throw new Error('Product ID is required');
      }

      if (!imageUrl) {
        throw new Error('Image URL is required');
      }

      const response = await apiClient.delete(ENDPOINTS.PRODUCTS.DELETE_IMAGE(productId), {
        data: {
          imageUrl
        }
      });

      // Handle API client error wrapper
      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error('No response data received');
      }

      // Validate backend response
      const validatedResponse = validateBackendResponse<ImageDeletionData>(response.data);
      return validatedResponse.data;
    } catch (error: any) {
      // Enhanced error handling for backend-specific errors
      if (error.response?.data) {
        const errorMessage = extractErrorMessage(error.response.data);
        throw new Error(errorMessage);
      }
      throw handleApiError(error);
    }
  }
};

// Export individual methods for more flexible importing
export const {
  getProducts,
  getProductById,
  createProduct,
  createProductFromFrontend,
  updateProduct,
  updateProductFromFrontend,
  deleteProduct,
  updateProductStatus,
  searchProducts,
  getProductsBySupplier,
  getProductsByCategory,
  uploadProductImages,
  deleteProductImage
} = productsApi;

export default productsApi;

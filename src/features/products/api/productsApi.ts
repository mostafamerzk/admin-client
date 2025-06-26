/**
 * Products API Service
 *
 * This file provides methods for interacting with the products API endpoints.
 */

import apiClient from '../../../api';
import { handleApiError } from '../../../utils/errorHandling';
import { requestDeduplicator } from '../../../utils/requestDeduplication';
import { ENDPOINTS } from '../../../constants/endpoints';
import type {
  Product,
  ProductFormData,
  FrontendProductFormData,
  ProductQueryParams,
  ApiResponseWrapper,
  ProductsListResponse,
  BackendProduct,
  PaginationInfo,
  UnifiedProductResponse
} from '../types';
import {
  transformPartialFrontendFormToBackend,
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
    const key = requestDeduplicator.generateApiKey('/products', 'GET', params);
    return requestDeduplicator.execute(key, async () => {
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
    });
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
   * Update a product using the unified API pattern
   * Supports text updates, image uploads, and image deletions in a single atomic operation
   * @param id - The product ID
   * @param productData - The product data to update (in backend format)
   * @param newImages - Optional array of new image files to upload
   * @param imagesToDelete - Optional array of image URLs to delete
   * @returns Promise resolving to the updated product
   */
  updateProduct: async (
    id: string,
    productData: Partial<ProductFormData>,
    newImages?: File[],
    imagesToDelete?: string[]
  ): Promise<Product> => {
    try {
      if (!id) {
        throw new Error('Product ID is required');
      }

      // Check if we need to use multipart/form-data (when images are involved)
      const hasImageOperations = (newImages && newImages.length > 0) || (imagesToDelete && imagesToDelete.length > 0);

      if (hasImageOperations) {
        // Use FormData for multipart request when images are involved
        const formData = new FormData();

        // Add text fields if provided
        if (productData.Name !== undefined) {
          formData.append('Name', productData.Name);
        }
        if (productData.Description !== undefined) {
          formData.append('Description', productData.Description);
        }

        // For numeric fields, ensure they are valid numbers before sending
        // The backend will parse these string values back to numbers
        if (productData.Price !== undefined) {
          const price = Number(productData.Price);
          if (!isNaN(price) && price >= 0) {
            formData.append('Price', price.toString());
          }
        }
        if (productData.Stock !== undefined) {
          const stock = Number(productData.Stock);
          if (!isNaN(stock) && Number.isInteger(stock) && stock >= 0) {
            formData.append('Stock', stock.toString());
          }
        }
        if (productData.MinimumStock !== undefined) {
          const minimumStock = Number(productData.MinimumStock);
          if (!isNaN(minimumStock) && Number.isInteger(minimumStock) && minimumStock >= 0) {
            formData.append('MinimumStock', minimumStock.toString());
          }
        }
        if (productData.CategoryId !== undefined) {
          const categoryId = Number(productData.CategoryId);
          if (!isNaN(categoryId) && Number.isInteger(categoryId) && categoryId > 0) {
            formData.append('CategoryId', categoryId.toString());
          }
        }
        if (productData.SupplierId !== undefined) {
          formData.append('SupplierId', productData.SupplierId);
        }

        // Always send attributes as array (empty array if none)
        formData.append('Attributes', JSON.stringify(productData.Attributes || []));

        // Always send variants as array (empty array if none)
        formData.append('Variants', JSON.stringify(productData.Variants || []));

        // Add new images
        if (newImages && newImages.length > 0) {
          newImages.forEach((file) => {
            formData.append('images', file);
          });
        }

        // Add images to delete
        if (imagesToDelete && imagesToDelete.length > 0) {
          formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
        }

        const response = await apiClient.put(ENDPOINTS.PRODUCTS.UPDATE(id), formData, {
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

        // Validate and transform backend response
        const validatedResponse = validateBackendResponse<UnifiedProductResponse>(response.data);
        return transformProductResponse(validatedResponse.data);
      } else {
        // Use JSON for text-only updates (backward compatibility)
        // Ensure data is in correct backend format by filtering out undefined values
        const cleanedData: Partial<ProductFormData> = {};

        // Only include defined fields with correct capitalized names
        if (productData.Name !== undefined) cleanedData.Name = productData.Name;
        if (productData.Description !== undefined) cleanedData.Description = productData.Description;
        if (productData.Price !== undefined) cleanedData.Price = productData.Price;
        if (productData.Stock !== undefined) cleanedData.Stock = productData.Stock;
        if (productData.MinimumStock !== undefined) cleanedData.MinimumStock = productData.MinimumStock;
        if (productData.CategoryId !== undefined) cleanedData.CategoryId = productData.CategoryId;
        if (productData.SupplierId !== undefined) cleanedData.SupplierId = productData.SupplierId;
        if (productData.CustomerId !== undefined) cleanedData.CustomerId = productData.CustomerId;
        if (productData.Attributes !== undefined) cleanedData.Attributes = productData.Attributes;
        if (productData.Variants !== undefined) cleanedData.Variants = productData.Variants;

        const response = await apiClient.put(ENDPOINTS.PRODUCTS.UPDATE(id), cleanedData);

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
      }
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
   * Update a product from frontend form data using the unified API pattern
   * @param id - The product ID
   * @param frontendFormData - The frontend form data to update
   * @returns Promise resolving to the updated product
   */
  updateProductFromFrontend: async (id: string, frontendFormData: Partial<FrontendProductFormData>): Promise<Product> => {
    try {
      if (!id) {
        throw new Error('Product ID is required');
      }

      // Transform frontend data to backend format using partial transformation
      const backendData = transformPartialFrontendFormToBackend(frontendFormData);

      // Extract image operations from frontend form data
      const newImages = frontendFormData.newImages || [];
      const imagesToDelete = frontendFormData.imagesToDelete || [];

      return await productsApi.updateProduct(id, backendData, newImages, imagesToDelete);
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








};

// Export individual methods for more flexible importing
export const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateProductFromFrontend,
  deleteProduct
} = productsApi;

export default productsApi;

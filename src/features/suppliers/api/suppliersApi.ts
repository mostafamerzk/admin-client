/**
 * Suppliers API Service
 *
 * This file provides methods for interacting with the suppliers API endpoints.
 */

import apiClient from '../../../api';
import { handleApiError } from '../../../utils/errorHandling';
import { responseValidators } from '../../../utils/apiHelpers';
import type {
  Supplier,
  SupplierFormData,
  SupplierProduct,
  SupplierDocument,
  SupplierAnalyticsData,
  BackendSupplier,
  ApiResponseWrapper,
  SuppliersListResponse,
  SupplierQueryParams,
  SupplierProductsResponse,
  BackendSupplierProduct
} from '../types';

// Helper function to transform backend supplier to frontend format
const transformBackendSupplier = (backendSupplier: BackendSupplier): Supplier => {
  return {
    id: backendSupplier.id,
    name: backendSupplier.name || '',
    email: backendSupplier.email,
    phone: backendSupplier.phone || '',
    address: backendSupplier.address || '',
    status: backendSupplier.status === 'banned' ? 'banned' : 'active',
    verificationStatus: backendSupplier.verificationStatus === 'verified' ? 'verified' : 'pending',
    categories: backendSupplier.categories ? [backendSupplier.categories] : [],
    contactPerson: backendSupplier.contactPerson,
    // Handle both 'logo' (from API responses) and 'image' (from creation/update) fields
    logo: backendSupplier.logo || backendSupplier.image || '',
    website: ''
  };
};

// Helper function to transform backend supplier product to frontend format
const transformBackendSupplierProduct = (backendProduct: BackendSupplierProduct): SupplierProduct => ({
  id: backendProduct.id.toString(), // Ensure string ID
  name: backendProduct.name,
  sku: backendProduct.sku,
  category: backendProduct.category,
  price: backendProduct.price,
  stock: backendProduct.stock,
  minimumStock: backendProduct.minimumStock || 10, // Use backend value or default
  status: backendProduct.status,
  description: backendProduct.description || '',
  image: backendProduct.image || '',
  images: backendProduct.images || (backendProduct.image ? [backendProduct.image] : []),
  attributes: backendProduct.attributes || [],
  variants: backendProduct.variants || [],
  // Handle both createdAt/updatedAt (actual API fields) and createdDate/updatedDate (legacy)
  createdAt: backendProduct.createdAt || backendProduct.createdDate || new Date().toISOString(),
  updatedAt: backendProduct.updatedAt || backendProduct.updatedDate || new Date().toISOString()
});

export const suppliersApi = {
  /**
   * Get all suppliers with pagination and filtering
   */
  getSuppliers: async (params?: SupplierQueryParams): Promise<Supplier[]> => {
    try {
      const response = await apiClient.get<SuppliersListResponse | BackendSupplier[]>('/suppliers', { params });

      // Handle wrapped response format
      if (response.data && 'success' in response.data && response.data.success) {
        const wrappedResponse = response.data as SuppliersListResponse;
        // Check if data.data has suppliers array (new format)
        if (wrappedResponse.data && 'suppliers' in wrappedResponse.data) {
          const backendSuppliers = wrappedResponse.data.suppliers;
          return backendSuppliers.map(transformBackendSupplier);
        }
        // Fallback: data.data is directly an array (old format)
        else if (Array.isArray(wrappedResponse.data)) {
          const suppliersArray = wrappedResponse.data as BackendSupplier[];
          return suppliersArray.map(transformBackendSupplier);
        }
        // Fallback: empty array if no suppliers found
        else {
          return [];
        }
      } else {
        // Fallback for non-wrapped responses (legacy support)
        const suppliers = Array.isArray(response.data) ? response.data as BackendSupplier[] : [];
        return suppliers.map(transformBackendSupplier);
      }
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get a supplier by ID
   */
  getSupplierById: async (id: string): Promise<Supplier> => {
    try {
      const response = await apiClient.get<ApiResponseWrapper<BackendSupplier>>(`/suppliers/${id}`);

      // Handle wrapped response format
      if (response.data && 'success' in response.data && response.data.success) {
        return transformBackendSupplier(response.data.data);
      } else {
        // Fallback for non-wrapped responses (legacy support)
        const supplier = response.data as unknown as BackendSupplier;
        return transformBackendSupplier(supplier);
      }
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create a new supplier
   */
  createSupplier: async (supplierData: SupplierFormData): Promise<Supplier> => {
    try {
      // Transform form data to match backend API requirements
      const apiData = {
        email: supplierData.email, // Required
        password: supplierData.password, // Required
        contactPerson: supplierData.contactPerson || supplierData.supplierName || '', // Required
        name: supplierData.name || supplierData.supplierName, // Optional business name
        phone: supplierData.phone, // Optional
        address: supplierData.address, // Optional
        categories: supplierData.categories || supplierData.businessType, // Optional single category
        image: supplierData.image // Optional base64 encoded image
      };

      const response = await apiClient.post<ApiResponseWrapper<BackendSupplier>>('/suppliers', apiData);

      // Handle wrapped response format
      if (response.data && 'success' in response.data && response.data.success) {
        return transformBackendSupplier(response.data.data);
      } else {
        // Fallback for non-wrapped responses (legacy support)
        const supplier = response.data as unknown as BackendSupplier;
        return transformBackendSupplier(supplier);
      }
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update a supplier
   */
  updateSupplier: async (id: string, supplierData: Partial<SupplierFormData>): Promise<Supplier> => {
    try {
      // Transform form data to match API expectations
      const apiData: any = {};
      if (supplierData.supplierName) apiData.name = supplierData.supplierName;
      if (supplierData.email) apiData.email = supplierData.email;
      if (supplierData.phone) apiData.phone = supplierData.phone;
      if (supplierData.address) apiData.address = supplierData.address;
      if (supplierData.businessType) apiData.categories = [supplierData.businessType];
      if (supplierData.image) apiData.image = supplierData.image;

      const response = await apiClient.put<Supplier>(`/suppliers/${id}`, apiData);
      return responseValidators.update(response, 'supplier', id);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete a supplier
   */
  deleteSupplier: async (id: string): Promise<void> => {
    try {
      const response = await apiClient.delete(`/suppliers/${id}`);
      return responseValidators.delete(response, 'supplier', id);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update supplier verification status
   */
  updateVerificationStatus: async (id: string, status: 'verified' | 'pending'): Promise<Supplier> => {
    try {
      // Use the correct backend endpoint
      const response = await apiClient.put<ApiResponseWrapper<BackendSupplier>>(`/suppliers/${id}/verification-status`, {
        verificationStatus: status
      });

      // Handle wrapped response format
      if (response.data && 'success' in response.data && response.data.success) {
        return transformBackendSupplier(response.data.data);
      } else {
        // Fallback for non-wrapped responses (legacy support)
        const supplier = response.data as unknown as BackendSupplier;
        return transformBackendSupplier(supplier);
      }
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get suppliers by verification status
   */
  getSuppliersByVerificationStatus: async (status: 'verified' | 'pending' | 'rejected'): Promise<Supplier[]> => {
    try {
      const response = await apiClient.get<Supplier[]>('/suppliers', { params: { verificationStatus: status } });
      if (!response.data) {
        throw new Error(`No suppliers found with status: ${status}`);
      }
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get supplier products with pagination
   */
  getSupplierProducts: async (supplierId: string, params?: { page?: number; limit?: number }): Promise<SupplierProduct[]> => {
    try {
      const response = await apiClient.get<SupplierProductsResponse | BackendSupplierProduct[]>(`/suppliers/${supplierId}/products`, { params });

      // Handle wrapped response format
      if (response.data && 'success' in response.data && response.data.success) {
        const wrappedResponse = response.data as SupplierProductsResponse;
        // Check if data.data has products array (new format)
        if (wrappedResponse.data && 'products' in wrappedResponse.data) {
          const backendProducts = wrappedResponse.data.products;
          return backendProducts.map(transformBackendSupplierProduct);
        }
        // Fallback: data.data is directly an array (old format)
        else if (Array.isArray(wrappedResponse.data)) {
          const productsArray = wrappedResponse.data as BackendSupplierProduct[];
          return productsArray.map(transformBackendSupplierProduct);
        }
        // Fallback: empty array if no products found
        else {
          return [];
        }
      } else {
        // Fallback for non-wrapped responses (legacy support)
        const products = Array.isArray(response.data) ? response.data as BackendSupplierProduct[] : [];
        return products.map(transformBackendSupplierProduct);
      }
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get a single product by ID
   */
  getProductById: async (productId: string): Promise<SupplierProduct> => {
    try {
      const response = await apiClient.get<SupplierProduct>(`/products/${productId}`);
      if (!response.data) {
        throw new Error(`No product data received for ID: ${productId}`);
      }
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update a product
   */
  updateProduct: async (productId: string, productData: Partial<SupplierProduct>): Promise<SupplierProduct> => {
    try {
      const response = await apiClient.put<SupplierProduct>(`/products/${productId}`, productData);
      if (!response.data) {
        throw new Error(`Failed to update product ${productId}`);
      }
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Upload product images
   */
  uploadProductImages: async (productId: string, files: File[]): Promise<{ imageUrls: string[] }> => {
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`images[${index}]`, file);
      });

      const response = await apiClient.post<{ imageUrls: string[] }>(`/products/${productId}/upload-images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (!response.data) {
        throw new Error('Failed to upload product images');
      }
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get supplier documents
   * TEMPORARY: Returns empty array if endpoint returns 404 (under development)
   */
  getSupplierDocuments: async (supplierId: string, params?: Record<string, any>): Promise<SupplierDocument[]> => {
    try {
      const response = await apiClient.get<SupplierDocument[]>(`/suppliers/${supplierId}/documents`, { params });
      if (!response.data) {
        return []; // Return empty array instead of throwing error
      }
      return response.data;
    } catch (error: any) {
      // Gracefully handle 404 errors for endpoints under development
      if (error.response?.status === 404 || error.status === 404) {
        console.warn(`[TEMP] Documents endpoint not yet implemented for supplier ${supplierId}`);
        return []; // Return empty array for 404s
      }
      throw handleApiError(error);
    }
  },

  /**
   * Get supplier analytics
   * TEMPORARY: Returns null if endpoint returns 404 (under development)
   */
  getSupplierAnalytics: async (supplierId: string, params?: Record<string, any>): Promise<SupplierAnalyticsData | null> => {
    try {
      const response = await apiClient.get<SupplierAnalyticsData>(`/suppliers/${supplierId}/analytics`, { params });
      if (!response.data) {
        return null; // Return null instead of throwing error
      }
      return response.data;
    } catch (error: any) {
      // Gracefully handle 404 errors for endpoints under development
      if (error.response?.status === 404 || error.status === 404) {
        console.warn(`[TEMP] Analytics endpoint not yet implemented for supplier ${supplierId}`);
        return null; // Return null for 404s
      }
      throw handleApiError(error);
    }
  },

  /**
   * Upload supplier logo/image
   */
  uploadSupplierImage: async (supplierId: string, file: File): Promise<{ imageUrl: string }> => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await apiClient.post<{ imageUrl: string }>(`/suppliers/${supplierId}/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (!response.data) {
        throw new Error('Failed to upload supplier image');
      }
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Ban a supplier
   */
  banSupplier: async (id: string): Promise<Supplier> => {
    try {
      const response = await apiClient.put<ApiResponseWrapper<BackendSupplier>>(`/suppliers/${id}/ban`, { status: 'banned' });

      // Handle wrapped response format
      if (response.data && 'success' in response.data && response.data.success) {
        return transformBackendSupplier(response.data.data);
      } else {
        // Fallback for non-wrapped responses (legacy support)
        const supplier = response.data as unknown as BackendSupplier;
        return transformBackendSupplier(supplier);
      }
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Unban a supplier (reactivate)
   */
  unbanSupplier: async (id: string): Promise<Supplier> => {
    try {
      const response = await apiClient.put<ApiResponseWrapper<BackendSupplier>>(`/suppliers/${id}/unban`);

      // Handle wrapped response format
      if (response.data && 'success' in response.data && response.data.success) {
        return transformBackendSupplier(response.data.data);
      } else {
        // Fallback for non-wrapped responses (legacy support)
        const supplier = response.data as unknown as BackendSupplier;
        return transformBackendSupplier(supplier);
      }
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

export default suppliersApi;

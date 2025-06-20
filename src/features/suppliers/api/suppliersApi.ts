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
  SupplierDocument,
  SupplierAnalyticsData,
  SupplierProduct,
  BackendSupplier,
  ApiResponseWrapper,
  SuppliersListResponse,
  SupplierQueryParams
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

// Helper function to transform backend product to SupplierProduct format
const transformBackendProduct = (backendProduct: any): SupplierProduct => {
  return {
    id: String(backendProduct.id || backendProduct.Id || ''),
    name: backendProduct.name || backendProduct.Name || '',
    sku: backendProduct.sku || backendProduct.SKU || '',
    category: backendProduct.category || backendProduct.Category || '',
    price: Number(backendProduct.price || backendProduct.Price || 0),
    stock: Number(backendProduct.stock || backendProduct.Stock || 0),
    minimumStock: Number(backendProduct.minimumStock || backendProduct.MinimumStock || 0),
    status: (backendProduct.status || backendProduct.Status || 'active') as 'active' | 'inactive' | 'out_of_stock',
    description: backendProduct.description || backendProduct.Description || '',
    image: backendProduct.image || backendProduct.Image || null,
    createdAt: backendProduct.createdAt || backendProduct.CreatedAt || new Date().toISOString(),
    updatedAt: backendProduct.updatedAt || backendProduct.UpdatedAt || new Date().toISOString()
  };
};



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
   * Get supplier products
   * TEMPORARY: Returns empty array if endpoint returns 404 (under development)
   */
  getSupplierProducts: async (supplierId: string, params?: Record<string, any>): Promise<SupplierProduct[]> => {
    try {
      const response = await apiClient.get<any>(`/suppliers/${supplierId}/products`, { params });
      if (!response.data) {
        return []; // Return empty array instead of throwing error
      }

      // Handle nested response structure: response.data.data.products
      let rawProducts: any[] = [];

      if (response.data.data && response.data.data.products) {
        // Nested structure: { data: { data: { products: [...] } } }
        rawProducts = response.data.data.products;
      } else if (response.data.products) {
        // Alternative structure: { data: { products: [...] } }
        rawProducts = response.data.products;
      } else if (Array.isArray(response.data)) {
        // Direct array: { data: [...] }
        rawProducts = response.data;
      } else {
        console.warn(`[API] Unexpected response structure for supplier ${supplierId} products:`, response.data);
        return [];
      }

      // Ensure rawProducts is always an array
      if (!Array.isArray(rawProducts)) {
        console.warn(`[API] Expected array but received ${typeof rawProducts} for supplier ${supplierId} products`);
        return []; // Return empty array for non-array responses
      }

      // Transform backend products to frontend format
      const products: SupplierProduct[] = rawProducts.map(transformBackendProduct);

      return products;
    } catch (error: any) {
      // Gracefully handle 404 errors for endpoints under development
      if (error.response?.status === 404 || error.status === 404) {
        console.warn(`[TEMP] Products endpoint not yet implemented for supplier ${supplierId}`);
        return []; // Return empty array for 404s
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

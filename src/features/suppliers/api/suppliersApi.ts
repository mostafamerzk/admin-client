/**
 * Suppliers API Service
 *
 * This file provides methods for interacting with the suppliers API endpoints.
 */

import apiClient from '../../../api';
import { handleApiError } from '../../../utils/errorHandling';
import { responseValidators } from '../../../utils/apiHelpers';
import type { Supplier, SupplierFormData, SupplierProduct, SupplierDocument, SupplierAnalyticsData } from '../types';

export const suppliersApi = {
  /**
   * Get all suppliers
   */
  getSuppliers: async (params?: Record<string, any>): Promise<Supplier[]> => {
    try {
      const response = await apiClient.get<Supplier[]>('/suppliers', { params });
      return responseValidators.getList(response, 'suppliers');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get a supplier by ID
   */
  getSupplierById: async (id: string): Promise<Supplier> => {
    try {
      const response = await apiClient.get<Supplier>(`/suppliers/${id}`);
      return responseValidators.getById(response, 'supplier', id);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create a new supplier
   */
  createSupplier: async (supplierData: SupplierFormData): Promise<Supplier> => {
    try {
      // Transform form data to match API expectations
      const apiData = {
        name: supplierData.supplierName,
        email: supplierData.email,
        phone: supplierData.phone,
        address: supplierData.address,
        contactPerson: supplierData.supplierName, // Use supplier name as contact person
        categories: [supplierData.businessType], // Convert business type to categories array
        password: supplierData.password,
        image: supplierData.image
      };

      const response = await apiClient.post<Supplier>('/suppliers', apiData);
      return responseValidators.create(response, 'supplier');
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
  updateVerificationStatus: async (id: string, status: 'verified' | 'pending' | 'rejected'): Promise<Supplier> => {
    try {
      const response = await apiClient.put<Supplier>(`/suppliers/${id}/verification`, { verificationStatus: status });
      if (!response.data) {
        throw new Error(`Failed to update verification status for supplier ${id}`);
      }
      return response.data;
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
   * Get supplier products
   */
  getSupplierProducts: async (supplierId: string, params?: Record<string, any>): Promise<SupplierProduct[]> => {
    try {
      const response = await apiClient.get<SupplierProduct[]>(`/suppliers/${supplierId}/products`, { params });
      if (!response.data) {
        throw new Error(`No products found for supplier ${supplierId}`);
      }
      return response.data;
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
   */
  getSupplierDocuments: async (supplierId: string, params?: Record<string, any>): Promise<SupplierDocument[]> => {
    try {
      const response = await apiClient.get<SupplierDocument[]>(`/suppliers/${supplierId}/documents`, { params });
      if (!response.data) {
        throw new Error(`No documents found for supplier ${supplierId}`);
      }
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get supplier analytics
   */
  getSupplierAnalytics: async (supplierId: string, params?: Record<string, any>): Promise<SupplierAnalyticsData> => {
    try {
      const response = await apiClient.get<SupplierAnalyticsData>(`/suppliers/${supplierId}/analytics`, { params });
      if (!response.data) {
        throw new Error(`No analytics data found for supplier ${supplierId}`);
      }
      return response.data;
    } catch (error) {
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
      const response = await apiClient.put<Supplier>(`/suppliers/${id}/ban`, { status: 'banned' });
      if (!response.data) {
        throw new Error(`Failed to ban supplier ${id}`);
      }
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Unban a supplier (reactivate)
   */
  unbanSupplier: async (id: string): Promise<Supplier> => {
    try {
      const response = await apiClient.put<Supplier>(`/suppliers/${id}/unban`, { status: 'active' });
      if (!response.data) {
        throw new Error(`Failed to unban supplier ${id}`);
      }
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

export default suppliersApi;

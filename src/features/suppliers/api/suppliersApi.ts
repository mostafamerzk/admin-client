/**
 * Suppliers API Service
 * 
 * This file provides methods for interacting with the suppliers API endpoints.
 */

import api from '../../../services/api.ts';
import { Supplier, SupplierFormData } from '../types/index.ts';

export const suppliersApi = {
  /**
   * Get all suppliers
   */
  getSuppliers: async (params?: Record<string, any>): Promise<Supplier[]> => {
    try {
      const response = await api.get('/suppliers', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      throw error;
    }
  },

  /**
   * Get a supplier by ID
   */
  getSupplierById: async (id: string): Promise<Supplier> => {
    try {
      const response = await api.get(`/suppliers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching supplier ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new supplier
   */
  createSupplier: async (supplierData: SupplierFormData): Promise<Supplier> => {
    try {
      const response = await api.post('/suppliers', supplierData);
      return response.data;
    } catch (error) {
      console.error('Error creating supplier:', error);
      throw error;
    }
  },

  /**
   * Update a supplier
   */
  updateSupplier: async (id: string, supplierData: Partial<SupplierFormData>): Promise<Supplier> => {
    try {
      const response = await api.put(`/suppliers/${id}`, supplierData);
      return response.data;
    } catch (error) {
      console.error(`Error updating supplier ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a supplier
   */
  deleteSupplier: async (id: string): Promise<void> => {
    try {
      await api.delete(`/suppliers/${id}`);
    } catch (error) {
      console.error(`Error deleting supplier ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update supplier verification status
   */
  updateVerificationStatus: async (id: string, status: 'verified' | 'pending' | 'rejected'): Promise<Supplier> => {
    try {
      const response = await api.put(`/suppliers/${id}/verification`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating supplier verification status ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get suppliers by verification status
   */
  getSuppliersByVerificationStatus: async (status: 'verified' | 'pending' | 'rejected'): Promise<Supplier[]> => {
    try {
      const response = await api.get('/suppliers', { params: { verificationStatus: status } });
      return response.data;
    } catch (error) {
      console.error(`Error fetching suppliers by verification status ${status}:`, error);
      throw error;
    }
  }
};

export default suppliersApi;

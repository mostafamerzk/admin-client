/**
 * Suppliers API Service
 * 
 * This file provides methods for interacting with the suppliers API endpoints.
 */

import apiClient from '../../../api';
import type { Supplier, SupplierFormData } from '../types';

export const suppliersApi = {
  /**
   * Get all suppliers
   */
  getSuppliers: async (params?: Record<string, any>): Promise<Supplier[]> => {
    try {
      const response = await apiClient.get<Supplier[]>('/suppliers', { params });
      if (!response.data) {
        throw new Error('No suppliers data received');
      }
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
      const response = await apiClient.get<Supplier>(`/suppliers/${id}`);
      if (!response.data) {
        throw new Error(`No supplier data received for ID: ${id}`);
      }
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
      const response = await apiClient.post<Supplier>('/suppliers', supplierData);
      if (!response.data) {
        throw new Error('Failed to create supplier');
      }
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
      const response = await apiClient.put<Supplier>(`/suppliers/${id}`, supplierData);
      if (!response.data) {
        throw new Error(`Failed to update supplier ${id}`);
      }
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
      await apiClient.delete(`/suppliers/${id}`);
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
      const response = await apiClient.put<Supplier>(`/suppliers/${id}/verification`, { status });
      if (!response.data) {
        throw new Error(`Failed to update verification status for supplier ${id}`);
      }
      return response.data;
    } catch (error) {
      console.error(`Error updating verification status for supplier ${id}:`, error);
      throw error;
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
      console.error(`Error fetching suppliers with status ${status}:`, error);
      throw error;
    }
  }
};

export default suppliersApi;

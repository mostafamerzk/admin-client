/**
 * Verifications API Service
 * 
 * This file provides methods for interacting with the verifications API endpoints.
 */

import api from '../../../services/api.ts';
import { Verification, VerificationUpdateData } from '../types/index.ts';

export const verificationsApi = {
  /**
   * Get all verifications
   */
  getVerifications: async (params?: Record<string, any>): Promise<Verification[]> => {
    try {
      const response = await api.get('/verifications', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching verifications:', error);
      throw error;
    }
  },

  /**
   * Get a verification by ID
   */
  getVerificationById: async (id: string): Promise<Verification> => {
    try {
      const response = await api.get(`/verifications/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching verification ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get verifications by status
   */
  getVerificationsByStatus: async (status: Verification['status']): Promise<Verification[]> => {
    try {
      const response = await api.get('/verifications', { params: { status } });
      return response.data;
    } catch (error) {
      console.error(`Error fetching verifications by status ${status}:`, error);
      throw error;
    }
  },

  /**
   * Get verifications by supplier
   */
  getVerificationsBySupplier: async (supplierId: string): Promise<Verification[]> => {
    try {
      const response = await api.get('/verifications', { params: { supplierId } });
      return response.data;
    } catch (error) {
      console.error(`Error fetching verifications for supplier ${supplierId}:`, error);
      throw error;
    }
  },

  /**
   * Update a verification
   */
  updateVerification: async (id: string, data: VerificationUpdateData): Promise<Verification> => {
    try {
      const response = await api.put(`/verifications/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating verification ${id}:`, error);
      throw error;
    }
  },

  /**
   * Approve a verification
   */
  approveVerification: async (id: string, notes: string = ''): Promise<Verification> => {
    try {
      const response = await api.put(`/verifications/${id}/approve`, { notes });
      return response.data;
    } catch (error) {
      console.error(`Error approving verification ${id}:`, error);
      throw error;
    }
  },

  /**
   * Reject a verification
   */
  rejectVerification: async (id: string, notes: string): Promise<Verification> => {
    try {
      const response = await api.put(`/verifications/${id}/reject`, { notes });
      return response.data;
    } catch (error) {
      console.error(`Error rejecting verification ${id}:`, error);
      throw error;
    }
  }
};

export default verificationsApi;

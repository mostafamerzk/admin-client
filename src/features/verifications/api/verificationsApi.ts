/**
 * Verifications API Service
 * 
 * This file provides methods for interacting with the verifications API endpoints.
 */

import apiClient from '../../../api';
import type { Verification, VerificationRequest, VerificationUpdateData } from '../types';

export const verificationsApi = {
  /**
   * Get all verifications
   */
  getVerifications: async (params?: Record<string, any>): Promise<Verification[]> => {
    try {
      const response = await apiClient.get<Verification[]>('/verifications', { params });
      if (!response.data) {
        throw new Error('No verifications data received');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching verifications:', error);
      throw error;
    }
  },

  /**
   * Get verification by ID
   */
  getVerificationById: async (id: string): Promise<Verification> => {
    try {
      const response = await apiClient.get<Verification>(`/verifications/${id}`);
      if (!response.data) {
        throw new Error(`No verification data received for ID: ${id}`);
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching verification ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create verification request
   */
  createVerification: async (verificationData: VerificationRequest): Promise<Verification> => {
    try {
      const response = await apiClient.post<Verification>('/verifications', verificationData);
      if (!response.data) {
        throw new Error('Failed to create verification request');
      }
      return response.data;
    } catch (error) {
      console.error('Error creating verification request:', error);
      throw error;
    }
  },

  /**
   * Update verification status
   */
  updateVerificationStatus: async (id: string, status: Verification['status']): Promise<Verification> => {
    try {
      const response = await apiClient.put<Verification>(`/verifications/${id}/status`, { status });
      if (!response.data) {
        throw new Error(`Failed to update verification status for ID: ${id}`);
      }
      return response.data;
    } catch (error) {
      console.error(`Error updating verification status for ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get verifications by status
   */
  getVerificationsByStatus: async (status: Verification['status']): Promise<Verification[]> => {
    try {
      const response = await apiClient.get<Verification[]>('/verifications', { params: { status } });
      if (!response.data) {
        throw new Error(`No verifications found with status: ${status}`);
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching verifications with status ${status}:`, error);
      throw error;
    }
  },

  /**
   * Get verifications by user
   */
  getVerificationsByUser: async (userId: string): Promise<Verification[]> => {
    try {
      const response = await apiClient.get<Verification[]>('/verifications', { params: { userId } });
      if (!response.data) {
        throw new Error(`No verifications found for user: ${userId}`);
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching verifications for user ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Update verification
   */
  updateVerification: async (id: string, data: VerificationUpdateData): Promise<Verification> => {
    try {
      const response = await apiClient.put<Verification>(`/verifications/${id}`, data);
      if (!response.data) {
        throw new Error(`Failed to update verification for ID: ${id}`);
      }
      return response.data;
    } catch (error) {
      console.error(`Error updating verification ${id}:`, error);
      throw error;
    }
  },

  /**
   * Approve verification
   */
  approveVerification: async (id: string, notes?: string): Promise<Verification> => {
    try {
      const response = await apiClient.put<Verification>(`/verifications/${id}/approve`, { notes });
      if (!response.data) {
        throw new Error(`Failed to approve verification for ID: ${id}`);
      }
      return response.data;
    } catch (error) {
      console.error(`Error approving verification ${id}:`, error);
      throw error;
    }
  },

  /**
   * Reject verification
   */
  rejectVerification: async (id: string, notes?: string): Promise<Verification> => {
    try {
      const response = await apiClient.put<Verification>(`/verifications/${id}/reject`, { notes });
      if (!response.data) {
        throw new Error(`Failed to reject verification for ID: ${id}`);
      }
      return response.data;
    } catch (error) {
      console.error(`Error rejecting verification ${id}:`, error);
      throw error;
    }
  }
};

export default verificationsApi;

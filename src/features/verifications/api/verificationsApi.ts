/**
 * Verifications API Service
 *
 * This file provides methods for interacting with the verifications API endpoints.
 */

import apiClient from '../../../api';
import { handleApiError } from '../../../utils/errorHandling';
import { responseValidators } from '../../../utils/apiHelpers';
import type { Verification, VerificationRequest, VerificationUpdateData } from '../types';

export const verificationsApi = {
  /**
   * Get all verifications
   */
  getVerifications: async (params?: Record<string, any>): Promise<Verification[]> => {
    try {
      const response = await apiClient.get<Verification[]>('/verifications', { params });
      return responseValidators.getList(response, 'verifications');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get verification by ID
   */
  getVerificationById: async (id: string): Promise<Verification> => {
    try {
      const response = await apiClient.get<Verification>(`/verifications/${id}`);
      return responseValidators.getById(response, 'verification', id);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create verification request
   */
  createVerification: async (verificationData: VerificationRequest): Promise<Verification> => {
    try {
      const response = await apiClient.post<Verification>('/verifications', verificationData);
      return responseValidators.create(response, 'verification');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update verification status
   */
  updateVerificationStatus: async (id: string, status: Verification['status']): Promise<Verification> => {
    try {
      const response = await apiClient.put<Verification>(`/verifications/${id}/status`, { status });
      return responseValidators.update(response, 'verification', id);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get verifications by status
   */
  getVerificationsByStatus: async (status: Verification['status']): Promise<Verification[]> => {
    try {
      const response = await apiClient.get<Verification[]>('/verifications', { params: { status } });
      return responseValidators.getList(response, 'verifications', true);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get verifications by user
   */
  getVerificationsByUser: async (userId: string): Promise<Verification[]> => {
    try {
      const response = await apiClient.get<Verification[]>('/verifications', { params: { userId } });
      return responseValidators.getList(response, 'verifications', true);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update verification
   */
  updateVerification: async (id: string, data: VerificationUpdateData): Promise<Verification> => {
    try {
      const response = await apiClient.put<Verification>(`/verifications/${id}`, data);
      return responseValidators.update(response, 'verification', id);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Approve verification
   */
  approveVerification: async (id: string, notes?: string): Promise<Verification> => {
    try {
      const response = await apiClient.put<Verification>(`/verifications/${id}/approve`, { notes });
      return responseValidators.update(response, 'verification', id);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Reject verification
   */
  rejectVerification: async (id: string, notes?: string): Promise<Verification> => {
    try {
      const response = await apiClient.put<Verification>(`/verifications/${id}/reject`, { notes });
      return responseValidators.update(response, 'verification', id);
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

export default verificationsApi;

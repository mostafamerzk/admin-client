/**
 * Business Types API Service
 * 
 * This file provides methods for interacting with business types API endpoints.
 */

import apiClient from '../../../api';
import { handleApiError } from '../../../utils/errorHandling';
import { responseValidators } from '../../../utils/apiHelpers';
import type { BusinessType } from '../types';

export const businessTypesApi = {
  /**
   * Get all business types
   * @returns Promise resolving to an array of business types
   */
  getBusinessTypes: async (): Promise<BusinessType[]> => {
    try {
      const response = await apiClient.get<BusinessType[]>('/business-types');
      return responseValidators.getList(response, 'business types');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get a business type by ID
   * @param id - The business type ID
   * @returns Promise resolving to a business type
   */
  getBusinessTypeById: async (id: string): Promise<BusinessType> => {
    try {
      const response = await apiClient.get<BusinessType>(`/business-types/${id}`);
      return responseValidators.getById(response, 'business type', id);
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

// Export individual methods for more flexible importing
export const { 
  getBusinessTypes, 
  getBusinessTypeById 
} = businessTypesApi;

export default businessTypesApi;

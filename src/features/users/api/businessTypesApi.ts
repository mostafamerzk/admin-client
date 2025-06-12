/**
 * Business Types API Service
 * 
 * This file provides methods for interacting with business types API endpoints.
 */

import apiClient from '../../../api';
import { handleApiError } from '../../../utils/errorHandling';
import type { BusinessType } from '../types';
import { businessTypes } from '../../../mockData/entities/businessTypes';

export const businessTypesApi = {
  /**
   * Get all business types
   * @returns Promise resolving to an array of business types
   */
  getBusinessTypes: async (): Promise<BusinessType[]> => {
    try {
      // For development, return mock data with a delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return businessTypes;

      // Uncomment below for real API call
      // const response = await apiClient.get<BusinessType[]>('/business-types');
      // if (!response.data) {
      //   throw new Error('No business types data received');
      // }
      // return response.data;
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
      if (!response.data) {
        throw new Error(`No business type data received for ID: ${id}`);
      }
      return response.data;
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

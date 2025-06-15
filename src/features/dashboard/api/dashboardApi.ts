/**
 * Dashboard API Service
 * 
 * This file provides methods for interacting with the dashboard API endpoints.
 */

import apiClient from '../../../api';
import { handleApiError } from '../../../utils/errorHandling';
import { responseValidators } from '../../../utils/apiHelpers';
import type { DashboardStats, SalesData, UserGrowth, CategoryDistributionData } from '../types';

export const dashboardApi = {
  /**
   * Get dashboard statistics
   */
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const response = await apiClient.get<DashboardStats>('/dashboard/stats');
      return responseValidators.getById(response, 'dashboard statistics', 'stats');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get sales data for a specific period
   */
  getSalesData: async (period: 'day' | 'week' | 'month' | 'year'): Promise<SalesData[]> => {
    try {
      const response = await apiClient.get<SalesData[]>(`/dashboard/sales`, { params: { period } });
      return responseValidators.getList(response, 'sales data', true);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get user growth data
   */
  getUserGrowth: async (period: 'week' | 'month' | 'year'): Promise<UserGrowth[]> => {
    try {
      const response = await apiClient.get<UserGrowth[]>(`/dashboard/user-growth`, { params: { period } });
      return responseValidators.getList(response, 'user growth data', true);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get category distribution data
   */
  getCategoryDistribution: async (): Promise<CategoryDistributionData> => {
    try {
      const response = await apiClient.get<CategoryDistributionData>(`/dashboard/category-distribution`);
      return responseValidators.getById(response, 'category distribution data', 'distribution');
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

export default dashboardApi;

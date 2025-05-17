/**
 * Dashboard API Service
 * 
 * This file provides methods for interacting with the dashboard API endpoints.
 */

import apiClient from '../../../api';
import type { DashboardStats } from '../types';

export const dashboardApi = {
  /**
   * Get dashboard statistics
   */
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const response = await apiClient.get<DashboardStats>('/dashboard/stats');
      if (!response.data) {
        throw new Error('No dashboard statistics received');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
      throw error;
    }
  },

  /**
   * Get sales data for a specific period
   */
  getSalesData: async (period: 'day' | 'week' | 'month' | 'year'): Promise<any> => {
    try {
      const response = await apiClient.get(`/dashboard/sales`, { params: { period } });
      if (!response.data) {
        throw new Error(`No sales data received for period: ${period}`);
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching sales data for ${period}:`, error);
      throw error;
    }
  },

  /**
   * Get user growth data
   */
  getUserGrowth: async (period: 'week' | 'month' | 'year'): Promise<any> => {
    try {
      const response = await apiClient.get(`/dashboard/users`, { params: { period } });
      if (!response.data) {
        throw new Error(`No user growth data received for period: ${period}`);
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching user growth data for ${period}:`, error);
      throw error;
    }
  }
};

export default dashboardApi;

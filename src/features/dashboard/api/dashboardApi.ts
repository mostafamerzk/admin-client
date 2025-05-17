/**
 * Dashboard API Service
 * 
 * This file provides methods for interacting with the dashboard API endpoints.
 */

import api from '../../../services/api.ts';
import { DashboardStats } from '../types/index.ts';

export const dashboardApi = {
  /**
   * Get dashboard statistics
   */
  getStats: async (): Promise<DashboardStats> => {
    try {
      const response = await api.get('/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  /**
   * Get sales data for a specific period
   */
  getSalesData: async (period: 'day' | 'week' | 'month' | 'year'): Promise<any> => {
    try {
      const response = await api.get(`/dashboard/sales?period=${period}`);
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
      const response = await api.get(`/dashboard/users?period=${period}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user growth data for ${period}:`, error);
      throw error;
    }
  }
};

export default dashboardApi;

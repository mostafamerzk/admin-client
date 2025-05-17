/**
 * Analytics API Service
 * 
 * This file provides methods for interacting with the analytics API endpoints.
 */

import api from '../../../services/api.ts';
import { 
  AnalyticsData, 
  AnalyticsSummary, 
  SalesTrendData, 
  UserGrowthData, 
  CategoryDistributionData, 
  TopProductData, 
  TopSupplierData, 
  GeographicData,
  AnalyticsTimeRange
} from '../types/index.ts';

export const analyticsApi = {
  /**
   * Get all analytics data
   */
  getAnalyticsData: async (timeRange: AnalyticsTimeRange = 'month'): Promise<AnalyticsData> => {
    try {
      const response = await api.get('/analytics', { params: { timeRange } });
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      throw error;
    }
  },

  /**
   * Get analytics summary
   */
  getAnalyticsSummary: async (timeRange: AnalyticsTimeRange = 'month'): Promise<AnalyticsSummary> => {
    try {
      const response = await api.get('/analytics/summary', { params: { timeRange } });
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics summary:', error);
      throw error;
    }
  },

  /**
   * Get sales trend data
   */
  getSalesTrend: async (timeRange: AnalyticsTimeRange = 'month'): Promise<SalesTrendData> => {
    try {
      const response = await api.get('/analytics/sales-trend', { params: { timeRange } });
      return response.data;
    } catch (error) {
      console.error('Error fetching sales trend data:', error);
      throw error;
    }
  },

  /**
   * Get user growth data
   */
  getUserGrowth: async (timeRange: AnalyticsTimeRange = 'month'): Promise<UserGrowthData> => {
    try {
      const response = await api.get('/analytics/user-growth', { params: { timeRange } });
      return response.data;
    } catch (error) {
      console.error('Error fetching user growth data:', error);
      throw error;
    }
  },

  /**
   * Get category distribution data
   */
  getCategoryDistribution: async (timeRange: AnalyticsTimeRange = 'month'): Promise<CategoryDistributionData> => {
    try {
      const response = await api.get('/analytics/category-distribution', { params: { timeRange } });
      return response.data;
    } catch (error) {
      console.error('Error fetching category distribution data:', error);
      throw error;
    }
  },

  /**
   * Get top products data
   */
  getTopProducts: async (timeRange: AnalyticsTimeRange = 'month', limit: number = 10): Promise<TopProductData[]> => {
    try {
      const response = await api.get('/analytics/top-products', { params: { timeRange, limit } });
      return response.data;
    } catch (error) {
      console.error('Error fetching top products data:', error);
      throw error;
    }
  },

  /**
   * Get top suppliers data
   */
  getTopSuppliers: async (timeRange: AnalyticsTimeRange = 'month', limit: number = 10): Promise<TopSupplierData[]> => {
    try {
      const response = await api.get('/analytics/top-suppliers', { params: { timeRange, limit } });
      return response.data;
    } catch (error) {
      console.error('Error fetching top suppliers data:', error);
      throw error;
    }
  },

  /**
   * Get geographic data
   */
  getGeographicData: async (timeRange: AnalyticsTimeRange = 'month'): Promise<GeographicData> => {
    try {
      const response = await api.get('/analytics/geographic-data', { params: { timeRange } });
      return response.data;
    } catch (error) {
      console.error('Error fetching geographic data:', error);
      throw error;
    }
  },

  /**
   * Export analytics data
   */
  exportAnalyticsData: async (timeRange: AnalyticsTimeRange = 'month', format: 'csv' | 'excel' | 'pdf' = 'csv'): Promise<Blob> => {
    try {
      const response = await api.get('/analytics/export', { 
        params: { timeRange, format },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting analytics data:', error);
      throw error;
    }
  }
};

export default analyticsApi;

/**
 * Analytics API Service
 * 
 * This file provides methods for interacting with the analytics API endpoints.
 */

import apiClient from '../../../api';
import type { 
  AnalyticsData, 
  AnalyticsSummary, 
  SalesTrendData, 
  UserGrowthData, 
  CategoryDistributionData, 
  TopProductData, 
  TopSupplierData, 
  GeographicData,
  AnalyticsTimeRange
} from '../types';

export const analyticsApi = {
  /**
   * Get all analytics data
   */
  getAnalyticsData: async (timeRange: AnalyticsTimeRange = 'month'): Promise<AnalyticsData> => {
    try {
      const response = await apiClient.get<AnalyticsData>('/analytics', { params: { timeRange } });
      if (!response.data) {
        throw new Error('No analytics data received');
      }
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
      const response = await apiClient.get<AnalyticsSummary>('/analytics/summary', { params: { timeRange } });
      if (!response.data) {
        throw new Error('No analytics summary received');
      }
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
      const response = await apiClient.get<SalesTrendData>('/analytics/sales-trend', { params: { timeRange } });
      if (!response.data) {
        throw new Error('No sales trend data received');
      }
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
      const response = await apiClient.get<UserGrowthData>('/analytics/user-growth', { params: { timeRange } });
      if (!response.data) {
        throw new Error('No user growth data received');
      }
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
      const response = await apiClient.get<CategoryDistributionData>('/analytics/category-distribution', { params: { timeRange } });
      if (!response.data) {
        throw new Error('No category distribution data received');
      }
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
      const response = await apiClient.get<TopProductData[]>('/analytics/top-products', { params: { timeRange, limit } });
      if (!response.data) {
        throw new Error('No top products data received');
      }
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
      const response = await apiClient.get<TopSupplierData[]>('/analytics/top-suppliers', { params: { timeRange, limit } });
      if (!response.data) {
        throw new Error('No top suppliers data received');
      }
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
      const response = await apiClient.get<GeographicData>('/analytics/geographic-data', { params: { timeRange } });
      if (!response.data) {
        throw new Error('No geographic data received');
      }
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
      const response = await apiClient.get<Blob>('/analytics/export', { 
        params: { timeRange, format },
        responseType: 'blob'
      });
      if (!response.data) {
        throw new Error('No export data received');
      }
      return response.data;
    } catch (error) {
      console.error('Error exporting analytics data:', error);
      throw error;
    }
  }
};

export default analyticsApi;

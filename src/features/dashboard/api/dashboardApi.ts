/**
 * Dashboard API Service
 *
 * This file provides methods for interacting with the dashboard API endpoints.
 */

import apiClient from '../../../api';
import { handleApiError } from '../../../utils/errorHandling';
import type {
  DashboardStats,
  DashboardStatsResponse,
  SalesData,
  SalesDataResponse,
  UserGrowth,
  UserGrowthResponse,
  CategoryDistributionData,
  CategoryDistributionResponse
} from '../types';

/**
 * Transform backend dashboard stats response to frontend format
 */
const transformDashboardStats = (backendData: DashboardStatsResponse): DashboardStats => {
  return {
    summary: {
      totalUsers: backendData.totalUsers,
      totalSuppliers: backendData.totalSuppliers,
      totalOrders: backendData.totalOrders,
      totalRevenue: backendData.totalRevenue,
      pendingVerifications: backendData.pendingVerifications,
      activeUsers: backendData.activeUsers,
    },
    monthlyGrowth: backendData.monthlyGrowth,
    // Initialize with empty chart data - will be populated by separate API calls
    revenueData: {
      labels: [],
      datasets: [{
        label: 'Revenue',
        data: [],
        borderColor: '#F28B22',
        backgroundColor: 'rgba(242, 139, 34, 0.1)',
      }]
    },
    userGrowth: {
      labels: [],
      datasets: [{
        label: 'Users',
        data: [],
        borderColor: '#F28B22',
        backgroundColor: 'rgba(242, 139, 34, 0.1)',
      }]
    },
    categoryDistribution: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [],
        borderWidth: 1,
      }]
    },
    recentOrders: [],
    topSuppliers: []
  };
};

/**
 * Transform backend sales data response to frontend format
 */
const transformSalesData = (backendData: SalesDataResponse): SalesData[] => {
  return backendData.data.map(item => ({
    date: item.date,
    amount: item.sales,
    orders: item.orders
  }));
};

/**
 * Transform backend user growth response to frontend format
 */
const transformUserGrowth = (backendData: UserGrowthResponse): UserGrowth[] => {
  return backendData.data.map(item => ({
    date: item.date,
    users: item.totalUsers,
    newUsers: item.newUsers,
    totalUsers: item.totalUsers
  }));
};

/**
 * Transform backend category distribution response to frontend format
 */
const transformCategoryDistribution = (backendData: CategoryDistributionResponse[]): CategoryDistributionData => {
  const colors = [
    '#F28B22', '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#EC4899'
  ];

  return {
    labels: backendData.map(item => item.category),
    datasets: [{
      data: backendData.map(item => item.count),
      backgroundColor: backendData.map((_, index) => colors[index % colors.length] || '#F28B22'),
      borderWidth: 1,
    }]
  };
};

export const dashboardApi = {
  /**
   * Get dashboard statistics
   */
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const response = await apiClient.get<DashboardStatsResponse>('/dashboard/stats');
      // Use direct response validation since this is not a getById operation
      if (response.data) {
        return transformDashboardStats(response.data);
      } else {
        throw new Error('No dashboard statistics data received');
      }
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get sales data for a specific period
   */
  getSalesData: async (period: 'day' | 'week' | 'month' | 'year'): Promise<SalesData[]> => {
    try {
      const response = await apiClient.get<SalesDataResponse>(`/dashboard/sales`, { params: { period } });
      if (response.data) {
        return transformSalesData(response.data);
      } else {
        throw new Error('No sales data received');
      }
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get user growth data
   */
  getUserGrowth: async (period: 'week' | 'month' | 'year'): Promise<UserGrowth[]> => {
    try {
      const response = await apiClient.get<UserGrowthResponse>(`/dashboard/user-growth`, { params: { period } });
      if (response.data) {
        return transformUserGrowth(response.data);
      } else {
        throw new Error('No user growth data received');
      }
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get category distribution data
   */
  getCategoryDistribution: async (): Promise<CategoryDistributionData> => {
    try {
      const response = await apiClient.get<CategoryDistributionResponse[]>(`/dashboard/category-distribution`);
      if (response.data) {
        return transformCategoryDistribution(response.data);
      } else {
        throw new Error('No category distribution data received');
      }
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

export default dashboardApi;

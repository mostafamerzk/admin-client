/**
 * Analytics Hook
 *
 * This hook provides methods and state for working with analytics data.
 */

import { useState, useCallback, useEffect } from 'react';
import type {
  AnalyticsData,
  AnalyticsSummary,
  SalesTrendData,
  UserGrowthData,
  CategoryDistributionData,
  TopProductData,
  TopSupplierData,
  GeographicData,
  AnalyticsTimeRange,
  TimeRange,
  ChartData,
  MetricData,
  CategoryDistribution,
  Supplier
} from '../types';
import analyticsApi from '../api/analyticsApi.ts';
import useNotification from '../../../hooks/useNotification.ts';
import { mockDb } from '../../../mockData/db.ts';
import type { DashboardStats } from '../../../mockData/entities/dashboard.ts';

export const useAnalytics = (defaultTimeRange: AnalyticsTimeRange = 'month') => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<AnalyticsTimeRange>(defaultTimeRange);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showNotification } = useNotification();

  // Get mock data for different time ranges
  const getDataForTimeRange = (range: TimeRange): ChartData => {
    switch (range) {
      case 'week':
        return {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          revenue: [3000, 4500, 3800, 5200, 4800, 6000, 5500],
          users: [15, 22, 18, 25, 20, 30, 28],
          orders: [45, 65, 55, 75, 60, 90, 85]
        };
      case 'month':
        return {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          revenue: [18000, 22000, 25000, 30000],
          users: [85, 110, 125, 150],
          orders: [270, 330, 375, 450]
        };
      case 'quarter':
        return {
          labels: ['Jan', 'Feb', 'Mar'],
          revenue: [75000, 85000, 95000],
          users: [350, 400, 450],
          orders: [1100, 1250, 1400]
        };
      case 'year':
        return {
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          revenue: [250000, 300000, 350000, 400000],
          users: [1200, 1500, 1800, 2100],
          orders: [3800, 4500, 5200, 6000]
        };
      default:
        return {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          revenue: [18000, 22000, 25000, 30000],
          users: [85, 110, 125, 150],
          orders: [270, 330, 375, 450]
        };
    }
  };

  // Calculate totals and growth
  const calculateGrowth = (current: number, previous: number): number => {
    return ((current - previous) / previous) * 100;
  };

  const getTotalAndGrowth = (data: number[]): MetricData => {
    const total = data.reduce((sum, value) => sum + value, 0);
    const previousTotal = total * 0.85; // Mock previous period (15% less)
    const growth = calculateGrowth(total, previousTotal);
    return { total, growth };
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Fetch all analytics data
  const fetchAnalyticsData = useCallback(async (range?: AnalyticsTimeRange) => {
    const selectedRange = range || timeRange;
    setIsLoading(true);
    setError(null);
    try {
      // In a real app, this would call an API
      // const data = await analyticsApi.getAnalyticsData(selectedRange);

      // For now, we'll use mock data
      const dashboardStats = mockDb.getAll<DashboardStats, 'dashboardStats'>('dashboardStats')[0];
      const chartData = getDataForTimeRange(selectedRange as TimeRange);
      const revenueData = getTotalAndGrowth(chartData.revenue);
      const usersData = getTotalAndGrowth(chartData.users);
      const ordersData = getTotalAndGrowth(chartData.orders);

      const mockAnalyticsData = {
        timeRange: selectedRange,
        chartData,
        revenueData,
        usersData,
        ordersData,
        categoryDistribution: dashboardStats?.categoryDistribution as unknown as CategoryDistribution || [],
        topSuppliers: dashboardStats?.topSuppliers as unknown as Supplier[] || []
      };

      setAnalyticsData(mockAnalyticsData as unknown as AnalyticsData);
      if (range) setTimeRange(range);
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch analytics data'
      });
    } finally {
      setIsLoading(false);
    }
  }, [timeRange, showNotification, getDataForTimeRange, getTotalAndGrowth]);

  // Get analytics summary
  const getAnalyticsSummary = useCallback(async (range?: AnalyticsTimeRange): Promise<AnalyticsSummary | null> => {
    const selectedRange = range || timeRange;
    setIsLoading(true);
    setError(null);
    try {
      const summary = await analyticsApi.getAnalyticsSummary(selectedRange);
      return summary;
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch analytics summary'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [timeRange, showNotification]);

  // Get sales trend data
  const getSalesTrend = useCallback(async (range?: AnalyticsTimeRange): Promise<SalesTrendData | null> => {
    const selectedRange = range || timeRange;
    setIsLoading(true);
    setError(null);
    try {
      const salesTrend = await analyticsApi.getSalesTrend(selectedRange);
      return salesTrend;
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch sales trend data'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [timeRange, showNotification]);

  // Get user growth data
  const getUserGrowth = useCallback(async (range?: AnalyticsTimeRange): Promise<UserGrowthData | null> => {
    const selectedRange = range || timeRange;
    setIsLoading(true);
    setError(null);
    try {
      const userGrowth = await analyticsApi.getUserGrowth(selectedRange);
      return userGrowth;
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch user growth data'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [timeRange, showNotification]);

  // Get category distribution data
  const getCategoryDistribution = useCallback(async (range?: AnalyticsTimeRange): Promise<CategoryDistributionData | null> => {
    const selectedRange = range || timeRange;
    setIsLoading(true);
    setError(null);
    try {
      const categoryDistribution = await analyticsApi.getCategoryDistribution(selectedRange);
      return categoryDistribution;
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch category distribution data'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [timeRange, showNotification]);

  // Export analytics data
  const exportAnalyticsData = useCallback(async (format: 'csv' | 'excel' | 'pdf' = 'csv', range?: AnalyticsTimeRange): Promise<Blob | null> => {
    const selectedRange = range || timeRange;
    setIsLoading(true);
    setError(null);
    try {
      const blob = await analyticsApi.exportAnalyticsData(selectedRange, format);
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'Analytics data exported successfully'
      });
      return blob;
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to export analytics data'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [timeRange, showNotification]);

  // Load analytics data on mount and when time range changes
  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  return {
    analyticsData,
    timeRange,
    isLoading,
    error,
    setTimeRange,
    fetchAnalyticsData,
    getAnalyticsSummary,
    getSalesTrend,
    getUserGrowth,
    getCategoryDistribution,
    exportAnalyticsData,
    formatCurrency,
    getDataForTimeRange,
    getTotalAndGrowth
  };
};

export default useAnalytics;

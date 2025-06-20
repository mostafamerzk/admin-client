/**
 * Dashboard Hook
 * 
 * This hook provides methods and state for working with dashboard data.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type { DashboardStats, SalesData, UserGrowth, CategoryDistributionData } from '../types/index';
import dashboardApi from '../api/dashboardApi';
import useNotification from '../../../hooks/useNotification';

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<UserGrowth[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryDistributionData>({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      borderWidth: 1,
    }]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showNotification } = useNotification();

  // Use ref to avoid dependency issues with showNotification
  const showNotificationRef = useRef(showNotification);
  const hasInitialFetched = useRef(false);
  const cacheRef = useRef<{ data: DashboardStats; timestamp: number } | null>(null);
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  // Update ref when showNotification changes
  useEffect(() => {
    showNotificationRef.current = showNotification;
  });

  // Check if cached data is still valid
  const isCacheValid = useCallback(() => {
    if (!cacheRef.current) return false;
    return Date.now() - cacheRef.current.timestamp < CACHE_TTL;
  }, [CACHE_TTL]);

  // Fetch dashboard statistics
  const fetchStats = useCallback(async (forceRefresh = false) => {
    // Use cache if available and valid, unless force refresh is requested
    if (!forceRefresh && isCacheValid() && cacheRef.current) {
      setStats(cacheRef.current.data);
      return cacheRef.current.data;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardApi.getDashboardStats();
      setStats(data);
      // Cache the data
      cacheRef.current = {
        data,
        timestamp: Date.now()
      };
      return data;
    } catch (err) {
      const error = err as Error;
      setError(error);

      // Provide more specific error message
      const errorMessage = error.message || 'Failed to fetch dashboard statistics';
      console.error('Dashboard fetch error:', error);

      showNotificationRef.current({
        type: 'error',
        title: 'Dashboard Error',
        message: errorMessage
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isCacheValid]);

  // Fetch sales data for a specific period
  const fetchSalesData = useCallback(async (period: 'day' | 'week' | 'month' | 'year') => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardApi.getSalesData(period);
      setSalesData(data);
      return data;
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: `Failed to fetch sales data for ${period}`
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch user growth data
  const fetchUserGrowth = useCallback(async (period: 'week' | 'month' | 'year') => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardApi.getUserGrowth(period);
      setUserGrowthData(data);
      return data;
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: `Failed to fetch user growth data for ${period}`
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch category distribution data
  const fetchCategoryDistribution = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardApi.getCategoryDistribution();
      setCategoryData(data);
      return data;
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch category distribution data'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh all dashboard data
  const refreshAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch all data in parallel
      const [statsData, salesDataResult, userGrowthDataResult, categoryDataResult] = await Promise.all([
        dashboardApi.getDashboardStats(),
        dashboardApi.getSalesData('month'), // Default to month
        dashboardApi.getUserGrowth('month'), // Default to month
        dashboardApi.getCategoryDistribution()
      ]);

      // Update all state
      setStats(statsData);
      setSalesData(salesDataResult);
      setUserGrowthData(userGrowthDataResult);
      setCategoryData(categoryDataResult);

      // Cache the stats data
      cacheRef.current = {
        data: statsData,
        timestamp: Date.now()
      };
    } catch (err) {
      const error = err as Error;
      setError(error);
      showNotificationRef.current({
        type: 'error',
        title: 'Dashboard Error',
        message: 'Failed to refresh dashboard data'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load dashboard stats on mount (only if not already fetched)
  useEffect(() => {
    if (!hasInitialFetched.current) {
      hasInitialFetched.current = true;
      refreshAllData().catch(err => {
        console.error('Failed to fetch initial dashboard data:', err);
        // Error is already handled in refreshAllData, just log here
      });
    }
  }, [refreshAllData]);

  // Reset state when component unmounts to prevent stale data issues
  useEffect(() => {
    return () => {
      // Don't reset cache on unmount to preserve data between navigations
      // Only reset loading and error states
      setIsLoading(false);
      setError(null);
    };
  }, []);

  return {
    stats,
    salesData,
    userGrowthData,
    categoryData,
    isLoading,
    error,
    fetchStats,
    fetchSalesData,
    fetchUserGrowth,
    fetchCategoryDistribution,
    refreshAllData
  };
};

export default useDashboard;


/**
 * Dashboard Hook
 * 
 * This hook provides methods and state for working with dashboard data.
 */

import { useState, useCallback, useEffect } from 'react';
import type { DashboardStats } from '../types/index';
import dashboardApi from '../api/dashboardApi';
import useNotification from '../../../hooks/useNotification';

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showNotification } = useNotification();

  // Fetch dashboard statistics
  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardApi.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch dashboard statistics'
      });
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Fetch sales data for a specific period
  const fetchSalesData = useCallback(async (period: 'day' | 'week' | 'month' | 'year') => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardApi.getSalesData(period);
      return data;
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: `Failed to fetch sales data for ${period}`
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Fetch user growth data
  const fetchUserGrowth = useCallback(async (period: 'week' | 'month' | 'year') => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardApi.getUserGrowth(period);
      return data;
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: `Failed to fetch user growth data for ${period}`
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Load dashboard stats on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    error,
    fetchStats,
    fetchSalesData,
    fetchUserGrowth
  };
};

export default useDashboard;


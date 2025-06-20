/**
 * User Growth Chart Container Component
 *
 * This component handles fetching user growth data and displaying the user growth chart.
 */

import React, { useState, useCallback } from 'react';
import UserGrowthChart from './UserGrowthChart';
import { dashboardApi } from '../api/dashboardApi';
import type { UserGrowth } from '../types';

interface UserGrowthChartContainerProps {
  className?: string;
  data?: UserGrowth[];
}

const UserGrowthChartContainer: React.FC<UserGrowthChartContainerProps> = ({ className, data = [] }) => {
  const [userGrowthData, setUserGrowthData] = useState<UserGrowth[]>(data);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserGrowthData = useCallback(async (period: 'week' | 'month' | 'year') => {
    setIsLoading(true);
    setError(null);
    try {
      const newData = await dashboardApi.getUserGrowth(period);
      setUserGrowthData(newData);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to fetch user growth data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update local state when props data changes
  React.useEffect(() => {
    if (data.length > 0) {
      setUserGrowthData(data);
    }
  }, [data]);

  const handlePeriodChange = useCallback((period: 'day' | 'week' | 'month' | 'year') => {
    // Convert day to week since user growth API doesn't support day period
    const validPeriod = period === 'day' ? 'week' : period as 'week' | 'month' | 'year';
    fetchUserGrowthData(validPeriod);
  }, [fetchUserGrowthData]);

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className || ''}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
        <div className="text-center text-red-500">
          <p>Failed to load user growth data</p>
          <button 
            onClick={() => fetchUserGrowthData('month')}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <UserGrowthChart
        data={userGrowthData}
        isLoading={isLoading}
        onPeriodChange={handlePeriodChange}
      />
    </div>
  );
};

export default UserGrowthChartContainer;

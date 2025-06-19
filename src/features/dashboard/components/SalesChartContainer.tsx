/**
 * Sales Chart Container Component
 *
 * This component handles fetching sales data and displaying the sales chart.
 */

import React, { useState, useEffect, useCallback } from 'react';
import SalesChart from './SalesChart';
import { dashboardApi } from '../api/dashboardApi';
import type { SalesData } from '../types';

interface SalesChartContainerProps {
  className?: string;
}

const SalesChartContainer: React.FC<SalesChartContainerProps> = ({ className }) => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSalesData = useCallback(async (period: 'day' | 'week' | 'month' | 'year') => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardApi.getSalesData(period);
      setSalesData(data);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to fetch sales data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    fetchSalesData('month');
  }, [fetchSalesData]);

  const handlePeriodChange = useCallback((period: 'day' | 'week' | 'month' | 'year') => {
    fetchSalesData(period);
  }, [fetchSalesData]);

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className || ''}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Data</h3>
        <div className="text-center text-red-500">
          <p>Failed to load sales data</p>
          <button 
            onClick={() => fetchSalesData('month')}
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
      <SalesChart
        data={salesData}
        isLoading={isLoading}
        onPeriodChange={handlePeriodChange}
      />
    </div>
  );
};

export default SalesChartContainer;

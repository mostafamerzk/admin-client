/**
 * Category Distribution Chart Container Component
 *
 * This component handles fetching category distribution data and displaying the chart.
 */

import React, { useState, useEffect, useCallback } from 'react';
import CategoryDistributionChart from './CategoryDistributionChart';
import { dashboardApi } from '../api/dashboardApi';
import type { CategoryDistributionData } from '../types';

interface CategoryDistributionChartContainerProps {
  className?: string;
  title?: string;
}

const CategoryDistributionChartContainer: React.FC<CategoryDistributionChartContainerProps> = ({ 
  className,
  title = "Category Distribution"
}) => {
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

  const fetchCategoryData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardApi.getCategoryDistribution();
      setCategoryData(data);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to fetch category distribution data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    fetchCategoryData();
  }, [fetchCategoryData]);

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className || ''}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="text-center text-red-500">
          <p>Failed to load category distribution data</p>
          <button 
            onClick={fetchCategoryData}
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
      <CategoryDistributionChart
        data={categoryData}
        isLoading={isLoading}
        title={title}
      />
    </div>
  );
};

export default CategoryDistributionChartContainer;

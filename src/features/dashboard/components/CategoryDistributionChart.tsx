/**
 * Category Distribution Chart Component
 *
 * This component displays a pie chart showing the distribution of categories.
 */

import React, { useRef, useEffect, useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js';
import Card from '../../../components/common/Card';
import type { CategoryDistributionData } from '../types/index';
import { defaultPieChartOptions, destroyChart } from '../../../utils/chartConfig';

interface CategoryDistributionChartProps {
  data: CategoryDistributionData;
  isLoading?: boolean;
  title?: string;
  showCard?: boolean;
  className?: string;
}

const CategoryDistributionChart: React.FC<CategoryDistributionChartProps> = ({
  data,
  isLoading = false,
  title = "Category Distribution",
  showCard = true,
  className = ''
}) => {
  const chartRef = useRef<ChartJS | null>(null);

  // Clean up chart instance on unmount with safe destruction
  useEffect(() => {
    return () => {
      try {
        destroyChart(chartRef.current);
      } catch (error) {
        // Silently handle any destruction errors
        console.warn('Chart destruction warning:', error);
      }
    };
  }, []);

  // Memoize chart data to prevent unnecessary re-renders
  const chartData = useMemo(() => ({
    labels: data.labels || [],
    datasets: data.datasets || []
  }), [data.labels, data.datasets]);

  // Memoize chart options to prevent unnecessary re-initializations
  const chartOptions = useMemo(() => ({
    ...defaultPieChartOptions,
    plugins: {
      ...defaultPieChartOptions.plugins,
      title: {
        ...defaultPieChartOptions.plugins?.title,
        display: false // Disable Chart.js title since we use Card title
      }
    }
  }), []);

  // Check for missing or empty data
  const hasValidData = data.labels && data.labels.length > 0 &&
                      data.datasets && data.datasets.length > 0 &&
                      data.datasets[0]?.data && data.datasets[0].data.length > 0;

  const chartContent = (
    <>
      {isLoading ? (
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : !hasValidData ? (
        <div className="h-80 flex items-center justify-center">
          <div className="text-center text-gray-500">
            No data available
          </div>
        </div>
      ) : (
        <>
          <div className="h-80">
            <Pie
              ref={(ref) => {
                if (ref) {
                  chartRef.current = ref;
                }
              }}
              data={chartData}
              options={chartOptions}
            />
          </div>

          {/* Legend */}
          <div className="mt-4 space-y-2">
            {data.labels.map((label, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{
                      backgroundColor: data.datasets[0]?.backgroundColor?.[index] as string || '#ccc'
                    }}
                  ></div>
                  <span className="text-sm text-gray-600">{label}</span>
                </div>
                <span className="text-sm font-medium">
                  {data.datasets[0]?.data?.[index] || 0}%
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );

  if (!showCard) {
    return <div className={className}>{chartContent}</div>;
  }

  return (
    <Card
      title={<h3 className="text-lg font-semibold text-black">{title}</h3>}
      className={className}
    >
      {chartContent}
    </Card>
  );
};

export default React.memo(CategoryDistributionChart);

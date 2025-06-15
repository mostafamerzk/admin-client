/**
 * User Growth Chart Component
 *
 * This component displays a chart of user growth data.
 */

import React, { useState, useRef, useEffect, useMemo, useCallback, memo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { defaultLineChartOptions, destroyChart } from '../../../utils/chartConfig';

interface UserGrowthData {
  date: string;
  users: number;
}

interface UserGrowthChartProps {
  data: UserGrowthData[];
  isLoading?: boolean;
  onPeriodChange?: (period: 'day' | 'week' | 'month' | 'year') => void;
  showCard?: boolean;
  title?: string;
}

const UserGrowthChart: React.FC<UserGrowthChartProps> = ({
  data,
  isLoading = false,
  onPeriodChange,
  showCard = true,
  title = "User Growth"
}) => {
  const [activePeriod, setActivePeriod] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const chartRef = useRef<ChartJS | null>(null);

  // Clean up chart instance on unmount
  useEffect(() => {
    return () => {
      destroyChart(chartRef.current);
    };
  }, []);

  // Memoize event handler to prevent unnecessary re-renders
  const handlePeriodChange = useCallback((period: 'day' | 'week' | 'month' | 'year') => {
    setActivePeriod(period);
    if (onPeriodChange) {
      onPeriodChange(period);
    }
  }, [onPeriodChange]);

  // Memoize chart data to prevent unnecessary recalculations
  const chartData = useMemo(() => ({
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Users',
        data: data.map(item => item.users),
        borderColor: '#F28B22',
        backgroundColor: 'rgba(242, 139, 34, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#F28B22',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  }), [data]);

  // Memoize chart options to prevent unnecessary re-initializations
  const options = useMemo(() => ({
    ...defaultLineChartOptions,
    plugins: {
      ...defaultLineChartOptions.plugins,
      tooltip: {
        ...(defaultLineChartOptions.plugins?.tooltip || {}),
        callbacks: {
          label: function(context: any) {
            return `${context.parsed.y.toLocaleString()} users`;
          }
        }
      }
    }
  }), []);

  const chartContent = (
    <>
      {isLoading ? (
        <div className="h-80 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="h-80">
          <Line
            data={chartData}
            options={options as any}
            ref={(ref) => {
              if (ref) {
                chartRef.current = ref;
              }
            }}
          />
        </div>
      )}
    </>
  );

  if (!showCard) {
    return chartContent;
  }

  return (
    <Card className="h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <div className="flex space-x-2 mt-3 sm:mt-0">
          <Button
            size="sm"
            variant={activePeriod === 'day' ? 'primary' : 'outline'}
            onClick={() => handlePeriodChange('day')}
          >
            Day
          </Button>
          <Button
            size="sm"
            variant={activePeriod === 'week' ? 'primary' : 'outline'}
            onClick={() => handlePeriodChange('week')}
          >
            Week
          </Button>
          <Button
            size="sm"
            variant={activePeriod === 'month' ? 'primary' : 'outline'}
            onClick={() => handlePeriodChange('month')}
          >
            Month
          </Button>
          <Button
            size="sm"
            variant={activePeriod === 'year' ? 'primary' : 'outline'}
            onClick={() => handlePeriodChange('year')}
          >
            Year
          </Button>
        </div>
      </div>
      {chartContent}
    </Card>
  );
};

export default memo(UserGrowthChart);

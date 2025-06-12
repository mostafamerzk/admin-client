/**
 * AnalyticsPage Component
 *
 * The analytics page for the ConnectChain admin panel.
 */

import React from 'react';
import PageHeader from '../components/layout/PageHeader';
import { CurrencyDollarIcon, UsersIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import StatCard from '../features/dashboard/components/StatCard';
import {
  TimeRangeSelector,
  BarChart,
  PieChart,
  SupplierTable,
  useAnalytics,
  TimeRange
} from '../features/analytics/index';

const AnalyticsPage: React.FC = () => {
  const {
    timeRange,
    setTimeRange,
    analyticsData,
    isLoading,
    formatCurrency
  } = useAnalytics();

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range as any); // Type casting as the hook uses AnalyticsTimeRange
  };

  if (isLoading || !analyticsData) {
    return (
      <div>
        <PageHeader
          title="Analytics"
          description="View detailed analytics and reports for your platform"
          breadcrumbs={[{ label: 'Analytics' }]}
        />
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-500">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="View detailed analytics and reports for your platform"
        breadcrumbs={[{ label: 'Analytics' }]}
        actions={
          <TimeRangeSelector
            timeRange={timeRange as TimeRange}
            onTimeRangeChange={handleTimeRangeChange}
          />
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(analyticsData.revenueData.total)}
          icon={<CurrencyDollarIcon className="h-6 w-6 text-primary" />}
          change={{
            value: Math.abs(analyticsData.revenueData.growth),
            isPositive: analyticsData.revenueData.growth >= 0
          }}
        />

        <StatCard
          title="New Users"
          value={analyticsData.usersData.total.toString()}
          icon={<UsersIcon className="h-6 w-6 text-blue-600" />}
          change={{
            value: Math.abs(analyticsData.usersData.growth),
            isPositive: analyticsData.usersData.growth >= 0
          }}
        />

        <StatCard
          title="Total Orders"
          value={analyticsData.ordersData.total.toString()}
          icon={<ShoppingCartIcon className="h-6 w-6 text-green-600" />}
          change={{
            value: Math.abs(analyticsData.ordersData.growth),
            isPositive: analyticsData.ordersData.growth >= 0
          }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <BarChart
          title="Revenue Trend"
          labels={analyticsData.chartData.labels}
          data={analyticsData.chartData.revenue}
          color="bg-primary"
        />

        <BarChart
          title="User Growth"
          labels={analyticsData.chartData.labels}
          data={analyticsData.chartData.users}
          color="bg-blue-500"
        />
      </div>

      {/* Category Distribution */}
      <PieChart
        title="Category Distribution"
        data={analyticsData.categoryDistribution}
      />

      {/* Top Suppliers */}
      <SupplierTable
        title="Top Performing Suppliers"
        suppliers={analyticsData.topSuppliers}
        formatCurrency={formatCurrency}
      />
    </div>
  );
};

export default AnalyticsPage;

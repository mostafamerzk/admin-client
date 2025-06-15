/**
 * Dashboard Page
 *
 * The main dashboard page for the ConnectChain admin panel.
 */

import React, { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatCurrency } from '../utils/formatters';

import useErrorHandler from '../hooks/useErrorHandler';
import { safeAsyncOperation } from '../utils/errorHandling';
import withErrorBoundary from '../components/common/withErrorBoundary';
import {
  UsersIcon,
  ShoppingCartIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArrowDownTrayIcon,
  DocumentChartBarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

// Import dashboard feature components
import {
  StatCard,
  SalesChart,
  UserGrowthChart,
  CategoryDistributionChart,
  RecentOrders,
  useDashboard
} from '../features/dashboard/index';

const DashboardPage: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [, setActiveTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('month');

  // Use dashboard hook
  const { stats: dashboardData, isLoading, fetchStats } = useDashboard();

  // Error handling
  const {
    handleGeneralError
  } = useErrorHandler({
    enableNotifications: true,
    enableReporting: true
  });

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);

    const result = await safeAsyncOperation(
      async () => {
        // Simulate data refresh with potential failure
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            if (Math.random() < 0.1) {
              reject(new Error('Failed to refresh dashboard data'));
            } else {
              resolve(true);
            }
          }, 1500);
        });

        // Use the dashboard hook's fetchStats method with force refresh
        await fetchStats(true);
        return true;
      },
      {
        timeout: 10000,
        retries: 2,
        operationName: 'Refresh Dashboard'
      }
    );

    if (!result.success) {
      handleGeneralError(result.error, 'Dashboard Refresh');
    }

    setIsRefreshing(false);
  };

  // If data is not loaded yet
  if (isLoading || !dashboardData) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" variant="pulse" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Welcome to ConnectChain Admin Dashboard"
        actions={
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              icon={<ArrowDownTrayIcon className="h-5 w-5" />}
            >
              Export Report
            </Button>
            <Button
              icon={<DocumentChartBarIcon className="h-5 w-5" />}
            >
              Generate Report
            </Button>
            <Button
              variant="outline"
              icon={<ArrowPathIcon className="h-5 w-5" />}
              onClick={handleRefresh}
              loading={isRefreshing}
            >
              Refresh
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Users"
          value={dashboardData.summary.totalUsers.toLocaleString()}
          icon={<UsersIcon className="w-6 h-6 text-primary" />}
          change={{ value: 12, isPositive: true }}
          // onClick={() => console.log('Card clicked')}
        />

        <StatCard
          title="Total Orders"
          value={dashboardData.summary.totalOrders.toLocaleString()}
          icon={<ShoppingCartIcon className="w-6 h-6 text-blue-500" />}
          change={{ value: 8, isPositive: true }}
        />

        <StatCard
          title="Pending Verifications"
          value={dashboardData.summary.pendingVerifications}
          icon={<ClockIcon className="w-6 h-6 text-yellow-500" />}
          change={{ value: 3, isPositive: false }}
        />

        <StatCard
          title="Revenue"
          value={formatCurrency(dashboardData.summary.totalRevenue)}
          icon={<CurrencyDollarIcon className="w-6 h-6 text-green-500" />}
          change={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SalesChart
          data={dashboardData.revenueData.datasets[0]?.data.map((value, index) => ({
            date: dashboardData.revenueData.labels[index] || '',
            amount: value as number
          })) || []}
          onPeriodChange={(period) => setActiveTimeRange(period)}
        />

        <UserGrowthChart
          data={dashboardData.userGrowth.datasets[0]?.data.map((value, index) => ({
            date: dashboardData.userGrowth.labels[index] || '',
            users: value as number
          })) || []}
          onPeriodChange={(period) => setActiveTimeRange(period)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrders
            orders={dashboardData.recentOrders.map(order => ({
              id: order.orderNumber,
              customer: order.customerName,
              amount: order.amount,
              status: order.status as any,
              date: order.date
            }))}
            onViewOrder={(orderId) => console.log('Order clicked:', orderId)}
          />
        </div>

        <CategoryDistributionChart
          data={dashboardData.categoryDistribution}
          title="Category Distribution"
        />
      </div>
    </div>
  );
};

// Wrap with error boundary
export default withErrorBoundary(DashboardPage, {
  fallback: ({ error, resetError }) => (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="text-red-500 text-4xl mb-4">📊</div>
      <h2 className="text-xl font-semibold mb-2">Dashboard Error</h2>
      <p className="text-gray-600 mb-4 text-center max-w-md">
        {error.message || 'An error occurred while loading the dashboard'}
      </p>
      <button
        onClick={resetError}
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
      >
        Reload Dashboard
      </button>
    </div>
  ),
  context: 'DashboardPage'
});

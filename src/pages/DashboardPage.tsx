/**
 * Dashboard Page
 *
 * The main dashboard page for the ConnectChain admin panel.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import PageHeader from '../components/layout/PageHeader.tsx';
import Card from '../components/common/Card.tsx';
import Button from '../components/common/Button.tsx';
import { formatCurrency } from '../utils/formatters.ts';
import { mockDb } from '../mockData/db.ts';
import { DashboardStats } from '../mockData/entities/dashboard.ts';
import { defaultPieChartOptions, destroyChart } from '../utils/chartConfig.ts';
import { Chart as ChartJS } from 'chart.js';
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
  RecentOrders
} from '../features/dashboard/index.ts';

const DashboardPage: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [, setActiveTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const pieChartRef = useRef<ChartJS | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, this would be an API call
        const data = mockDb.getAll<DashboardStats, 'dashboardStats'>('dashboardStats')[0];
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();

    // Cleanup chart instances when component unmounts
    return () => {
      destroyChart(pieChartRef.current);
    };
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      const data = mockDb.getAll<DashboardStats, 'dashboardStats'>('dashboardStats')[0];
      setDashboardData(data);
      setIsRefreshing(false);
    }, 1500);
  };

  // If data is not loaded yet
  if (!dashboardData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
          data={dashboardData.revenueData.datasets[0].data.map((value, index) => ({
            date: dashboardData.revenueData.labels[index],
            amount: value as number
          }))}
          onPeriodChange={(period) => setActiveTimeRange(period)}
        />

        <UserGrowthChart
          data={dashboardData.userGrowth.datasets[0].data.map((value, index) => ({
            date: dashboardData.userGrowth.labels[index],
            users: value as number
          }))}
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

        <Card title="Category Distribution">
          <div className="h-80">
            <Pie
              ref={(ref) => {
                if (ref) {
                  pieChartRef.current = ref;
                }
              }}
              data={{
                labels: dashboardData.categoryDistribution.labels,
                datasets: dashboardData.categoryDistribution.datasets
              }}
              options={defaultPieChartOptions}
            />
          </div>
          <div className="mt-4 space-y-2">
            {dashboardData.categoryDistribution.labels.map((label, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: dashboardData.categoryDistribution.datasets[0].backgroundColor[index] as string }}
                  ></div>
                  <span className="text-sm text-gray-600">{label}</span>
                </div>
                <span className="text-sm font-medium">{dashboardData.categoryDistribution.datasets[0].data[index]}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;

/**
 * DashboardPage Component
 *
 * The main dashboard page for the ConnectChain admin panel.
 */

import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';
import PageHeader from '../components/layout/PageHeader.tsx';
import Card from '../components/common/Card.tsx';
import Button from '../components/common/Button.tsx';
import DataTable from '../components/common/DataTable.tsx';
import Badge from '../components/common/Badge.tsx';
import { formatCurrency } from '../utils/formatters.ts';
import { mockDb } from '../mockData/db.ts';
import { DashboardStats } from '../mockData/entities/dashboard.ts';
import {
  UsersIcon,
  ShoppingCartIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArrowDownTrayIcon,
  DocumentChartBarIcon,
  ArrowPathIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardPage: React.FC = () => {
  const [activeTimeRange, setActiveTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);

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

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Recent orders columns
  const orderColumns = [
    { key: 'orderNumber', label: 'Order ID', sortable: true },
    { key: 'customerName', label: 'Customer', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (value: number) => formatCurrency(value)
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <Badge
          variant={
            value === 'completed' || value === 'approved' ? 'success' :
            value === 'pending' ? 'warning' :
            value === 'rejected' ? 'danger' : 'gray'
          }
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      )
    },
  ];

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
        <Card
          hoverable
          className="transform transition-all duration-300 hover:scale-105"
          onClick={() => console.log('Users card clicked')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{dashboardData.summary.totalUsers.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-primary bg-opacity-10 rounded-lg">
              <UsersIcon className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-500 font-medium">↑ 12%</span>
            <span className="text-sm text-gray-500 ml-2">from last month</span>
          </div>
        </Card>

        <Card
          hoverable
          className="transform transition-all duration-300 hover:scale-105"
          onClick={() => console.log('Orders card clicked')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{dashboardData.summary.totalOrders.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-500 bg-opacity-10 rounded-lg">
              <ShoppingCartIcon className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-500 font-medium">↑ 8%</span>
            <span className="text-sm text-gray-500 ml-2">from last month</span>
          </div>
        </Card>

        <Card
          hoverable
          className="transform transition-all duration-300 hover:scale-105"
          onClick={() => console.log('Pending verifications card clicked')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Verifications</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{dashboardData.summary.pendingVerifications}</p>
            </div>
            <div className="p-3 bg-yellow-500 bg-opacity-10 rounded-lg">
              <ClockIcon className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-red-500 font-medium">↑ 3%</span>
            <span className="text-sm text-gray-500 ml-2">from last month</span>
          </div>
        </Card>

        <Card
          hoverable
          className="transform transition-all duration-300 hover:scale-105"
          onClick={() => console.log('Revenue card clicked')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(dashboardData.summary.totalRevenue)}</p>
            </div>
            <div className="p-3 bg-green-500 bg-opacity-10 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-500 font-medium">↑ 15%</span>
            <span className="text-sm text-gray-500 ml-2">from last month</span>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card
          title="Revenue Trend"
          icon={
            <div className="flex space-x-2">
              {['day', 'week', 'month', 'year'].map((range) => (
                <button
                  key={range}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    activeTimeRange === range
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveTimeRange(range as any)}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
              <button className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                <EllipsisHorizontalIcon className="h-5 w-5" />
              </button>
            </div>
          }
        >
          <div className="h-80">
            <Line
              data={{
                labels: dashboardData.revenueData.labels,
                datasets: dashboardData.revenueData.datasets
              }}
              options={chartOptions}
            />
          </div>
        </Card>

        <Card
          title="User Growth"
          icon={
            <button className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100">
              <EllipsisHorizontalIcon className="h-5 w-5" />
            </button>
          }
        >
          <div className="h-80">
            <Line
              data={{
                labels: dashboardData.userGrowth.labels,
                datasets: dashboardData.userGrowth.datasets
              }}
              options={chartOptions}
            />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DataTable
            title="Recent Orders"
            description="Latest orders from customers"
            columns={orderColumns}
            data={dashboardData.recentOrders}
            onRowClick={(order) => console.log('Order clicked:', order)}
            pagination={false}
          />
        </div>

        <Card title="Category Distribution">
          <div className="h-80">
            <Pie
              data={{
                labels: dashboardData.categoryDistribution.labels,
                datasets: dashboardData.categoryDistribution.datasets
              }}
              options={chartOptions}
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
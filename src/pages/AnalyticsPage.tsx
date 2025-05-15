/**
 * AnalyticsPage Component
 *
 * The analytics page for the ConnectChain admin panel.
 */

import React, { useState } from 'react';
import PageHeader from '../components/layout/PageHeader.tsx';
import Card from '../components/common/Card.tsx';
import Button from '../components/common/Button.tsx';
import { ChartBarIcon, UsersIcon, CurrencyDollarIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { mockDb } from '../mockData/db.ts';
import { DashboardStats } from '../mockData/entities/dashboard.ts';

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month');
  const dashboardStats = mockDb.getAll<DashboardStats, 'dashboardStats'>('dashboardStats')[0];

  // Mock data for different time ranges
  const getDataForTimeRange = (range: string) => {
    switch (range) {
      case 'week':
        return {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          revenue: [3000, 4500, 3800, 5200, 4800, 6000, 5500],
          users: [15, 22, 18, 25, 20, 30, 28],
          orders: [45, 65, 55, 75, 60, 90, 85]
        };
      case 'month':
        return {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          revenue: [18000, 22000, 25000, 30000],
          users: [85, 110, 125, 150],
          orders: [270, 330, 375, 450]
        };
      case 'quarter':
        return {
          labels: ['Jan', 'Feb', 'Mar'],
          revenue: [75000, 85000, 95000],
          users: [350, 400, 450],
          orders: [1100, 1250, 1400]
        };
      case 'year':
        return {
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          revenue: [250000, 300000, 350000, 400000],
          users: [1200, 1500, 1800, 2100],
          orders: [3800, 4500, 5200, 6000]
        };
      default:
        return {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          revenue: [18000, 22000, 25000, 30000],
          users: [85, 110, 125, 150],
          orders: [270, 330, 375, 450]
        };
    }
  };

  const data = getDataForTimeRange(timeRange);

  // Calculate totals and growth
  const calculateGrowth = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100;
  };

  const getTotalAndGrowth = (data: number[]) => {
    const total = data.reduce((sum, value) => sum + value, 0);
    const previousTotal = total * 0.85; // Mock previous period (15% less)
    const growth = calculateGrowth(total, previousTotal);
    return { total, growth };
  };

  const revenueData = getTotalAndGrowth(data.revenue);
  const usersData = getTotalAndGrowth(data.users);
  const ordersData = getTotalAndGrowth(data.orders);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="View detailed analytics and reports for your platform"
        breadcrumbs={[{ label: 'Analytics' }]}
        actions={
          <div className="flex space-x-2">
            <Button
              variant={timeRange === 'week' ? 'primary' : 'outline'}
              onClick={() => setTimeRange('week')}
            >
              Week
            </Button>
            <Button
              variant={timeRange === 'month' ? 'primary' : 'outline'}
              onClick={() => setTimeRange('month')}
            >
              Month
            </Button>
            <Button
              variant={timeRange === 'quarter' ? 'primary' : 'outline'}
              onClick={() => setTimeRange('quarter')}
            >
              Quarter
            </Button>
            <Button
              variant={timeRange === 'year' ? 'primary' : 'outline'}
              onClick={() => setTimeRange('year')}
            >
              Year
            </Button>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary bg-opacity-10">
              <CurrencyDollarIcon className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700">Total Revenue</h3>
              <div className="flex items-center">
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenueData.total)}</p>
                <span className={`ml-2 text-sm font-medium ${revenueData.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {revenueData.growth >= 0 ? '+' : ''}{revenueData.growth.toFixed(1)}%
                </span>
              </div>
              <p className="text-sm text-gray-500">vs previous period</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <UsersIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700">New Users</h3>
              <div className="flex items-center">
                <p className="text-2xl font-bold text-gray-900">{usersData.total}</p>
                <span className={`ml-2 text-sm font-medium ${usersData.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {usersData.growth >= 0 ? '+' : ''}{usersData.growth.toFixed(1)}%
                </span>
              </div>
              <p className="text-sm text-gray-500">vs previous period</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <ShoppingCartIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
              <div className="flex items-center">
                <p className="text-2xl font-bold text-gray-900">{ordersData.total}</p>
                <span className={`ml-2 text-sm font-medium ${ordersData.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {ordersData.growth >= 0 ? '+' : ''}{ordersData.growth.toFixed(1)}%
                </span>
              </div>
              <p className="text-sm text-gray-500">vs previous period</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="Revenue Trend">
          <div className="h-80 flex items-center justify-center">
            <div className="w-full h-full">
              {/* Chart would go here - using a placeholder */}
              <div className="w-full h-full flex flex-col">
                <div className="flex justify-between mb-4">
                  {data.labels.map((label, index) => (
                    <div key={index} className="text-xs text-gray-500">{label}</div>
                  ))}
                </div>
                <div className="flex-1 flex items-end">
                  {data.revenue.map((value, index) => {
                    const height = `${(value / Math.max(...data.revenue)) * 100}%`;
                    return (
                      <div key={index} className="flex-1 mx-1">
                        <div
                          className="bg-primary rounded-t-md w-full transition-all duration-500"
                          style={{ height }}
                        ></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card title="User Growth">
          <div className="h-80 flex items-center justify-center">
            <div className="w-full h-full">
              {/* Chart would go here - using a placeholder */}
              <div className="w-full h-full flex flex-col">
                <div className="flex justify-between mb-4">
                  {data.labels.map((label, index) => (
                    <div key={index} className="text-xs text-gray-500">{label}</div>
                  ))}
                </div>
                <div className="flex-1 flex items-end">
                  {data.users.map((value, index) => {
                    const height = `${(value / Math.max(...data.users)) * 100}%`;
                    return (
                      <div key={index} className="flex-1 mx-1">
                        <div
                          className="bg-blue-500 rounded-t-md w-full transition-all duration-500"
                          style={{ height }}
                        ></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Category Distribution */}
      <Card title="Category Distribution" className="mb-6">
        <div className="h-80 flex items-center justify-center">
          <div className="w-full h-full">
            {/* Pie chart would go here - using a placeholder */}
            <div className="flex justify-center items-center h-full">
              <div className="w-64 h-64 rounded-full border-8 border-gray-200 relative">
                {dashboardStats.categoryDistribution.datasets[0].data.map((value, index) => {
                  const color = dashboardStats.categoryDistribution.datasets[0].backgroundColor[index];
                  const total = dashboardStats.categoryDistribution.datasets[0].data.reduce((a, b) => a + b, 0);
                  const percentage = (value / total) * 100;

                  return (
                    <div
                      key={index}
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        clipPath: `polygon(50% 50%, 50% 0, ${50 + 50 * Math.cos(Math.PI * 2 * (percentage / 100))}% ${50 - 50 * Math.sin(Math.PI * 2 * (percentage / 100))}%, 50% 50%)`,
                        transform: `rotate(${index * 72}deg)`,
                        backgroundColor: color
                      }}
                    >
                    </div>
                  );
                })}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-700">Categories</p>
                      <p className="text-sm text-gray-500">Distribution</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {dashboardStats.categoryDistribution.labels.map((label, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: dashboardStats.categoryDistribution.datasets[0].backgroundColor[index] }}
                ></div>
                <span className="text-sm text-gray-700">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Top Suppliers */}
      <Card title="Top Performing Suppliers">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboardStats.topSuppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{supplier.products}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{supplier.orders}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatCurrency(supplier.revenue)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsPage;

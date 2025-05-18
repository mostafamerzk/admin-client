import React from 'react';
import { CurrencyDollarIcon, ShoppingCartIcon, ClockIcon } from '@heroicons/react/24/outline';
import MetricsSection from '../../../components/analytics/MetricsSection';
import type { Metric } from '../../../components/analytics/MetricsSection';
import ChartSection from '../../../components/analytics/ChartSection';
import BarChart from '../../analytics/components/BarChart';
import { formatCurrency } from '../../../utils/formatters';

interface UserAnalyticsProps {
  userId: string;
  userData: {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    orderFrequency: number;
    orderHistory: {
      date: string;
      amount: number;
    }[];
  };
}

const UserAnalytics: React.FC<UserAnalyticsProps> = ({
  userId,
  userData
}) => {
  // Prepare metrics
  const metrics: Metric[] = [
    {
      title: 'Total Orders',
      value: userData.totalOrders,
      icon: <ShoppingCartIcon className="w-6 h-6 text-blue-500" />
    },
    {
      title: 'Total Spent',
      value: formatCurrency(userData.totalSpent),
      icon: <CurrencyDollarIcon className="w-6 h-6 text-green-500" />
    },
    {
      title: 'Average Order',
      value: formatCurrency(userData.averageOrderValue),
      icon: <ClockIcon className="w-6 h-6 text-purple-500" />
    }
  ];
  
  // Prepare chart data
  const chartData = userData.orderHistory.map(item => ({
    label: item.date,
    value: item.amount
  }));
  
  return (
    <div className="space-y-6">
      <MetricsSection metrics={metrics} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSection title="Order History" description="User's order history over time">
          <BarChart
            title="Order History" // Optional
            data={chartData.map(item => item.value)}
            labels={chartData.map(item => item.label)}
            color="bg-primary" // Primary color (optional)
          />
        </ChartSection>
      </div>
    </div>
  );
};

export default UserAnalytics;
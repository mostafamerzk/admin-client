/**
 * Supplier Analytics Component
 *
 * This component displays supplier performance metrics and charts
 * following the same analytics layout as other analytics pages.
 */

import React from 'react';
import { CurrencyDollarIcon, ShoppingCartIcon, CubeIcon } from '@heroicons/react/24/outline';
import MetricsSection from '../../../components/common/MetricsSection';
import type { Metric } from '../../../components/common/MetricsSection';
import ChartSection from '../../../components/analytics/ChartSection';
import SimpleBarChart from '../../../components/common/SimpleBarChart';
import SimplePieChart from '../../../components/common/SimplePieChart';
// import DetailSection from '../../../components/common/DetailSection';
import { formatCurrency } from '../../../utils/formatters';
import type { SupplierAnalyticsData } from '../types';

interface SupplierAnalyticsProps {
  supplierData: SupplierAnalyticsData;
  supplierId: string;
}

const SupplierAnalytics: React.FC<SupplierAnalyticsProps> = ({ supplierData, supplierId: _supplierId }) => {
  // Prepare metrics
  const metrics: Metric[] = [
    {
      title: 'Total Orders',
      value: supplierData.totalOrders,
      icon: <ShoppingCartIcon className="w-6 h-6 text-blue-500" />
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(supplierData.totalRevenue),
      icon: <CurrencyDollarIcon className="w-6 h-6 text-green-500" />
    },
    {
      title: 'Products',
      value: supplierData.productCount,
      icon: <CubeIcon className="w-6 h-6 text-purple-500" />
    },
    
  ];

  // Prepare chart data
  const revenueChartData = supplierData.revenueHistory.map(item => ({
    label: item.date,
    value: item.amount
  }));

  const productChartData = supplierData.salesByProduct.map(item => ({
    label: item.productName,
    value: item.amount
  }));

  const orderTrendsData = supplierData.orderTrends.map(item => ({
    label: item.date,
    value: item.orders
  }));

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <MetricsSection metrics={metrics} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSection title="Revenue History" description="Supplier's revenue over time">
          <SimpleBarChart
            data={revenueChartData.map(item => item.value)}
            labels={revenueChartData.map(item => item.label)}
            title="Revenue History"
            color="#F28B22" // Primary color
          />
        </ChartSection>

        <ChartSection title="Order Trends" description="Number of orders over time">
          <SimpleBarChart
            data={orderTrendsData.map(item => item.value)}
            labels={orderTrendsData.map(item => item.label)}
            title="Order Trends"
            color="#3B82F6" // Blue color
          />
        </ChartSection>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSection title="Sales by Product" description="Revenue distribution by product">
          <SimplePieChart
            title="Sales by Product"
            data={{
              labels: productChartData.map(item => item.label),
              datasets: [{
                data: productChartData.map(item => item.value),
                backgroundColor: ['#F28B22', '#F9B16F', '#D17311', '#FFC380', '#A85A0D']
              }]
            }}
          />
        </ChartSection>

        <ChartSection title="Top Categories" description="Revenue by product category">
          <SimplePieChart
            title="Top Categories"
            data={{
              labels: supplierData.topCategories.map(item => item.category),
              datasets: [{
                data: supplierData.topCategories.map(item => item.revenue),
                backgroundColor: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444']
              }]
            }}
          />
        </ChartSection>
      </div>

      {/* Performance Summary
      <DetailSection
        title="Performance Summary"
        description="Key performance indicators and insights"
      >
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{supplierData.totalOrders}</div>
              <div className="text-sm text-gray-500">Total Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{formatCurrency(supplierData.totalRevenue)}</div>
              <div className="text-sm text-gray-500">Total Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(supplierData.averageOrderValue)}</div>
              <div className="text-sm text-gray-500">Average Order Value</div>
            </div>
          </div>
        </div>
      </DetailSection> */}
    </div>
  );
};

export default SupplierAnalytics;
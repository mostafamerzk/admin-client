import React from 'react';
import { CurrencyDollarIcon, ShoppingCartIcon, CubeIcon } from '@heroicons/react/24/outline';
import MetricsSection from '../../../components/analytics/MetricsSection';
import type { Metric } from '../../../components/analytics/MetricsSection';import ChartSection from '../../../components/analytics/ChartSection';
import BarChart from '../../analytics/components/BarChart';
import PieChart from '../../analytics/components/PieChart';
import { formatCurrency } from '../../../utils/formatters';

interface SupplierAnalyticsProps {
  supplierId: string;  supplierData: {
    totalOrders: number;    totalRevenue: number;
    productCount: number;    salesByProduct: {
      productName: string;      amount: number;
    }[];    revenueHistory: {
      date: string;      amount: number;
    }[];  };
}
const SupplierAnalytics: React.FC<SupplierAnalyticsProps> = ({ supplierData }) => {
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
    }
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
  
  return (
    <div className="space-y-6">
      <MetricsSection metrics={metrics} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSection title="Revenue History" description="Supplier's revenue over time">
          <BarChart
             data={revenueChartData.map(item => item.value)}
            labels={revenueChartData.map(item => item.label)}
            title="Revenue History"
            color="#F28B22" // Primary color
          />
        </ChartSection>
        
        <ChartSection title="Sales by Product" description="Revenue distribution by product">
          <PieChart
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
      </div>
    </div>
  );
};
export default SupplierAnalytics;












































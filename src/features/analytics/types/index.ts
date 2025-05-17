/**
 * Analytics Types
 *
 * This file defines the TypeScript interfaces for the analytics feature.
 */

export type TimeRange = 'week' | 'month' | 'quarter' | 'year';

export interface ChartData {
  labels: string[];
  revenue: number[];
  users: number[];
  orders: number[];
}

export interface MetricData {
  total: number;
  growth: number;
}

export interface CategoryDistribution {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
  }[];
}

export interface Supplier {
  id: string;
  name: string;
  products: number;
  orders: number;
  revenue: number;
}

export interface AnalyticsData {
  timeRange: TimeRange;
  chartData: ChartData;
  revenueData: MetricData;
  usersData: MetricData;
  ordersData: MetricData;
  categoryDistribution: CategoryDistribution;
  topSuppliers: Supplier[];
}

// Legacy types kept for compatibility
export interface AnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalSuppliers: number;
  averageOrderValue: number;
  conversionRate: number;
}

export interface SalesTrendData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    fill?: boolean;
  }[];
}

export interface UserGrowthData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    fill?: boolean;
  }[];
}

export interface CategoryDistributionData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
  }[];
}

export interface TopProductData {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  category: string;
}

export interface TopSupplierData {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  products: number;
}

export interface GeographicData {
  regions: {
    name: string;
    value: number;
  }[];
  countries: {
    name: string;
    value: number;
  }[];
}

export type AnalyticsTimeRange = 'day' | 'week' | 'month' | 'quarter' | 'year';

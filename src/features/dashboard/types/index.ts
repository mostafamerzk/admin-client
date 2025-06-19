/**
 * Dashboard Types
 *
 * This file defines the TypeScript interfaces for the dashboard feature.
 */

// Backend API Response Types (matching expected backend format)
export interface DashboardStatsResponse {
  totalUsers: number;
  totalSuppliers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingVerifications: number;
  activeUsers: number;
  monthlyGrowth: {
    users: number;
    orders: number;
    revenue: number;
  };
}

export interface SalesDataResponse {
  period: string;
  data: {
    date: string;
    sales: number;
    orders: number;
  }[];
  total: number;
  growth: number;
}

export interface UserGrowthResponse {
  period: string;
  data: {
    date: string;
    newUsers: number;
    totalUsers: number;
  }[];
  growth: number;
}

export interface CategoryDistributionResponse {
  category: string;
  count: number;
  percentage: number;
  revenue: number;
}

// Frontend UI Types (for components and charts)
export interface DashboardStats {
  summary: {
    totalUsers: number;
    totalSuppliers: number;
    totalOrders: number;
    totalRevenue: number;
    pendingVerifications: number;
    activeUsers: number;
  };
  monthlyGrowth: {
    users: number;
    orders: number;
    revenue: number;
  };
  revenueData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
  userGrowth: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
  categoryDistribution: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      borderWidth: number;
    }[];
  };
  recentOrders: {
    id: string;
    orderNumber: string;
    customerName: string;
    date: string;
    amount: number;
    status: string;
  }[];
  topSuppliers: {
    id: string;
    name: string;
    products: number;
    orders: number;
    revenue: number;
  }[];
}

export interface RecentOrder {
  id: string;
  customer: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'approved' | 'rejected';
  date: string;
}

export interface SalesData {
  date: string;
  amount: number;
  orders?: number;
}

export interface UserGrowth {
  date: string;
  users: number;
  newUsers?: number;
  totalUsers?: number;
}

export interface CategoryDistributionData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
    borderWidth?: number;
  }[];
}

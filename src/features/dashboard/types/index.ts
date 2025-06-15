/**
 * Dashboard Types
 *
 * This file defines the TypeScript interfaces for the dashboard feature.
 */

export interface DashboardStats {
  summary: {
    totalUsers: number;
    totalSuppliers: number;
    totalOrders: number;
    totalRevenue: number;
    pendingVerifications: number;
    activeProducts: number;
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
}

export interface UserGrowth {
  date: string;
  users: number;
}

export interface CategoryDistributionData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
  }[];
}

/**
 * Dashboard Types
 * 
 * This file defines the TypeScript interfaces for the dashboard feature.
 */

export interface DashboardStats {
  totalUsers: number;
  totalSuppliers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingVerifications: number;
  recentOrders: RecentOrder[];
  salesData: SalesData[];
  userGrowth: UserGrowth[];
}

export interface RecentOrder {
  id: string;
  customer: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
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

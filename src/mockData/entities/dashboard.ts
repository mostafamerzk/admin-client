/**
 * Mock Dashboard Data
 * 
 * This file contains mock data for the dashboard statistics in the ConnectChain admin panel.
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

export const dashboardStats: DashboardStats = {
  summary: {
    totalUsers: 1234,
    totalSuppliers: 56,
    totalOrders: 789,
    totalRevenue: 123456.78,
    pendingVerifications: 12,
    activeProducts: 4567
  },
  revenueData: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        borderColor: '#F28B22',
        backgroundColor: 'rgba(242, 139, 34, 0.1)',
      }
    ]
  },
  userGrowth: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Users',
        data: [65, 78, 90, 81, 95, 110],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
      }
    ]
  },
  categoryDistribution: {
    labels: ['Electronics', 'Clothing', 'Food', 'Furniture', 'Office Supplies'],
    datasets: [
      {
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          '#F28B22',
          '#10B981',
          '#3B82F6',
          '#8B5CF6',
          '#EC4899',
        ],
        borderWidth: 0,
      }
    ]
  },
  recentOrders: [
    {
      id: '1',
      orderNumber: 'ORD-2024-0001',
      customerName: 'John Doe',
      date: '2024-01-15',
      amount: 1500.00,
      status: 'pending'
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-0002',
      customerName: 'Emily Davis',
      date: '2024-01-14',
      amount: 750.50,
      status: 'approved'
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-0003',
      customerName: 'Sarah Brown',
      date: '2024-01-10',
      amount: 325.75,
      status: 'completed'
    },
    {
      id: '4',
      orderNumber: 'ORD-2024-0004',
      customerName: 'John Doe',
      date: '2024-01-12',
      amount: 180.25,
      status: 'rejected'
    },
    {
      id: '5',
      orderNumber: 'ORD-2024-0005',
      customerName: 'Emily Davis',
      date: '2024-01-15',
      amount: 899.97,
      status: 'pending'
    }
  ],
  topSuppliers: [
    {
      id: '1',
      name: 'Tech Supplies Inc',
      products: 156,
      orders: 45,
      revenue: 67890.50
    },
    {
      id: '2',
      name: 'Office Solutions Ltd',
      products: 243,
      orders: 38,
      revenue: 45678.25
    },
    {
      id: '5',
      name: 'Food Distributors Co',
      products: 189,
      orders: 27,
      revenue: 32456.75
    }
  ]
};

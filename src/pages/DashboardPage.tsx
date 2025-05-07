import React, { useState } from 'react';
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
import Card from '../components/Card.tsx';
import Button from '../components/Button.tsx';
import DataTable from '../components/DataTable.tsx';
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

  // Sample data for charts
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: '#F28B22',
        backgroundColor: 'rgba(242, 139, 34, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const categoryData = {
    labels: ['Electronics', 'Clothing', 'Food', 'Other'],
    datasets: [
      {
        data: [30, 25, 20, 25],
        backgroundColor: [
          '#F28B22',
          '#D1D1D1',
          '#4CAF50',
          '#2196F3',
        ],
        borderWidth: 0,
      },
    ],
  };

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [4500, 5200, 3800, 5100, 4200, 6300],
        backgroundColor: '#F28B22',
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
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

  // Recent orders data
  const recentOrders = [
    {
      id: 'ORD-001',
      customerName: 'John Doe',
      date: '2024-01-15',
      amount: 1250.00,
      status: 'completed',
    },
    {
      id: 'ORD-002',
      customerName: 'Jane Smith',
      date: '2024-01-14',
      amount: 850.50,
      status: 'pending',
    },
    {
      id: 'ORD-003',
      customerName: 'Robert Johnson',
      date: '2024-01-13',
      amount: 1120.75,
      status: 'approved',
    },
    {
      id: 'ORD-004',
      customerName: 'Emily Davis',
      date: '2024-01-12',
      amount: 450.25,
      status: 'completed',
    },
  ];

  const orderColumns = [
    { key: 'id', label: 'Order ID', sortable: true },
    { key: 'customerName', label: 'Customer', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (value: number) => `$${value.toFixed(2)}`
    },
    { key: 'status', label: 'Status', sortable: true },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome to ConnectChain Admin Dashboard</p>
        </div>
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
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          hoverable
          className="transform transition-all duration-300 hover:scale-105"
          onClick={() => console.log('Users card clicked')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">1,234</p>
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
              <p className="text-2xl font-bold text-gray-900 mt-1">567</p>
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
          onClick={() => console.log('Pending actions card clicked')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Actions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">23</p>
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
              <p className="text-2xl font-bold text-gray-900 mt-1">$45,678</p>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Sales Trend"
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
            <Line data={salesData} options={chartOptions} />
          </div>
        </Card>

        <Card
          title="Revenue Overview"
          icon={
            <button className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100">
              <EllipsisHorizontalIcon className="h-5 w-5" />
            </button>
          }
        >
          <div className="h-80">
            <Bar data={revenueData} options={chartOptions} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DataTable
            title="Recent Orders"
            description="Latest orders from customers"
            columns={orderColumns}
            data={recentOrders}
            onRowClick={(order) => console.log('Order clicked:', order)}
          />
        </div>

        <Card title="Sales by Category">
          <div className="h-80">
            <Pie data={categoryData} options={chartOptions} />
          </div>
          <div className="mt-4 space-y-2">
            {categoryData.labels?.map((label, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: categoryData.datasets[0].backgroundColor[index] as string }}
                  ></div>
                  <span className="text-sm text-gray-600">{label}</span>
                </div>
                <span className="text-sm font-medium">{categoryData.datasets[0].data[index]}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
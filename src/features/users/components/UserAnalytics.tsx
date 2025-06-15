import React from 'react';
import { CurrencyDollarIcon, ShoppingCartIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Line } from 'react-chartjs-2';
import MetricsSection from '../../../components/common/MetricsSection';
import type { Metric } from '../../../components/common/MetricsSection';
import { formatCurrency } from '../../../utils/formatters';
import { defaultLineChartOptions } from '../../../utils/chartConfig';

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
  userId: _userId,
  userData
}) => {
  // Validate userData to prevent runtime errors
  const safeUserData = {
    totalOrders: userData?.totalOrders || 0,
    totalSpent: userData?.totalSpent || 0,
    averageOrderValue: userData?.averageOrderValue || 0,
    orderFrequency: userData?.orderFrequency || 0,
    orderHistory: userData?.orderHistory || []
  };



  // Prepare metrics with safe data and new analytics
  const metrics: Metric[] = [
    {
      title: 'Total Orders',
      value: safeUserData.totalOrders,
      icon: <ShoppingCartIcon className="w-6 h-6 text-blue-500" />
    },
    {
      title: 'Total Spent',
      value: formatCurrency(safeUserData.totalSpent),
      icon: <CurrencyDollarIcon className="w-6 h-6 text-green-500" />
    },
    {
      title: 'Average Order',
      value: formatCurrency(safeUserData.averageOrderValue),
      icon: <ClockIcon className="w-6 h-6 text-purple-500" />
    },
  ];
  
  // Helper function to format date for chart labels
  const formatDateForChart = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      // Format as MM/DD or MM/DD/YY for better readability
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: '2-digit'
      });
    } catch (error) {
      // Fallback to original string if date parsing fails
      return dateString;
    }
  };

  // Prepare spending trend data for Line chart
  const prepareSpendingTrendData = () => {
    if (safeUserData.orderHistory.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{
          label: 'Spending Trend',
          data: [0],
          borderColor: '#F28B22',
          backgroundColor: 'rgba(242, 139, 34, 0.1)',
          fill: true,
          tension: 0.4
        }]
      };
    }

    // Sort orders by date and calculate cumulative spending
    const sortedOrders = safeUserData.orderHistory
      .filter(item => item && item.date && typeof item.amount === 'number')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let cumulativeSpending = 0;
    const trendData = sortedOrders.map(order => {
      cumulativeSpending += order.amount;
      return {
        label: formatDateForChart(order.date),
        value: cumulativeSpending
      };
    });

    return {
      labels: trendData.map(item => item.label),
      datasets: [{
        label: 'Cumulative Spending',
        data: trendData.map(item => item.value),
        borderColor: '#F28B22',
        backgroundColor: 'rgba(242, 139, 34, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#F28B22',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4
      }]
    };
  };

  const spendingTrendData = prepareSpendingTrendData();
  
  return (
    <div className="space-y-6">
      <MetricsSection metrics={metrics} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Trend Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Spending Trend</h3>
            <p className="text-sm text-gray-500">
              {safeUserData.orderHistory.length > 0
                ? "Cumulative spending over time"
                : "No spending data available"
              }
            </p>
          </div>

          {safeUserData.orderHistory.length > 0 ? (
            <div className="h-80">
              <Line
                data={spendingTrendData}
                options={{
                  ...defaultLineChartOptions,
                  plugins: {
                    ...defaultLineChartOptions.plugins,
                    title: {
                      display: false
                    },
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    ...defaultLineChartOptions.scales,
                    y: {
                      ...defaultLineChartOptions.scales?.y,
                      ticks: {
                        ...defaultLineChartOptions.scales?.y?.ticks,
                        callback: function(value) {
                          return formatCurrency(value as number);
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-400 text-4xl mb-4">�</div>
                <p className="text-gray-500 text-lg font-medium">No Spending Data</p>
                <p className="text-gray-400 text-sm mt-2">
                  Spending trends will appear here once the user places orders
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Order Frequency Analysis */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Order Frequency</h3>
            <p className="text-sm text-gray-500">Order patterns and frequency analysis</p>
          </div>

          <div className="space-y-4">
            {safeUserData.orderHistory.length > 0 ? (
              <>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Most Recent Order</span>
                  <span className="text-sm text-gray-900">
                    {(() => {
                      const lastOrder = safeUserData.orderHistory[safeUserData.orderHistory.length - 1];
                      return lastOrder?.date ? formatDateForChart(lastOrder.date) : 'N/A';
                    })()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">First Order</span>
                  <span className="text-sm text-gray-900">
                    {(() => {
                      const firstOrder = safeUserData.orderHistory[0];
                      return firstOrder?.date ? formatDateForChart(firstOrder.date) : 'N/A';
                    })()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Largest Order</span>
                  <span className="text-sm text-gray-900">
                    {formatCurrency(Math.max(...safeUserData.orderHistory.map(order => order.amount)))}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Smallest Order</span>
                  <span className="text-sm text-gray-900">
                    {formatCurrency(Math.min(...safeUserData.orderHistory.map(order => order.amount)))}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-3xl mb-3">📊</div>
                <p className="text-gray-500 font-medium">No Order Data</p>
                <p className="text-gray-400 text-sm mt-1">
                  Order frequency analysis will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAnalytics;
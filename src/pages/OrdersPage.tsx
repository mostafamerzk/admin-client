/**
 * Orders Page
 *
 * This page displays and manages orders in the system.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import PageHeader from '../components/layout/PageHeader';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { ROUTES } from '../constants/routes';
import {
  OrderList,
  OrderFilter,
  Order,
  getMockOrders
} from '../features/orders/index';

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  // In a real implementation, we would use the useOrders hook
  // const { orders, isLoading, updateOrderStatus, exportOrders } = useOrders();

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'completed' | 'rejected'>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Use mock data from the centralized mock data file
  const [orders] = useState<Order[]>(getMockOrders());

  const filteredOrders = orders.filter(order => {
    if (activeFilter === 'all') return true;
    return order.status === activeFilter;
  });

  const handleOrderClick = (order: Order) => {
    navigate(ROUTES.getOrderDetailsRoute(order.id));
  };

  const handleExportOrders = () => {
    setIsLoading(true);
    // Simulate export process
    setTimeout(() => {
      setIsLoading(false);
      console.log('Exporting orders...');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="Manage and track all orders in the system"
        actions={
          <Button
            variant="outline"
            icon={<ArrowDownTrayIcon className="h-5 w-5" />}
            onClick={handleExportOrders}
            loading={isLoading}
          >
            Export Orders
          </Button>
        }
      />

      <Card>
        <OrderFilter
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        <OrderList
          orders={filteredOrders}
          onOrderClick={handleOrderClick}
          title={`${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Orders (${filteredOrders.length})`}
        />
      </Card>
    </div>
  );
};

export default OrdersPage;
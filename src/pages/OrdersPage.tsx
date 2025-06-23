/**
 * Orders Page
 *
 * This page displays and manages orders in the system.
 */

import React, { useState, useMemo, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import PageHeader from '../components/layout/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { ROUTES } from '../constants/routes';
import {
  OrderList,
  OrderFilter,
  Order,
  useOrders
} from '../features/orders/index';

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();

  // Use the useOrders hook for API integration
  const { orders, isLoading } = useOrders();

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'completed' | 'rejected'>('all');
  const [isExporting, setIsExporting] = useState(false);

  // Memoize filtered orders to prevent unnecessary recalculations
  const filteredOrders = useMemo(() => {
    if (activeFilter === 'all') return orders;
    return orders.filter(order => order.status === activeFilter);
  }, [orders, activeFilter]);

  // Memoize event handlers to prevent unnecessary re-renders
  const handleOrderClick = useCallback((order: Order) => {
    navigate(ROUTES.getOrderDetailsRoute(String(order.id)));
  }, [navigate]);

  const handleExportOrders = useCallback(() => {
    setIsExporting(true);
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      console.log('Exporting orders...');
    }, 1500);
  }, []);

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
            loading={isExporting}
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

        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <OrderList
            orders={filteredOrders}
            onOrderClick={handleOrderClick}
            title={`${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Orders (${filteredOrders.length})`}
          />
        )}
      </Card>
    </div>
  );
};

export default memo(OrdersPage);
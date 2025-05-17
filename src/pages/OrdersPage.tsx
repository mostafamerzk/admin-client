/**
 * Orders Page
 *
 * This page displays and manages orders in the system.
 */

import React, { useState } from 'react';
import Card from '../components/common/Card.tsx';
import Button from '../components/common/Button.tsx';
import Modal from '../components/common/Modal.tsx';
import PageHeader from '../components/layout/PageHeader.tsx';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import {
  OrderList,
  OrderDetails,
  OrderFilter,
  Order,
  getMockOrders
} from '../features/orders/index.ts';

const OrdersPage: React.FC = () => {
  // In a real implementation, we would use the useOrders hook
  // const { orders, isLoading, updateOrderStatus, exportOrders } = useOrders();

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'completed' | 'rejected'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);

  // Use mock data from the centralized mock data file
  const [orders] = useState<Order[]>(getMockOrders());

  const filteredOrders = orders.filter(order => {
    if (activeFilter === 'all') return true;
    return order.status === activeFilter;
  });

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDetailsModalOpen(true);
  };

  const handleExportOrders = () => {
    setIsLoading(true);
    // Simulate export process
    setTimeout(() => {
      setIsLoading(false);
      console.log('Exporting orders...');
    }, 1500);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: 'pending' | 'approved' | 'rejected' | 'completed') => {
    // In a real implementation, we would call the updateOrderStatus function from the useOrders hook
    console.log(`Updating order ${orderId} status to ${newStatus}`);
    setIsOrderDetailsModalOpen(false);
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

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          isOpen={isOrderDetailsModalOpen}
          onClose={() => setIsOrderDetailsModalOpen(false)}
          title="Order Details"
          size="lg"
          footer={
            <>
              <Button
                variant="outline"
                onClick={() => setIsOrderDetailsModalOpen(false)}
              >
                Close
              </Button>
              {selectedOrder.status === 'pending' && (
                <>
                  <Button
                    variant="danger"
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'rejected')}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="success"
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'approved')}
                  >
                    Approve
                  </Button>
                </>
              )}
              {selectedOrder.status === 'approved' && (
                <Button
                  variant="primary"
                  onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'completed')}
                >
                  Mark as Completed
                </Button>
              )}
            </>
          }
        >
          <OrderDetails order={selectedOrder} />
        </Modal>
      )}
    </div>
  );
};

export default OrdersPage;
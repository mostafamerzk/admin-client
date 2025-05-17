/**
 * Orders Hook
 * 
 * This hook provides methods and state for working with orders.
 */

import { useState, useCallback, useEffect } from 'react';
import { Order, OrderUpdateData } from '../types/index.ts';
import ordersApi from '../api/ordersApi.ts';
import useNotification from '../../../hooks/useNotification.ts';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showNotification } = useNotification();

  // Fetch all orders
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ordersApi.getOrders();
      setOrders(data);
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch orders'
      });
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Get an order by ID
  const getOrderById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const order = await ordersApi.getOrderById(id);
      return order;
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: `Failed to fetch order ${id}`
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Update an order
  const updateOrder = useCallback(async (id: string, orderData: OrderUpdateData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedOrder = await ordersApi.updateOrder(id, orderData);
      setOrders(prevOrders => 
        prevOrders.map(order => order.id === id ? updatedOrder : order)
      );
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'Order updated successfully'
      });
      return updatedOrder;
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update order'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Cancel an order
  const cancelOrder = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const cancelledOrder = await ordersApi.cancelOrder(id);
      setOrders(prevOrders => 
        prevOrders.map(order => order.id === id ? cancelledOrder : order)
      );
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'Order cancelled successfully'
      });
      return cancelledOrder;
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to cancel order'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Get orders by status
  const getOrdersByStatus = useCallback(async (status: Order['status']) => {
    setIsLoading(true);
    setError(null);
    try {
      const filteredOrders = await ordersApi.getOrdersByStatus(status);
      return filteredOrders;
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: `Failed to fetch orders with status ${status}`
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Get orders by customer
  const getOrdersByCustomer = useCallback(async (customerId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const customerOrders = await ordersApi.getOrdersByCustomer(customerId);
      return customerOrders;
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: `Failed to fetch orders for customer ${customerId}`
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Load orders on mount
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    isLoading,
    error,
    fetchOrders,
    getOrderById,
    updateOrder,
    cancelOrder,
    getOrdersByStatus,
    getOrdersByCustomer
  };
};

export default useOrders;

/**
 * Orders Hook
 *
 * This hook provides methods and state for working with orders.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type { Order, OrderUpdateData } from '../types/index';
import ordersApi from '../api/ordersApi';
import useNotification from '../../../hooks/useNotification';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showNotification } = useNotification();

  // Use ref to avoid dependency issues
  const showNotificationRef = useRef(showNotification);

  // Update ref when showNotification changes
  useEffect(() => {
    showNotificationRef.current = showNotification;
  });

  // Fetch all orders
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ordersApi.getOrders();
      setOrders(data);
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch orders'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get an order by ID
  const getOrderById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const order = await ordersApi.getOrderById(id);
      return order;
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: `Failed to fetch order ${id}`
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update an order
  const updateOrder = useCallback(async (id: string, orderData: OrderUpdateData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedOrder = await ordersApi.updateOrder(id, orderData);
      setOrders(prevOrders =>
        prevOrders.map(order => order.id === id ? updatedOrder : order)
      );
      showNotificationRef.current({
        type: 'success',
        title: 'Success',
        message: 'Order updated successfully'
      });
      return updatedOrder;
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to update order'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cancel an order
  const cancelOrder = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const cancelledOrder = await ordersApi.updateOrderStatus(id, 'rejected');
      setOrders(prevOrders =>
        prevOrders.map(order => order.id === id ? cancelledOrder : order)
      );
      showNotificationRef.current({
        type: 'success',
        title: 'Success',
        message: 'Order cancelled successfully'
      });
      return cancelledOrder;
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to cancel order'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get orders by status
  const getOrdersByStatus = useCallback(async (status: Order['status']) => {
    setIsLoading(true);
    setError(null);
    try {
      const filteredOrders = await ordersApi.getOrdersByStatus(status);
      return filteredOrders;
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: `Failed to fetch orders with status ${status}`
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get orders by customer
  const getOrdersByCustomer = useCallback(async (customerId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const customerOrders = await ordersApi.getOrdersByCustomer(customerId);
      return customerOrders;
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: `Failed to fetch orders for customer ${customerId}`
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete an order
  const deleteOrder = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await ordersApi.deleteOrder(id);
      setOrders(prevOrders => prevOrders.filter(order => order.id !== id));
      showNotificationRef.current({
        type: 'success',
        title: 'Success',
        message: 'Order deleted successfully'
      });
    } catch (err) {
      setError(err as Error);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete order';
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: errorMessage
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    deleteOrder,
    getOrdersByStatus,
    getOrdersByCustomer
  };
};

export default useOrders;


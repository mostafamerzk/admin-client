/**
 * Orders Hook
 *
 * This hook provides methods and state for working with orders.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type { Order, OrderCreateData, OrderUpdateData, OrderQueryParams } from '../types/index';
import ordersApi from '../api/ordersApi';
import useNotification from '../../../hooks/useNotification';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showNotification } = useNotification();

  // Use ref to avoid dependency issues
  const showNotificationRef = useRef(showNotification);

  // Update ref when showNotification changes
  useEffect(() => {
    showNotificationRef.current = showNotification;
  });

  // Fetch all orders with optional parameters
  const fetchOrders = useCallback(async (params?: OrderQueryParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await ordersApi.getOrders(params);
      setOrders(result.orders);
      setPagination(result.pagination);
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
  const getOrderById = useCallback(async (id: string | number) => {
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

  // Create a new order
  const createOrder = useCallback(async (orderData: OrderCreateData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newOrder = await ordersApi.createOrder(orderData);
      setOrders(prevOrders => [newOrder, ...prevOrders]);
      showNotificationRef.current({
        type: 'success',
        title: 'Success',
        message: 'Order created successfully'
      });
      return newOrder;
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to create order'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update an order
  const updateOrder = useCallback(async (id: string | number, orderData: OrderUpdateData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedOrder = await ordersApi.updateOrder(id, orderData);
      setOrders(prevOrders =>
        prevOrders.map(order => order.id === Number(id) ? updatedOrder : order)
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

  // Update order status
  const updateOrderStatus = useCallback(async (id: string | number, status: Order['status']) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedOrder = await ordersApi.updateOrderStatus(id, status);
      setOrders(prevOrders =>
        prevOrders.map(order => order.id === Number(id) ? updatedOrder : order)
      );
      showNotificationRef.current({
        type: 'success',
        title: 'Success',
        message: `Order ${status} successfully`
      });
      return updatedOrder;
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: `Failed to ${status} order`
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Approve an order
  const approveOrder = useCallback(async (id: string | number) => {
    setIsLoading(true);
    setError(null);
    try {
      const approvedOrder = await ordersApi.approveOrder(id);
      setOrders(prevOrders =>
        prevOrders.map(order => order.id === Number(id) ? approvedOrder : order)
      );
      showNotificationRef.current({
        type: 'success',
        title: 'Success',
        message: 'Order approved successfully'
      });
      return approvedOrder;
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to approve order'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Reject an order
  const rejectOrder = useCallback(async (id: string | number) => {
    setIsLoading(true);
    setError(null);
    try {
      const rejectedOrder = await ordersApi.rejectOrder(id);
      setOrders(prevOrders =>
        prevOrders.map(order => order.id === Number(id) ? rejectedOrder : order)
      );
      showNotificationRef.current({
        type: 'success',
        title: 'Success',
        message: 'Order rejected successfully'
      });
      return rejectedOrder;
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to reject order'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Complete an order
  const completeOrder = useCallback(async (id: string | number) => {
    setIsLoading(true);
    setError(null);
    try {
      const completedOrder = await ordersApi.completeOrder(id);
      setOrders(prevOrders =>
        prevOrders.map(order => order.id === Number(id) ? completedOrder : order)
      );
      showNotificationRef.current({
        type: 'success',
        title: 'Success',
        message: 'Order completed successfully'
      });
      return completedOrder;
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to complete order'
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

  // Get orders by supplier
  const getOrdersBySupplier = useCallback(async (supplierId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const supplierOrders = await ordersApi.getOrdersBySupplier(supplierId);
      return supplierOrders;
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: `Failed to fetch orders for supplier ${supplierId}`
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete an order
  const deleteOrder = useCallback(async (id: string | number) => {
    setIsLoading(true);
    setError(null);
    try {
      await ordersApi.deleteOrder(id);
      setOrders(prevOrders => prevOrders.filter(order => order.id !== Number(id)));
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
    pagination,
    isLoading,
    error,
    fetchOrders,
    getOrderById,
    createOrder,
    updateOrder,
    updateOrderStatus,
    approveOrder,
    rejectOrder,
    completeOrder,
    deleteOrder,
    getOrdersByStatus,
    getOrdersByCustomer,
    getOrdersBySupplier
  };
};

export default useOrders;


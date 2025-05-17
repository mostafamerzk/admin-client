/**
 * Orders API Service
 * 
 * This file provides methods for interacting with the orders API endpoints.
 */

import apiClient from '../../../api';
import type { Order, OrderUpdateData } from '../types';

export const ordersApi = {
  /**
   * Get all orders
   */
  getOrders: async (params?: Record<string, any>): Promise<Order[]> => {
    try {
      const response = await apiClient.get<Order[]>('/orders', { params });
      if (!response.data) {
        throw new Error('No orders data received');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  /**
   * Get an order by ID
   */
  getOrderById: async (id: string): Promise<Order> => {
    try {
      const response = await apiClient.get<Order>(`/orders/${id}`);
      if (!response.data) {
        throw new Error(`No order data received for ID: ${id}`);
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new order
   */
  createOrder: async (orderData: OrderUpdateData): Promise<Order> => {
    try {
      const response = await apiClient.post<Order>('/orders', orderData);
      if (!response.data) {
        throw new Error('Failed to create order');
      }
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  /**
   * Update an order
   */
  updateOrder: async (id: string, orderData: Partial<OrderUpdateData>): Promise<Order> => {
    try {
      const response = await apiClient.put<Order>(`/orders/${id}`, orderData);
      if (!response.data) {
        throw new Error(`Failed to update order ${id}`);
      }
      return response.data;
    } catch (error) {
      console.error(`Error updating order ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete an order
   */
  deleteOrder: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/orders/${id}`);
    } catch (error) {
      console.error(`Error deleting order ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update order status
   */
  updateOrderStatus: async (id: string, status: Order['status']): Promise<Order> => {
    try {
      const response = await apiClient.put<Order>(`/orders/${id}/status`, { status });
      if (!response.data) {
        throw new Error(`Failed to update status for order ${id}`);
      }
      return response.data;
    } catch (error) {
      console.error(`Error updating status for order ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get orders by status
   */
  getOrdersByStatus: async (status: Order['status']): Promise<Order[]> => {
    try {
      const response = await apiClient.get<Order[]>('/orders', { params: { status } });
      if (!response.data) {
        throw new Error(`No orders found with status: ${status}`);
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching orders with status ${status}:`, error);
      throw error;
    }
  }
};

export default ordersApi;

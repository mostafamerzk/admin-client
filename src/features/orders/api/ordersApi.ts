/**
 * Orders API Service
 * 
 * This file provides methods for interacting with the orders API endpoints.
 */

import api from '../../../services/api.ts';
import { Order, OrderUpdateData } from '../types/index.ts';

export const ordersApi = {
  /**
   * Get all orders
   */
  getOrders: async (params?: Record<string, any>): Promise<Order[]> => {
    try {
      const response = await api.get('/orders', { params });
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
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update an order
   */
  updateOrder: async (id: string, orderData: OrderUpdateData): Promise<Order> => {
    try {
      const response = await api.put(`/orders/${id}`, orderData);
      return response.data;
    } catch (error) {
      console.error(`Error updating order ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cancel an order
   */
  cancelOrder: async (id: string): Promise<Order> => {
    try {
      const response = await api.put(`/orders/${id}/cancel`, {});
      return response.data;
    } catch (error) {
      console.error(`Error cancelling order ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get orders by status
   */
  getOrdersByStatus: async (status: Order['status']): Promise<Order[]> => {
    try {
      const response = await api.get('/orders', { params: { status } });
      return response.data;
    } catch (error) {
      console.error(`Error fetching orders by status ${status}:`, error);
      throw error;
    }
  },

  /**
   * Get orders by customer
   */
  getOrdersByCustomer: async (customerId: string): Promise<Order[]> => {
    try {
      const response = await api.get('/orders', { params: { customerId } });
      return response.data;
    } catch (error) {
      console.error(`Error fetching orders for customer ${customerId}:`, error);
      throw error;
    }
  }
};

export default ordersApi;

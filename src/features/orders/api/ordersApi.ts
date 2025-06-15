/**
 * Orders API Service
 * 
 * This file provides methods for interacting with the orders API endpoints.
 */

import apiClient from '../../../api';
import { handleApiError } from '../../../utils/errorHandling';
import { responseValidators } from '../../../utils/apiHelpers';
import type { Order, OrderUpdateData } from '../types';

export const ordersApi = {
  /**
   * Get all orders
   */
  getOrders: async (params?: Record<string, any>): Promise<Order[]> => {
    try {
      const response = await apiClient.get<Order[]>('/orders', { params });
      return responseValidators.getList(response, 'orders');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get an order by ID
   */
  getOrderById: async (id: string): Promise<Order> => {
    try {
      const response = await apiClient.get<Order>(`/orders/${id}`);
      return responseValidators.getById(response, 'order', id);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create a new order
   */
  createOrder: async (orderData: OrderUpdateData): Promise<Order> => {
    try {
      const response = await apiClient.post<Order>('/orders', orderData);
      return responseValidators.create(response, 'order');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update an order
   */
  updateOrder: async (id: string, orderData: Partial<OrderUpdateData>): Promise<Order> => {
    try {
      const response = await apiClient.put<Order>(`/orders/${id}`, orderData);
      return responseValidators.update(response, 'order', id);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete an order
   */
  deleteOrder: async (id: string): Promise<void> => {
    try {
      const response = await apiClient.delete(`/orders/${id}`);
      return responseValidators.delete(response, 'order', id);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update order status
   */
  updateOrderStatus: async (id: string, status: Order['status']): Promise<Order> => {
    try {
      const response = await apiClient.put<Order>(`/orders/${id}/status`, { status });
      return responseValidators.update(response, 'order', id);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get orders by status
   */
  getOrdersByStatus: async (status: Order['status']): Promise<Order[]> => {
    try {
      const response = await apiClient.get<Order[]>('/orders', { params: { status } });
      return responseValidators.getList(response, 'orders', true);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get orders by customer
   */
  getOrdersByCustomer: async (customerId: string): Promise<Order[]> => {
    try {
      const response = await apiClient.get<Order[]>('/orders', { params: { customerId } });
      return responseValidators.getList(response, 'orders', true);
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

export default ordersApi;


/**
 * Orders API Service
 *
 * This file provides methods for interacting with the orders API endpoints.
 */

import apiClient from '../../../api';
import { ENDPOINTS } from '../../../constants/endpoints';
import type {
  Order,
  OrderCreateData,
  OrderUpdateData,
  OrderQueryParams
} from '../types';
import {
  transformOrderListResponse,
  transformOrderResponse,
  transformOrderCreateDataToBackend,
  transformOrderUpdateDataToBackend,
  validateBackendResponse,
  extractErrorMessage
} from '../utils/orderTransformers';

export const ordersApi = {
  /**
   * Get all orders with optional filtering and pagination
   */
  getOrders: async (params?: OrderQueryParams): Promise<{ orders: Order[]; pagination?: any }> => {
    try {
      const response = await apiClient.get<any>(ENDPOINTS.ORDERS.BASE, { params });

      if (response.error) {
        throw new Error(response.error);
      }

      const transformedResponse = transformOrderListResponse(response.data);

      return {
        orders: transformedResponse.data,
        pagination: transformedResponse.pagination
      };
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * Get an order by ID
   */
  getOrderById: async (id: string | number): Promise<Order> => {
    try {
      const response = await apiClient.get<any>(ENDPOINTS.ORDERS.DETAILS(String(id)));

      if (response.error) {
        throw new Error(response.error);
      }

      const transformedResponse = transformOrderResponse(response.data);
      return transformedResponse.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * Create a new order
   */
  createOrder: async (orderData: OrderCreateData): Promise<Order> => {
    try {
      const backendData = transformOrderCreateDataToBackend(orderData);
      const response = await apiClient.post<any>(ENDPOINTS.ORDERS.BASE, backendData);

      if (response.error) {
        throw new Error(response.error);
      }

      const transformedResponse = transformOrderResponse(response.data);
      return transformedResponse.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * Update an order
   */
  updateOrder: async (id: string | number, orderData: Partial<OrderUpdateData>): Promise<Order> => {
    try {
      const backendData = transformOrderUpdateDataToBackend(orderData);
      const response = await apiClient.put<any>(ENDPOINTS.ORDERS.DETAILS(String(id)), backendData);

      if (response.error) {
        throw new Error(response.error);
      }

      const transformedResponse = transformOrderResponse(response.data);
      return transformedResponse.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * Delete an order (soft delete)
   */
  deleteOrder: async (id: string | number): Promise<void> => {
    try {
      const response = await apiClient.delete(ENDPOINTS.ORDERS.DETAILS(String(id)));

      if (response.error) {
        throw new Error(response.error);
      }

      // Validate that the operation was successful
      validateBackendResponse(response.data);
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * Update order status
   */
  updateOrderStatus: async (id: string | number, status: Order['status']): Promise<Order> => {
    try {
      const backendData = { status: status };
      const response = await apiClient.put<any>(`/orders/${id}/status`, backendData);

      if (response.error) {
        throw new Error(response.error);
      }

      const transformedResponse = transformOrderResponse(response.data);
      return transformedResponse.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * Approve order (status = 1)
   */
  approveOrder: async (id: string | number): Promise<Order> => {
    try {
      const response = await apiClient.put<any>(ENDPOINTS.ORDERS.APPROVE(String(id)));

      if (response.error) {
        throw new Error(response.error);
      }

      const transformedResponse = transformOrderResponse(response.data);
      return transformedResponse.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * Reject order (status = 2)
   */
  rejectOrder: async (id: string | number): Promise<Order> => {
    try {
      const response = await apiClient.put<any>(ENDPOINTS.ORDERS.REJECT(String(id)));

      if (response.error) {
        throw new Error(response.error);
      }

      const transformedResponse = transformOrderResponse(response.data);
      return transformedResponse.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * Complete order (status = 3)
   */
  completeOrder: async (id: string | number): Promise<Order> => {
    try {
      const response = await apiClient.put<any>(ENDPOINTS.ORDERS.COMPLETE(String(id)));

      if (response.error) {
        throw new Error(response.error);
      }

      const transformedResponse = transformOrderResponse(response.data);
      return transformedResponse.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * Get orders by status
   */
  getOrdersByStatus: async (status: Order['status']): Promise<Order[]> => {
    try {
      const result = await ordersApi.getOrders({ status });
      return result.orders;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * Get orders by customer
   */
  getOrdersByCustomer: async (customerId: string): Promise<Order[]> => {
    try {
      const result = await ordersApi.getOrders({ customerId });
      return result.orders;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * Get orders by supplier
   */
  getOrdersBySupplier: async (supplierId: string): Promise<Order[]> => {
    try {
      const result = await ordersApi.getOrders({ supplierId });
      return result.orders;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  }
};

export default ordersApi;


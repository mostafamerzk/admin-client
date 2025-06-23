/**
 * Order Transformers
 *
 * Utility functions to transform between backend and frontend order data formats
 */

import type {
  Order,
  OrderItem,
  BackendOrder,
  BackendOrderItem,
  ApiResponseWrapper,
  OrderCreateData,
  OrderUpdateData
} from '../types';
import { ORDER_STATUS_MAP, FRONTEND_TO_BACKEND_STATUS_MAP } from '../types';

/**
 * Transform backend order item to frontend format
 */
export const transformBackendOrderItemToFrontend = (backendItem: BackendOrderItem): OrderItem => {
  return {
    id: backendItem.id,
    name: backendItem.name,
    quantity: backendItem.quantity,
    unitPrice: backendItem.unitPrice,
    description: backendItem.description,
    sku: backendItem.sku
  };
};

/**
 * Transform backend order to frontend format
 */
export const transformBackendOrderToFrontend = (backendOrder: BackendOrder): Order => {
  return {
    id: backendOrder.id,
    customerName: backendOrder.customerName,
    supplierName: backendOrder.supplierName,
    totalAmount: backendOrder.totalAmount,
    status: ORDER_STATUS_MAP[backendOrder.status] || 'pending',
    orderDate: backendOrder.orderDate,
    customerId: backendOrder.customerId,
    supplierId: backendOrder.supplierId,
    orderNumber: backendOrder.orderNumber,
    paymentMethod: backendOrder.paymentMethod,
    createdAt: backendOrder.createdAt,
    updatedAt: backendOrder.updatedAt,
    notes: backendOrder.notes,
    shippingAddress: {
      address: backendOrder.shippingAddress.address
    },
    billingAddress: {
      address: backendOrder.billingAddress.address
    },
    items: backendOrder.items.map(transformBackendOrderItemToFrontend)
  };
};

/**
 * Transform frontend order create data to backend format
 */
export const transformOrderCreateDataToBackend = (frontendData: OrderCreateData): any => {
  return {
    customerId: frontendData.customerId,
    supplierId: frontendData.supplierId,
    paymentMethod: frontendData.paymentMethod,
    notes: frontendData.notes || '',
    items: frontendData.items
  };
};

/**
 * Transform frontend order update data to backend format
 */
export const transformOrderUpdateDataToBackend = (frontendData: OrderUpdateData): any => {
  const backendData: any = {};

  if (frontendData.status) {
    backendData.status = FRONTEND_TO_BACKEND_STATUS_MAP[frontendData.status];
  }

  if (frontendData.paymentMethod) {
    backendData.paymentMethod = frontendData.paymentMethod;
  }

  if (frontendData.notes !== undefined) {
    backendData.notes = frontendData.notes;
  }

  return backendData;
};

/**
 * Validate backend response structure
 */
export const validateBackendResponse = <T>(response: any): ApiResponseWrapper<T> => {
  if (!response) {
    throw new Error('No response received from server');
  }

  if (response.success === false) {
    throw new Error(response.message || 'Request failed');
  }

  if (response.success === undefined) {
    // Handle direct data response (legacy)
    return {
      success: true,
      message: 'Request successful',
      data: response
    };
  }

  return response;
};

/**
 * Transform backend order list response to frontend format
 */
export const transformOrderListResponse = (backendResponse: any): ApiResponseWrapper<Order[]> => {
  const validatedResponse = validateBackendResponse<BackendOrder[]>(backendResponse);

  const transformedOrders = validatedResponse.data.map(transformBackendOrderToFrontend);

  const result: ApiResponseWrapper<Order[]> = {
    success: validatedResponse.success,
    message: validatedResponse.message,
    data: transformedOrders
  };

  if (validatedResponse.pagination !== undefined) {
    result.pagination = validatedResponse.pagination;
  }

  return result;
};

/**
 * Transform backend order response to frontend format
 */
export const transformOrderResponse = (backendResponse: any): ApiResponseWrapper<Order> => {
  const validatedResponse = validateBackendResponse<BackendOrder>(backendResponse);

  const transformedOrder = transformBackendOrderToFrontend(validatedResponse.data);

  return {
    success: validatedResponse.success,
    message: validatedResponse.message,
    data: transformedOrder
  };
};

/**
 * Extract error message from backend response
 */
export const extractErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  if (error?.response?.data?.error) {
    return error.response.data.error;
  }

  return 'An unexpected error occurred';
};

/**
 * Format order date for display
 */
export const formatOrderDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

/**
 * Get order status color for UI
 */
export const getOrderStatusColor = (status: Order['status']): string => {
  switch (status) {
    case 'pending':
      return 'yellow';
    case 'approved':
      return 'blue';
    case 'rejected':
      return 'red';
    case 'completed':
      return 'green';
    default:
      return 'gray';
  }
};

/**
 * Get order status label for display
 */
export const getOrderStatusLabel = (status: Order['status']): string => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'approved':
      return 'Approved';
    case 'rejected':
      return 'Rejected';
    case 'completed':
      return 'Completed';
    default:
      return 'Unknown';
  }
};

export default {
  transformBackendOrderToFrontend,
  transformBackendOrderItemToFrontend,
  transformOrderCreateDataToBackend,
  transformOrderUpdateDataToBackend,
  validateBackendResponse,
  transformOrderListResponse,
  transformOrderResponse,
  extractErrorMessage,
  formatOrderDate,
  getOrderStatusColor,
  getOrderStatusLabel
};

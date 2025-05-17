/**
 * Order Mappers
 * 
 * Utility functions to map between different order data formats
 */

import { Order, OrderItem } from '../types/index.ts';
import { orders as mockOrders, OrderItem as MockOrderItem } from '../../../mockData/entities/orders.ts';

/**
 * Maps a mock order item to the application order item format
 */
const mapMockOrderItemToOrderItem = (mockItem: MockOrderItem): OrderItem => {
  return {
    id: mockItem.id,
    name: mockItem.productName,
    quantity: mockItem.quantity,
    unitPrice: mockItem.unitPrice,
    sku: mockItem.productId
  };
};

/**
 * Maps a mock order to the application order format
 */
export const mapMockOrderToOrder = (mockOrder: any): Order => {
  return {
    id: mockOrder.orderNumber || mockOrder.id,
    customerName: mockOrder.customerName,
    supplierName: mockOrder.supplierName,
    totalAmount: mockOrder.totalAmount,
    status: mockOrder.status === 'cancelled' ? 'rejected' : mockOrder.status, // Map 'cancelled' to 'rejected' for compatibility
    orderDate: mockOrder.orderDate ? new Date(mockOrder.orderDate).toISOString().split('T')[0] : '-',
    deliveryDate: mockOrder.deliveryDate ? new Date(mockOrder.deliveryDate).toISOString().split('T')[0] : '-',
    items: mockOrder.items ? mockOrder.items.map(mapMockOrderItemToOrderItem) : [],
    shippingAddress: mockOrder.shippingAddress ? {
      street: mockOrder.shippingAddress.street,
      city: mockOrder.shippingAddress.city,
      state: mockOrder.shippingAddress.state,
      postalCode: mockOrder.shippingAddress.zipCode,
      country: mockOrder.shippingAddress.country
    } : undefined,
    notes: mockOrder.notes
  };
};

/**
 * Get all orders from mock data
 */
export const getMockOrders = (): Order[] => {
  return mockOrders.map(mapMockOrderToOrder);
};

/**
 * Get an order by ID from mock data
 */
export const getMockOrderById = (id: string): Order | undefined => {
  // Try to find by orderNumber first, then by id
  const mockOrder = mockOrders.find(o => o.orderNumber === id || o.id === id);
  if (!mockOrder) return undefined;
  return mapMockOrderToOrder(mockOrder);
};

export default {
  mapMockOrderToOrder,
  getMockOrders,
  getMockOrderById
};

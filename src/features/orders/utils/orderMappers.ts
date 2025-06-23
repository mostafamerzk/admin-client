/**
 * Order Mappers
 *
 * Utility functions to map between different order data formats
 * @deprecated Use orderTransformers.ts instead for new backend API integration
 */

import type{ Order, OrderItem } from '../types/index';
import { orders as mockOrders, type OrderItem as MockOrderItem } from '../../../mockData/entities/orders';

/**
 * Maps a mock order item to the application order item format
 */
const mapMockOrderItemToOrderItem = (mockItem: MockOrderItem): OrderItem => {
  return {
    id: parseInt(mockItem.id, 10),
    name: mockItem.productName,
    quantity: mockItem.quantity,
    unitPrice: mockItem.unitPrice,
    description: `Product ID: ${mockItem.productId}`,
    sku: mockItem.productId
  };
};

/**
 * Maps a mock order to the application order format
 */
export const mapMockOrderToOrder = (mockOrder: any): Order => {
  const formatDate = (dateString?: string): string => {
    if (!dateString) return new Date().toISOString();
    return new Date(dateString).toISOString();
  };

  return {
    id: mockOrder.id,
    customerName: mockOrder.customerName,
    supplierName: mockOrder.supplierName,
    totalAmount: mockOrder.totalAmount,
    status: mockOrder.status === 'cancelled' ? 'rejected' : mockOrder.status,
    orderDate: formatDate(mockOrder.orderDate),
    deliveryDate: formatDate(mockOrder.deliveryDate),
    items: mockOrder.items ? mockOrder.items.map(mapMockOrderItemToOrderItem) : [],
    notes: mockOrder.notes,
    ...(mockOrder.shippingAddress && {
      shippingAddress: {
        street: mockOrder.shippingAddress.street,
        city: mockOrder.shippingAddress.city,
        state: mockOrder.shippingAddress.state,
        postalCode: mockOrder.shippingAddress.zipCode,
        country: mockOrder.shippingAddress.country
      }
    })
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
export const getMockOrderById = (id: string | number): Order | undefined => {
  // Convert id to string for consistent comparison
  const searchId = String(id);

  // Try to find by orderNumber first, then by id
  const mockOrder = mockOrders.find(o =>
    o.orderNumber === searchId ||
    o.id === searchId ||
    String(o.id) === searchId
  );
  if (!mockOrder) return undefined;
  return mapMockOrderToOrder(mockOrder);
};

export default {
  mapMockOrderToOrder,
  getMockOrders,
  getMockOrderById
};

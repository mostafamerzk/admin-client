/**
 * Order Types
 *
 * This file defines the TypeScript interfaces for the orders feature.
 */

export interface Order {
  id: string;
  customerName: string;
  supplierName: string;
  totalAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  orderDate: string;
  deliveryDate: string;
  items?: OrderItem[];
  shippingAddress?: Address;
  billingAddress?: Address;
  notes?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  description?: string;
  sku?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderUpdateData {
  status?: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentStatus?: 'paid' | 'unpaid' | 'refunded';
}

/**
 * Order Types
 *
 * This file defines the TypeScript interfaces for the orders feature.
 */

// Backend Order interface (matches exact API response)
export interface BackendOrder {
  id: number;                    // Order.ID
  customerName: string;          // Customer.Users.Name (via query)
  supplierName: string;          // Suppliers.Users.Name (via query)
  totalAmount: number;           // Calculated: SubTotal + DeliveryFees - Discount
  status: 0 | 1 | 2 | 3;        // Backend status codes
  orderDate: string;             // Order.CreatedDate (ISO string)
  customerId: string;            // Order.CustomerId
  supplierId: string;            // Order.SupplierId
  orderNumber: string;           // Order.OrderNumber (GUID as string)
  paymentMethod: string;         // Order.PaymentMethod
  createdAt: string;             // Order.CreatedDate (ISO string)
  updatedAt: string | null;      // Order.UpdatedDate (ISO string or null)
  notes: string;                 // Order.Notes
  shippingAddress: {             // Customer address via query
    address: string;             // Customer.Users.Address
  };
  billingAddress: {              // Same as shipping or default
    address: string;             // Customer.Users.Address or "Same as shipping address"
  };
  items: BackendOrderItem[];     // Array of order items
}

// Backend OrderItem interface (matches exact API response)
export interface BackendOrderItem {
  id: number;                    // OrderItem.ID
  name: string;                  // Products.Name (via query)
  quantity: number;              // OrderItem.Quantity
  unitPrice: number;             // Products.Price (via query)
  description: string;           // Products.Description (via query)
  sku: string;                   // Products.SKU (via query)
}

// Frontend Order interface (for UI compatibility)
export interface Order {
  id: number;                    // Keep as number for consistency with backend
  customerName: string;          // Customer.Users.Name (via query)
  supplierName: string;          // Suppliers.Users.Name (via query)
  totalAmount: number;           // Calculated: SubTotal + DeliveryFees - Discount
  status: 'pending' | 'approved' | 'rejected' | 'completed';  // Mapped from Order.Status
  orderDate: string;             // Order.CreatedDate (ISO string)
  customerId: string;            // Order.CustomerId
  supplierId: string;            // Order.SupplierId
  orderNumber: string;           // Order.OrderNumber (GUID as string)
  paymentMethod: string;         // Order.PaymentMethod
  createdAt: string;             // Order.CreatedDate (ISO string)
  updatedAt: string | null;      // Order.UpdatedDate (ISO string or null)
  notes: string;                 // Order.Notes
  shippingAddress: {             // Customer address via query
    address: string;             // Customer.Users.Address
  };
  billingAddress: {              // Same as shipping or default
    address: string;             // Customer.Users.Address or "Same as shipping address"
  };
  items: OrderItem[];            // Array of order items
}

// Frontend OrderItem interface (for UI compatibility)
export interface OrderItem {
  id: number;                    // OrderItem.ID
  name: string;                  // Products.Name (via query)
  quantity: number;              // OrderItem.Quantity
  unitPrice: number;             // Products.Price (via query)
  description: string;           // Products.Description (via query)
  sku: string;                   // Products.SKU (via query)
}

// Legacy Address interface (kept for backward compatibility)
export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Order creation/update data interface
export interface OrderCreateData {
  customerId: string;
  supplierId: string;
  paymentMethod: string;
  notes?: string;
  items: {
    productId: number;
    quantity: number;
  }[];
}

// Order update data interface
export interface OrderUpdateData {
  status?: 'pending' | 'approved' | 'rejected' | 'completed';
  paymentMethod?: string;
  notes?: string;
}

// API Response wrapper interface
export interface ApiResponseWrapper<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Order query parameters interface
export interface OrderQueryParams {
  status?: 'pending' | 'approved' | 'rejected' | 'completed';
  customerId?: string;
  supplierId?: string;
  page?: number;
  limit?: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

// Status mapping constants
export const ORDER_STATUS_MAP = {
  0: 'pending' as const,
  1: 'approved' as const,
  2: 'rejected' as const,
  3: 'completed' as const,
} as const;

export const FRONTEND_TO_BACKEND_STATUS_MAP = {
  'pending': 0,
  'approved': 1,
  'rejected': 2,
  'completed': 3,
} as const;

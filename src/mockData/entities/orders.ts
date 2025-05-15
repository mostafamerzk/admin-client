/**
 * Mock Orders Data
 * 
 * This file contains mock data for orders in the ConnectChain admin panel.
 */

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  supplierId: string;
  supplierName: string;
  orderNumber: string;
  totalAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'credit_card' | 'bank_transfer' | 'paypal' | 'other';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: OrderItem[];
  notes?: string;
  orderDate: string;
  deliveryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export const orders: Order[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'John Doe',
    supplierId: '1',
    supplierName: 'Tech Supplies Inc',
    orderNumber: 'ORD-2024-0001',
    totalAmount: 1500.00,
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'credit_card',
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    items: [
      {
        id: '1-1',
        productId: 'p1',
        productName: 'Laptop Pro X',
        quantity: 1,
        unitPrice: 1200.00,
        totalPrice: 1200.00
      },
      {
        id: '1-2',
        productId: 'p2',
        productName: 'Wireless Mouse',
        quantity: 2,
        unitPrice: 50.00,
        totalPrice: 100.00
      },
      {
        id: '1-3',
        productId: 'p3',
        productName: 'Laptop Bag',
        quantity: 1,
        unitPrice: 200.00,
        totalPrice: 200.00
      }
    ],
    notes: 'Please deliver during business hours',
    orderDate: '2024-01-15T10:30:00Z',
    deliveryDate: '2024-01-20T14:00:00Z',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    customerId: '4',
    customerName: 'Emily Davis',
    supplierId: '2',
    supplierName: 'Office Solutions Ltd',
    orderNumber: 'ORD-2024-0002',
    totalAmount: 750.50,
    status: 'approved',
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    shippingAddress: {
      street: '101 Maple Dr',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001',
      country: 'USA'
    },
    items: [
      {
        id: '2-1',
        productId: 'p4',
        productName: 'Office Desk',
        quantity: 1,
        unitPrice: 450.00,
        totalPrice: 450.00
      },
      {
        id: '2-2',
        productId: 'p5',
        productName: 'Office Chair',
        quantity: 1,
        unitPrice: 250.00,
        totalPrice: 250.00
      },
      {
        id: '2-3',
        productId: 'p6',
        productName: 'Desk Lamp',
        quantity: 1,
        unitPrice: 50.50,
        totalPrice: 50.50
      }
    ],
    orderDate: '2024-01-14T09:15:00Z',
    deliveryDate: '2024-01-19T13:00:00Z',
    createdAt: '2024-01-14T09:15:00Z',
    updatedAt: '2024-01-14T15:20:00Z'
  },
  {
    id: '3',
    customerId: '6',
    customerName: 'Sarah Brown',
    supplierId: '5',
    supplierName: 'Food Distributors Co',
    orderNumber: 'ORD-2024-0003',
    totalAmount: 325.75,
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'paypal',
    shippingAddress: {
      street: '303 Birch Rd',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA'
    },
    items: [
      {
        id: '3-1',
        productId: 'p7',
        productName: 'Organic Coffee Beans',
        quantity: 5,
        unitPrice: 15.99,
        totalPrice: 79.95
      },
      {
        id: '3-2',
        productId: 'p8',
        productName: 'Assorted Teas',
        quantity: 3,
        unitPrice: 12.60,
        totalPrice: 37.80
      },
      {
        id: '3-3',
        productId: 'p9',
        productName: 'Gourmet Snack Box',
        quantity: 4,
        unitPrice: 52.00,
        totalPrice: 208.00
      }
    ],
    orderDate: '2024-01-10T11:45:00Z',
    deliveryDate: '2024-01-13T10:30:00Z',
    createdAt: '2024-01-10T11:45:00Z',
    updatedAt: '2024-01-13T14:20:00Z'
  },
  {
    id: '4',
    customerId: '1',
    customerName: 'John Doe',
    supplierId: '2',
    supplierName: 'Office Solutions Ltd',
    orderNumber: 'ORD-2024-0004',
    totalAmount: 180.25,
    status: 'rejected',
    paymentStatus: 'refunded',
    paymentMethod: 'credit_card',
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    items: [
      {
        id: '4-1',
        productId: 'p10',
        productName: 'Stationery Set',
        quantity: 2,
        unitPrice: 45.25,
        totalPrice: 90.50
      },
      {
        id: '4-2',
        productId: 'p11',
        productName: 'Desk Organizer',
        quantity: 3,
        unitPrice: 29.75,
        totalPrice: 89.25
      }
    ],
    notes: 'Rejected due to items being out of stock',
    orderDate: '2024-01-12T14:20:00Z',
    createdAt: '2024-01-12T14:20:00Z',
    updatedAt: '2024-01-13T09:15:00Z'
  },
  {
    id: '5',
    customerId: '4',
    customerName: 'Emily Davis',
    supplierId: '1',
    supplierName: 'Tech Supplies Inc',
    orderNumber: 'ORD-2024-0005',
    totalAmount: 899.97,
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'bank_transfer',
    shippingAddress: {
      street: '101 Maple Dr',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001',
      country: 'USA'
    },
    items: [
      {
        id: '5-1',
        productId: 'p12',
        productName: 'Wireless Headphones',
        quantity: 1,
        unitPrice: 299.99,
        totalPrice: 299.99
      },
      {
        id: '5-2',
        productId: 'p13',
        productName: 'Tablet Pro',
        quantity: 1,
        unitPrice: 599.98,
        totalPrice: 599.98
      }
    ],
    orderDate: '2024-01-15T16:30:00Z',
    deliveryDate: '2024-01-22T14:00:00Z',
    createdAt: '2024-01-15T16:30:00Z',
    updatedAt: '2024-01-15T16:30:00Z'
  }
];

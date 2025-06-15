/**
 * Mock Categories Data
 *
 * This file contains mock data for product categories in the ConnectChain admin panel.
 */

import type { Category, Subcategory, Product } from '../../features/categories/types';

// Mock Products
export const mockProducts: Product[] = [
  // Electronics - Smartphones
  {
    id: 'p1',
    name: 'iPhone 15 Pro',
    sku: 'APPLE-IP15P-128',
    price: 999.99,
    stock: 25,
    status: 'active',
    image: '/images/products/iphone-15-pro.jpg',
    categoryId: '1',
    subcategoryId: 's1',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    id: 'p2',
    name: 'Samsung Galaxy S24',
    sku: 'SAMSUNG-GS24-256',
    price: 899.99,
    stock: 18,
    status: 'active',
    image: '/images/products/galaxy-s24.jpg',
    categoryId: '1',
    subcategoryId: 's1',
    createdAt: '2024-01-02T11:00:00Z',
    updatedAt: '2024-01-16T15:30:00Z'
  },
  // Electronics - Laptops
  {
    id: 'p3',
    name: 'MacBook Pro 16"',
    sku: 'APPLE-MBP16-512',
    price: 2499.99,
    stock: 12,
    status: 'active',
    image: '/images/products/macbook-pro-16.jpg',
    categoryId: '1',
    subcategoryId: 's2',
    createdAt: '2024-01-03T12:00:00Z',
    updatedAt: '2024-01-17T16:30:00Z'
  },
  {
    id: 'p4',
    name: 'Dell XPS 13',
    sku: 'DELL-XPS13-256',
    price: 1299.99,
    stock: 8,
    status: 'active',
    image: '/images/products/dell-xps-13.jpg',
    categoryId: '1',
    subcategoryId: 's2',
    createdAt: '2024-01-04T13:00:00Z',
    updatedAt: '2024-01-18T17:30:00Z'
  },
  // Office Supplies - Stationery
  {
    id: 'p5',
    name: 'Premium Notebook Set',
    sku: 'STAT-NB-PREM-001',
    price: 29.99,
    stock: 150,
    status: 'active',
    image: '/images/products/notebook-set.jpg',
    categoryId: '2',
    subcategoryId: 's3',
    createdAt: '2024-01-05T14:00:00Z',
    updatedAt: '2024-01-19T18:30:00Z'
  },
  {
    id: 'p6',
    name: 'Ergonomic Office Chair',
    sku: 'FURN-CHAIR-ERG-001',
    price: 299.99,
    stock: 5,
    status: 'out_of_stock',
    image: '/images/products/office-chair.jpg',
    categoryId: '2',
    subcategoryId: 's4',
    createdAt: '2024-01-06T15:00:00Z',
    updatedAt: '2024-01-20T19:30:00Z'
  }
];

// Mock Subcategories
export const mockSubcategories: Subcategory[] = [
  {
    id: 's1',
    name: 'Smartphones',
    description: 'Mobile phones and accessories',
    status: 'active',
    categoryId: '1',
    productCount: 2,
    products: mockProducts.filter(p => p.subcategoryId === 's1'),
    image: '/images/subcategories/smartphones.jpg',
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    visibleInSupplierApp: true,
    visibleInCustomerApp: true
  },
  {
    id: 's2',
    name: 'Laptops',
    description: 'Notebook computers and accessories',
    status: 'active',
    categoryId: '1',
    productCount: 2,
    products: mockProducts.filter(p => p.subcategoryId === 's2'),
    image: '/images/subcategories/laptops.jpg',
    createdAt: '2024-01-02T09:00:00Z',
    updatedAt: '2024-01-16T15:30:00Z',
    visibleInSupplierApp: true,
    visibleInCustomerApp: true
  },
  {
    id: 's3',
    name: 'Stationery',
    description: 'Pens, papers, and writing supplies',
    status: 'active',
    categoryId: '2',
    productCount: 1,
    products: mockProducts.filter(p => p.subcategoryId === 's3'),
    image: '/images/subcategories/stationery.jpg',
    createdAt: '2024-01-03T10:00:00Z',
    updatedAt: '2024-01-17T16:30:00Z',
    visibleInSupplierApp: true,
    visibleInCustomerApp: true
  },
  {
    id: 's4',
    name: 'Office Furniture',
    description: 'Desks, chairs, and office furniture',
    status: 'active',
    categoryId: '2',
    productCount: 1,
    products: mockProducts.filter(p => p.subcategoryId === 's4'),
    image: '/images/subcategories/office-furniture.jpg',
    createdAt: '2024-01-04T11:00:00Z',
    updatedAt: '2024-01-18T17:30:00Z',
    visibleInSupplierApp: true,
    visibleInCustomerApp: false
  },
  {
    id: 's5',
    name: 'Living Room',
    description: 'Sofas, coffee tables, and living room furniture',
    status: 'active',
    categoryId: '3',
    productCount: 0,
    products: [],
    image: '/images/subcategories/living-room.jpg',
    createdAt: '2024-01-05T12:00:00Z',
    updatedAt: '2024-01-19T18:30:00Z',
    visibleInSupplierApp: true,
    visibleInCustomerApp: true
  }
];

// Export the Category type for use in other files
export type { Category, Subcategory, Product };

export const categories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    description: 'Electronic devices and accessories',
    status: 'active',
    productCount: 4,
    subcategoryCount: 2,
    subcategories: mockSubcategories.filter(s => s.categoryId === '1'),
    image: '/images/categories/electronics.jpg',
    createdAt: '2023-10-01T08:00:00Z',
    updatedAt: '2024-01-05T14:30:00Z',
    visibleInSupplierApp: true,
    visibleInCustomerApp: true
  },
  {
    id: '2',
    name: 'Office Supplies',
    description: 'Office equipment and supplies',
    status: 'active',
    productCount: 2,
    subcategoryCount: 2,
    subcategories: mockSubcategories.filter(s => s.categoryId === '2'),
    image: '/images/categories/office-supplies.jpg',
    createdAt: '2023-10-02T09:15:00Z',
    updatedAt: '2024-01-10T11:45:00Z',
    visibleInSupplierApp: true,
    visibleInCustomerApp: true
  },
  {
    id: '3',
    name: 'Furniture',
    description: 'Home and office furniture',
    status: 'active',
    productCount: 0,
    subcategoryCount: 1,
    subcategories: mockSubcategories.filter(s => s.categoryId === '3'),
    image: '/images/categories/furniture.jpg',
    createdAt: '2023-10-05T10:30:00Z',
    updatedAt: '2024-01-12T16:20:00Z',
    visibleInSupplierApp: true,
    visibleInCustomerApp: true
  },
  {
    id: '4',
    name: 'Clothing',
    description: 'Apparel and fashion accessories',
    status: 'active',
    productCount: 0,
    subcategoryCount: 0,
    subcategories: [],
    image: '/images/categories/clothing.jpg',
    createdAt: '2023-10-10T11:45:00Z',
    updatedAt: '2024-01-15T09:10:00Z',
    visibleInSupplierApp: true,
    visibleInCustomerApp: false
  },
  {
    id: '5',
    name: 'Food & Beverages',
    description: 'Food products and beverages',
    status: 'inactive',
    productCount: 0,
    subcategoryCount: 0,
    subcategories: [],
    image: '/images/categories/food.jpg',
    createdAt: '2023-10-15T13:00:00Z',
    updatedAt: '2024-01-08T14:25:00Z',
    visibleInSupplierApp: false,
    visibleInCustomerApp: false
  }
];

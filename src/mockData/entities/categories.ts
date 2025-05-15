/**
 * Mock Categories Data
 * 
 * This file contains mock data for product categories in the ConnectChain admin panel.
 */

export interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  status: 'active' | 'inactive';
  parentId?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export const categories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    description: 'Electronic devices and accessories',
    productCount: 150,
    status: 'active',
    image: '/images/categories/electronics.jpg',
    createdAt: '2023-10-01T08:00:00Z',
    updatedAt: '2024-01-05T14:30:00Z'
  },
  {
    id: '2',
    name: 'Office Supplies',
    description: 'Office equipment and supplies',
    productCount: 200,
    status: 'active',
    image: '/images/categories/office-supplies.jpg',
    createdAt: '2023-10-02T09:15:00Z',
    updatedAt: '2024-01-10T11:45:00Z'
  },
  {
    id: '3',
    name: 'Furniture',
    description: 'Home and office furniture',
    productCount: 120,
    status: 'active',
    image: '/images/categories/furniture.jpg',
    createdAt: '2023-10-05T10:30:00Z',
    updatedAt: '2024-01-12T16:20:00Z'
  },
  {
    id: '4',
    name: 'Clothing',
    description: 'Apparel and fashion accessories',
    productCount: 300,
    status: 'active',
    image: '/images/categories/clothing.jpg',
    createdAt: '2023-10-10T11:45:00Z',
    updatedAt: '2024-01-15T09:10:00Z'
  },
  {
    id: '5',
    name: 'Food & Beverages',
    description: 'Food products and beverages',
    productCount: 180,
    status: 'active',
    image: '/images/categories/food.jpg',
    createdAt: '2023-10-15T13:00:00Z',
    updatedAt: '2024-01-08T14:25:00Z'
  },
  {
    id: '6',
    name: 'Smartphones',
    description: 'Mobile phones and accessories',
    parentId: '1',
    productCount: 75,
    status: 'active',
    image: '/images/categories/smartphones.jpg',
    createdAt: '2023-11-01T14:15:00Z',
    updatedAt: '2024-01-14T10:35:00Z'
  },
  {
    id: '7',
    name: 'Laptops',
    description: 'Notebook computers and accessories',
    parentId: '1',
    productCount: 50,
    status: 'active',
    image: '/images/categories/laptops.jpg',
    createdAt: '2023-11-05T15:30:00Z',
    updatedAt: '2024-01-13T13:50:00Z'
  },
  {
    id: '8',
    name: 'Seasonal Decor',
    description: 'Holiday and seasonal decorative items',
    productCount: 90,
    status: 'inactive',
    image: '/images/categories/seasonal.jpg',
    createdAt: '2023-11-10T16:45:00Z',
    updatedAt: '2024-01-02T11:20:00Z'
  }
];

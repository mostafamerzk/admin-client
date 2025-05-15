/**
 * Mock Users Data
 * 
 * This file contains mock data for users in the ConnectChain admin panel.
 */

export interface User {
  id: string;
  name: string;
  email: string;
  type: 'customer' | 'supplier' | 'admin';
  status: 'active' | 'banned' | 'pending';
  lastLogin: string;
  avatar?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
}

export const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    type: 'customer',
    status: 'active',
    lastLogin: '2024-01-15T14:30:45Z',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    phone: '+1 (555) 123-4567',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
    createdAt: '2023-10-15T08:00:00Z',
    updatedAt: '2024-01-15T14:30:45Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    type: 'supplier',
    status: 'active',
    lastLogin: '2024-01-14T09:15:22Z',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    phone: '+1 (555) 987-6543',
    address: '456 Oak Ave',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    country: 'USA',
    createdAt: '2023-11-05T10:30:00Z',
    updatedAt: '2024-01-14T09:15:22Z'
  },
  {
    id: '3',
    name: 'Robert Johnson',
    email: 'robert@example.com',
    type: 'customer',
    status: 'banned',
    lastLogin: '2024-01-10T16:45:30Z',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    phone: '+1 (555) 234-5678',
    address: '789 Pine St',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60007',
    country: 'USA',
    createdAt: '2023-09-20T14:15:00Z',
    updatedAt: '2024-01-12T11:30:00Z'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    type: 'customer',
    status: 'active',
    lastLogin: '2024-01-13T11:20:15Z',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    phone: '+1 (555) 345-6789',
    address: '101 Maple Dr',
    city: 'Houston',
    state: 'TX',
    zipCode: '77001',
    country: 'USA',
    createdAt: '2023-12-01T09:45:00Z',
    updatedAt: '2024-01-13T11:20:15Z'
  },
  {
    id: '5',
    name: 'Michael Wilson',
    email: 'michael@example.com',
    type: 'supplier',
    status: 'active',
    lastLogin: '2024-01-12T13:10:05Z',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    phone: '+1 (555) 456-7890',
    address: '202 Cedar Ln',
    city: 'Miami',
    state: 'FL',
    zipCode: '33101',
    country: 'USA',
    createdAt: '2023-10-25T16:20:00Z',
    updatedAt: '2024-01-12T13:10:05Z'
  },
  {
    id: '6',
    name: 'Sarah Brown',
    email: 'sarah@example.com',
    type: 'customer',
    status: 'pending',
    lastLogin: '2024-01-08T10:05:55Z',
    avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
    phone: '+1 (555) 567-8901',
    address: '303 Birch Rd',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98101',
    country: 'USA',
    createdAt: '2024-01-05T08:30:00Z',
    updatedAt: '2024-01-08T10:05:55Z'
  },
  {
    id: '7',
    name: 'Admin User',
    email: 'admin@connectchain.com',
    type: 'admin',
    status: 'active',
    lastLogin: '2024-01-15T17:45:10Z',
    avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
    phone: '+1 (555) 789-0123',
    address: '404 Admin St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94101',
    country: 'USA',
    createdAt: '2023-08-01T00:00:00Z',
    updatedAt: '2024-01-15T17:45:10Z'
  }
];

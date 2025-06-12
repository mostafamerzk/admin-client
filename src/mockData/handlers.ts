/**
 * Mock API Handlers
 *
 * This file contains handlers for simulating API requests in development.
 * It provides mock implementations for all API endpoints used in the application.
 */

import { mockDb } from './db';
import type{ User } from './entities/users';
import type{ Supplier } from './entities/suppliers';
import type{ Category } from './entities/categories';
import type{ Order } from './entities/orders';
import type{ DashboardStats } from './entities/dashboard';

// Helper to simulate network delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to simulate random failures (for testing error handling)
const simulateRandomFailure = (failureRate: number = 0.1): boolean => {
  return Math.random() < failureRate;
};

// Generic error response
const errorResponse = (message: string, status: number = 500) => ({
  error: {
    message,
    status
  }
});

export const handlers = {
  // Authentication
  auth: {
    login: async (email: string, password: string) => {
      console.log(`[Mock Auth] Login attempt with email: ${email}`);
      await delay(700);

      // Simulate login failure for specific credentials
      if (email === 'fail@example.com') {
        console.log('[Mock Auth] Login failed - test failure case');
        return errorResponse('Invalid credentials', 401);
      }

      // Special case for demo credentials
      if (email === 'admin@connectchain.com' && password === 'password123') {
        console.log('[Mock Auth] Demo credentials detected');
        // Find admin user
        const users = mockDb.getAll<User, 'users'>('users');
        console.log(`[Mock Auth] Found ${users.length} users in database`);

        const adminUser = users.find(u => u.email.toLowerCase() === 'admin@connectchain.com');

        if (adminUser) {
          console.log('[Mock Auth] Admin user found, generating token');
          // Generate mock JWT token
          const token = `mock-jwt-token-${Date.now()}`;

          return {
            user: {
              id: adminUser.id,
              name: adminUser.name,
              email: adminUser.email,
              type: adminUser.type,
              avatar: adminUser.avatar
            },
            token,
            expiresIn: 3600 // 1 hour
          };
        } else {
          console.log('[Mock Auth] Admin user not found in database');
          return errorResponse('User not found', 404);
        }
      }

      // For other users, find by email (in a real app, would check password hash)
      const users = mockDb.getAll<User, 'users'>('users');
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        return errorResponse('Invalid credentials', 401);
      }

      // In a real app, we would validate the password here
      // For demo purposes, we'll just reject all other login attempts
      return errorResponse('Invalid credentials', 401);
    },

    logout: async () => {
      await delay(300);
      return { success: true };
    },

    getCurrentUser: async (token: string) => {
      await delay(500);

      if (!token || token.indexOf('mock-jwt-token') === -1) {
        return errorResponse('Unauthorized', 401);
      }

      // In a real app, would decode the JWT token
      // For mock, just return the admin user
      const users = mockDb.getAll<User, 'users'>('users');
      const adminUser = users.find(u => u.email.toLowerCase() === 'admin@connectchain.com');

      if (!adminUser) {
        return errorResponse('User not found', 404);
      }

      return {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        type: adminUser.type,
        avatar: adminUser.avatar
      };
    }
  },

  // Users
  users: {
    getAll: async (filters?: { type?: string; status?: string; search?: string }) => {
      await delay(800);

      if (simulateRandomFailure(0.05)) {
        return errorResponse('Failed to fetch users');
      }

      let users = mockDb.getAll<User, 'users'>('users');

      // Apply filters if provided
      if (filters) {
        if (filters.type) {
          users = users.filter(user => user.type === filters.type);
        }

        if (filters.status) {
          users = users.filter(user => user.status === filters.status);
        }

        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          users = users.filter(user =>
            user.name.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower)
          );
        }
      }

      return users;
    },

    getById: async (id: string) => {
      await delay(500);

      const user = mockDb.getById<User, 'users'>('users', id);

      if (!user) {
        return errorResponse('User not found', 404);
      }

      return user;
    },

    create: async (userData: Partial<User>) => {
      await delay(1000);

      if (!userData.name || !userData.email) {
        return errorResponse('Name and email are required', 400);
      }

      // Check if email already exists
      const users = mockDb.getAll<User, 'users'>('users');
      const existingUser = users.find(u => u.email.toLowerCase() === userData.email?.toLowerCase());

      if (existingUser) {
        return errorResponse('Email already in use', 409);
      }

      const newUser: User = {
        id: `${Date.now()}`,
        name: userData.name,
        email: userData.email,
        type: userData.type || 'customer',
        status: userData.status || 'active',
        lastLogin: '-',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...userData
      };

      return mockDb.create<User, 'users'>('users', newUser);
    },

    update: async (id: string, userData: Partial<User>) => {
      await delay(800);

      const user = mockDb.getById<User, 'users'>('users', id);

      if (!user) {
        return errorResponse('User not found', 404);
      }

      const updatedUser = {
        ...user,
        ...userData,
        updatedAt: new Date().toISOString()
      };

      return mockDb.update<User, 'users'>('users', updatedUser);
    },

    delete: async (id: string) => {
      await delay(700);

      const success = mockDb.delete('users', id);

      if (!success) {
        return errorResponse('User not found', 404);
      }

      return { success: true };
    }
  },

  // Suppliers
  suppliers: {
    getAll: async (filters?: { status?: string; search?: string }) => {
      await delay(800);

      let suppliers = mockDb.getAll<Supplier, 'suppliers'>('suppliers');

      // Apply filters if provided
      if (filters) {
        if (filters.status) {
          suppliers = suppliers.filter(supplier => supplier.status === filters.status);
        }

        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          suppliers = suppliers.filter(supplier =>
            supplier.companyName.toLowerCase().includes(searchLower) ||
            supplier.contactPerson.toLowerCase().includes(searchLower) ||
            supplier.email.toLowerCase().includes(searchLower)
          );
        }
      }

      return suppliers;
    },

    getById: async (id: string) => {
      await delay(500);
      
      const supplier = mockDb.getById<Supplier, 'suppliers'>('suppliers', id);
      
      if (!supplier) {
        return errorResponse('Supplier not found', 404);
      }
      
      return supplier;
    },

    create: async (supplierData: Partial<Supplier>) => {
      await delay(1000);

      if (!supplierData.companyName || !supplierData.email) {
        return errorResponse('Company name and email are required', 400);
      }

      // Check if email already exists
      const suppliers = mockDb.getAll<Supplier, 'suppliers'>('suppliers');
      const existingSupplier = suppliers.find(s => s.email.toLowerCase() === supplierData.email?.toLowerCase());

      if (existingSupplier) {
        return errorResponse('Email already in use', 409);
      }

      const newSupplier: Supplier = {
        id: `${Date.now()}`,
        companyName: supplierData.companyName,
        contactPerson: supplierData.contactPerson || '',
        email: supplierData.email,
        phone: supplierData.phone || '',
        status: supplierData.status || 'pending',
        verificationDate: new Date().toISOString(),
        productCount: 0,
        rating: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...supplierData
      };

      return mockDb.create<Supplier, 'suppliers'>('suppliers', newSupplier);
    },

    update: async (id: string, supplierData: Partial<Supplier>) => {
      await delay(800);

      const supplier = mockDb.getById<Supplier, 'suppliers'>('suppliers', id);

      if (!supplier) {
        return errorResponse('Supplier not found', 404);
      }

      const updatedSupplier = {
        ...supplier,
        ...supplierData,
        updatedAt: new Date().toISOString()
      };

      return mockDb.update<Supplier, 'suppliers'>('suppliers', updatedSupplier);
    },

    delete: async (id: string) => {
      await delay(700);

      const success = mockDb.delete('suppliers', id);

      if (!success) {
        return errorResponse('Supplier not found', 404);
      }

      return { success: true };
    }
  },

  // Categories
  categories: {
    getAll: async (filters?: { status?: string; search?: string }) => {
      await delay(600);

      let categories = mockDb.getAll<Category, 'categories'>('categories');

      // Apply filters if provided
      if (filters) {
        if (filters.status) {
          categories = categories.filter(category => category.status === filters.status);
        }

        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          categories = categories.filter(category =>
            category.name.toLowerCase().includes(searchLower) ||
            category.description.toLowerCase().includes(searchLower)
          );
        }
      }

      return categories;
    },

    getById: async (id: string) => {
      await delay(550);
      
      const category = mockDb.getById<Category, 'categories'>('categories', id);
      
      if (!category) {
        return errorResponse('Category not found', 404);
      }
      
      return category;
    },

    create: async (categoryData: Partial<Category>) => {
      await delay(800);

      if (!categoryData.name) {
        return errorResponse('Category name is required', 400);
      }

      const newCategory: Category = {
        id: `${Date.now()}`,
        name: categoryData.name,
        description: categoryData.description || '',
        productCount: 0,
        status: categoryData.status || 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...categoryData
      };

      return mockDb.create<Category, 'categories'>('categories', newCategory);
    },

    update: async (id: string, categoryData: Partial<Category>) => {
      await delay(750);

      const category = mockDb.getById<Category, 'categories'>('categories', id);

      if (!category) {
        return errorResponse('Category not found', 404);
      }

      const updatedCategory = {
        ...category,
        ...categoryData,
        updatedAt: new Date().toISOString()
      };

      return mockDb.update<Category, 'categories'>('categories', updatedCategory);
    },

    delete: async (id: string) => {
      await delay(700);

      const success = mockDb.delete('categories', id);

      if (!success) {
        return errorResponse('Category not found', 404);
      }

      return { success: true };
    },

    // Add other category methods...
  },

  // Orders
  orders: {
    getAll: async (filters?: { status?: string; search?: string }) => {
      await delay(900);

      let orders = mockDb.getAll<Order, 'orders'>('orders');

      // Apply filters if provided
      if (filters) {
        if (filters.status) {
          orders = orders.filter(order => order.status === filters.status);
        }

        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          orders = orders.filter(order =>
            order.orderNumber.toLowerCase().includes(searchLower) ||
            order.customerName.toLowerCase().includes(searchLower) ||
            order.supplierName.toLowerCase().includes(searchLower)
          );
        }
      }

      return orders;
    },

    getById: async (id: string) => {
      await delay(800);
      
      const order = mockDb.getById<Order, 'orders'>('orders', id);
      
      if (!order) {
        return errorResponse('Order not found', 404);
      }
      
      return order;
    },

    create: async (orderData: Partial<Order>) => {
      await delay(1000);

      if (!orderData.customerName || !orderData.supplierName) {
        return errorResponse('Customer name and supplier name are required', 400);
      }

      const newOrder: Order = {
        id: `${Date.now()}`,
        customerId: orderData.customerId || `cust-${Date.now()}`,
        customerName: orderData.customerName,
        supplierId: orderData.supplierId || `supp-${Date.now()}`,
        supplierName: orderData.supplierName,
        orderNumber: orderData.orderNumber || `ORD-${Date.now().toString().substring(7)}`,
        totalAmount: orderData.totalAmount || 0,
        status: orderData.status || 'pending',
        paymentStatus: orderData.paymentStatus || 'pending',
        paymentMethod: orderData.paymentMethod || 'credit_card',
        shippingAddress: orderData.shippingAddress || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        items: orderData.items || [],
        orderDate: orderData.orderDate || new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...orderData
      };

      return mockDb.create<Order, 'orders'>('orders', newOrder);
    },

    update: async (id: string, orderData: Partial<Order>) => {
      await delay(900);

      const order = mockDb.getById<Order, 'orders'>('orders', id);

      if (!order) {
        return errorResponse('Order not found', 404);
      }

      const updatedOrder = {
        ...order,
        ...orderData,
        updatedAt: new Date().toISOString()
      };

      return mockDb.update<Order, 'orders'>('orders', updatedOrder);
    },

    delete: async (id: string) => {
      await delay(800);

      const success = mockDb.delete('orders', id);

      if (!success) {
        return errorResponse('Order not found', 404);
      }

      return { success: true };
    }
  },

  // Dashboard
  dashboard: {
    getStats: async () => {
      await delay(1000);

      const stats = mockDb.getAll<DashboardStats, 'dashboardStats'>('dashboardStats')[0];
      return stats;
    }
  }
};





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
import { mockProfile, mockActivityLog, updateProfileData, generateAvatarUrl } from './entities/profile';
import { businessTypes } from './entities/businessTypes';
import type { UserProfile, ProfileUpdateRequest, PasswordChangeRequest, ActivityLogItem } from '../features/profile/types';
import type { BusinessType } from './entities/businessTypes';

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
        console.log('[Mock Auth] Admin user found, generating token');
        // Generate mock JWT token
        const token = `mock-jwt-token-${Date.now()}`;

        return {
          user: {
            id: mockProfile.id,
            name: mockProfile.name,
            email: mockProfile.email,
            type: 'admin',
            avatar: mockProfile.avatar,
            role: mockProfile.role
          },
          token,
          expiresIn: 3600 // 1 hour
        };
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
      // For mock, return the admin user data consistent with profile
      return {
        id: mockProfile.id,
        name: mockProfile.name,
        email: mockProfile.email,
        type: 'admin',
        avatar: mockProfile.avatar,
        role: mockProfile.role
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
    },

    toggleStatus: async (id: string, status: 'active' | 'banned') => {
      await delay(600);

      const user = mockDb.getById<User, 'users'>('users', id);

      if (!user) {
        return errorResponse('User not found', 404);
      }

      const updatedUser = {
        ...user,
        status,
        updatedAt: new Date().toISOString()
      };

      return mockDb.update<User, 'users'>('users', updatedUser);
    },

    uploadImage: async (file: File) => {
      await delay(1000);

      if (simulateRandomFailure(0.05)) {
        return errorResponse('Failed to upload image');
      }

      // Simulate image upload and return a mock URL
      const imageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(file.name)}&background=3b82f6&color=fff&size=128`;

      return { imageUrl };
    }
  },

  // Suppliers
  suppliers: {
    getAll: async (filters?: { status?: string; verificationStatus?: string; search?: string }) => {
      await delay(800);

      let suppliers = mockDb.getAll<Supplier, 'suppliers'>('suppliers');

      // Map companyName to name for component compatibility
      const mappedSuppliers = suppliers.map(supplier => ({
        ...supplier,
        name: supplier.companyName,
        joinDate: supplier.verificationDate?.split('T')[0] || supplier.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0]
      }));

      // Apply filters if provided
      if (filters) {
        let filteredSuppliers = mappedSuppliers;

        if (filters.status) {
          filteredSuppliers = filteredSuppliers.filter(supplier => supplier.status === filters.status);
        }

        if (filters.verificationStatus) {
          filteredSuppliers = filteredSuppliers.filter(supplier => supplier.verificationStatus === filters.verificationStatus);
        }

        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredSuppliers = filteredSuppliers.filter(supplier =>
            supplier.name.toLowerCase().includes(searchLower) ||
            supplier.contactPerson.toLowerCase().includes(searchLower) ||
            supplier.email.toLowerCase().includes(searchLower)
          );
        }

        return filteredSuppliers;
      }

      return mappedSuppliers;
    },

    getById: async (id: string) => {
      await delay(500);

      const supplier = mockDb.getById<Supplier, 'suppliers'>('suppliers', id);

      if (!supplier) {
        return errorResponse('Supplier not found', 404);
      }

      // Map companyName to name for component compatibility
      const mappedSupplier = {
        ...supplier,
        name: supplier.companyName,
        joinDate: supplier.verificationDate?.split('T')[0] || supplier.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0]
      };

      return mappedSupplier;
    },

    create: async (supplierData: any) => {
      await delay(1000);

      if (!supplierData.name || !supplierData.email) {
        return errorResponse('Supplier name and email are required', 400);
      }

      // Check if email already exists
      const suppliers = mockDb.getAll<Supplier, 'suppliers'>('suppliers');
      const existingSupplier = suppliers.find(s => s.email.toLowerCase() === supplierData.email?.toLowerCase());

      if (existingSupplier) {
        return errorResponse('Email already in use', 409);
      }

      const newSupplier: Supplier = {
        id: `${Date.now()}`,
        companyName: supplierData.name,
        contactPerson: supplierData.contactPerson || supplierData.name,
        email: supplierData.email,
        phone: supplierData.phone || '',
        status: 'active',
        verificationStatus: 'pending',
        verificationDate: new Date().toISOString(),
        productCount: 0,
        rating: 0,
        categories: supplierData.categories || [],
        logo: supplierData.image || '',
        website: supplierData.website || '',
        address: supplierData.address || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const createdSupplier = mockDb.create<Supplier, 'suppliers'>('suppliers', newSupplier);

      // Map companyName to name for component compatibility (same as getAll and getById)
      const mappedSupplier = {
        ...createdSupplier,
        name: createdSupplier.companyName,
        joinDate: createdSupplier.verificationDate?.split('T')[0] || createdSupplier.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0]
      };

      return mappedSupplier;
    },

    update: async (id: string, supplierData: any) => {
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

      // Handle name field mapping
      if (supplierData.name) {
        updatedSupplier.companyName = supplierData.name;
      }

      const savedSupplier = mockDb.update<Supplier, 'suppliers'>('suppliers', updatedSupplier);

      // Map companyName to name for component compatibility (same as getAll and getById)
      const mappedSupplier = {
        ...savedSupplier,
        name: savedSupplier.companyName,
        joinDate: savedSupplier.verificationDate?.split('T')[0] || savedSupplier.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0]
      };

      return mappedSupplier;
    },

    updateVerification: async (id: string, verificationData: { verificationStatus: 'verified' | 'pending' | 'rejected' }) => {
      await delay(600);

      const supplier = mockDb.getById<Supplier, 'suppliers'>('suppliers', id);

      if (!supplier) {
        return errorResponse('Supplier not found', 404);
      }

      const updatedSupplier = {
        ...supplier,
        verificationStatus: verificationData.verificationStatus,
        verificationDate: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const savedSupplier = mockDb.update<Supplier, 'suppliers'>('suppliers', updatedSupplier);

      // Map companyName to name for component compatibility (same as getAll and getById)
      const mappedSupplier = {
        ...savedSupplier,
        name: savedSupplier.companyName,
        joinDate: savedSupplier.verificationDate?.split('T')[0] || savedSupplier.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0]
      };

      return mappedSupplier;
    },

    delete: async (id: string) => {
      await delay(700);

      const success = mockDb.delete('suppliers', id);

      if (!success) {
        return errorResponse('Supplier not found', 404);
      }

      return { success: true };
    },

    getProducts: async (_supplierId: string, _filters?: any) => {
      await delay(600);

      // Mock supplier products data
      const mockProducts = [
        {
          id: '1',
          name: 'Wireless Bluetooth Headphones',
          sku: 'WBH-001',
          category: 'Electronics',
          price: 99.99,
          stock: 150,
          status: 'active',
          description: 'High-quality wireless headphones with noise cancellation',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-20T14:45:00Z'
        },
        {
          id: '2',
          name: 'Smart Watch Pro',
          sku: 'SWP-002',
          category: 'Electronics',
          price: 299.99,
          stock: 75,
          status: 'active',
          description: 'Advanced smartwatch with health monitoring features',
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop',
          createdAt: '2024-01-10T09:15:00Z',
          updatedAt: '2024-01-18T16:20:00Z'
        },
        {
          id: '3',
          name: 'USB-C Cable',
          sku: 'USC-003',
          category: 'Accessories',
          price: 19.99,
          stock: 0,
          status: 'out_of_stock',
          description: 'High-speed USB-C charging cable',
          createdAt: '2024-01-05T11:00:00Z',
          updatedAt: '2024-01-22T13:30:00Z'
        }
      ];

      return mockProducts;
    },

    getDocuments: async (_supplierId: string, _filters?: any) => {
      await delay(500);

      // Mock supplier documents data
      const mockDocuments = [
        {
          id: '1',
          name: 'Business License',
          type: 'business_license',
          fileName: 'business_license_2024.pdf',
          fileSize: 2048576,
          uploadDate: '2024-01-10T09:30:00Z',
          url: '#',
          notes: 'Valid until December 2024'
        },
        {
          id: '2',
          name: 'Tax Certificate',
          type: 'tax_certificate',
          fileName: 'tax_cert_2024.pdf',
          fileSize: 1536000,
          uploadDate: '2024-01-12T14:15:00Z',
          url: '#'
        },
        {
          id: '3',
          name: 'Insurance Policy',
          type: 'insurance',
          fileName: 'insurance_policy.pdf',
          fileSize: 3072000,
          uploadDate: '2024-01-15T11:45:00Z',
          url: '#',
          notes: 'Awaiting verification'
        }
      ];

      return mockDocuments;
    },

    getAnalytics: async (_supplierId: string, _filters?: any) => {
      await delay(700);

      // Mock supplier analytics data
      const mockAnalytics = {
        totalOrders: 245,
        totalRevenue: 48750.50,
        productCount: 156,
        averageOrderValue: 198.98,
        revenueHistory: [
          { date: '2024-01', amount: 12500 },
          { date: '2024-02', amount: 15200 },
          { date: '2024-03', amount: 21050.50 }
        ],
        salesByProduct: [
          { productName: 'Wireless Headphones', amount: 15000, quantity: 150 },
          { productName: 'Smart Watch Pro', amount: 22500, quantity: 75 },
          { productName: 'USB-C Cable', amount: 1999, quantity: 100 }
        ],
        orderTrends: [
          { date: '2024-01', orders: 85 },
          { date: '2024-02', orders: 92 },
          { date: '2024-03', orders: 68 }
        ],
        topCategories: [
          { category: 'Electronics', revenue: 37500, percentage: 76.9 },
          { category: 'Accessories', revenue: 11250.50, percentage: 23.1 }
        ]
      };

      return mockAnalytics;
    },

    uploadImage: async (supplierId: string, _file: File) => {
      await delay(1000);

      if (simulateRandomFailure(0.05)) {
        return errorResponse('Failed to upload image');
      }

      // Simulate image upload and return a mock URL
      const imageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(supplierId)}&background=3b82f6&color=fff&size=128`;

      return { imageUrl };
    },

    ban: async (id: string) => {
      await delay(700);

      const supplier = mockDb.getById<Supplier, 'suppliers'>('suppliers', id);

      if (!supplier) {
        return errorResponse('Supplier not found', 404);
      }

      const bannedSupplier = {
        ...supplier,
        status: 'banned' as const,
        updatedAt: new Date().toISOString()
      };

      const savedSupplier = mockDb.update<Supplier, 'suppliers'>('suppliers', bannedSupplier);

      // Map companyName to name for component compatibility (same as getAll and getById)
      const mappedSupplier = {
        ...savedSupplier,
        name: savedSupplier.companyName,
        joinDate: savedSupplier.verificationDate?.split('T')[0] || savedSupplier.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0]
      };

      return mappedSupplier;
    },

    unban: async (id: string) => {
      await delay(700);

      const supplier = mockDb.getById<Supplier, 'suppliers'>('suppliers', id);

      if (!supplier) {
        return errorResponse('Supplier not found', 404);
      }

      const unbannedSupplier = {
        ...supplier,
        status: 'active' as const,
        updatedAt: new Date().toISOString()
      };

      const savedSupplier = mockDb.update<Supplier, 'suppliers'>('suppliers', unbannedSupplier);

      // Map companyName to name for component compatibility (same as getAll and getById)
      const mappedSupplier = {
        ...savedSupplier,
        name: savedSupplier.companyName,
        joinDate: savedSupplier.verificationDate?.split('T')[0] || savedSupplier.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0]
      };

      return mappedSupplier;
    }
  },

  // Products
  products: {
    getById: async (id: string) => {
      await delay(500);

      // Mock product data with extended fields for the specific ID
      const mockProduct = {
        id: id,
        name: 'Wireless Bluetooth Headphones Pro',
        sku: 'WBH-PRO-001',
        category: 'Electronics',
        price: 199.99,
        stock: 85,
        minimumStock: 10,
        status: 'active',
        description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality. Perfect for music lovers and professionals who demand the best audio experience.',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=400&h=400&fit=crop'
        ],
        attributes: [
          { id: '1', name: 'Brand', value: 'AudioTech', type: 'text' },
          { id: '2', name: 'Weight', value: '250', type: 'number', unit: 'grams' },
          { id: '3', name: 'Battery Life', value: '30', type: 'number', unit: 'hours' },
          { id: '4', name: 'Wireless', value: 'true', type: 'boolean' },
          { id: '5', name: 'Noise Cancellation', value: 'Active', type: 'select' },
          { id: '6', name: 'Frequency Response', value: '20Hz - 20kHz', type: 'text' }
        ],
        variants: [
          {
            id: '1',
            name: 'Black',
            sku: 'WBH-PRO-001-BLK',
            price: 199.99,
            stock: 45,
            attributes: { color: 'Black', size: 'Standard' },
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop'
          },
          {
            id: '2',
            name: 'White',
            sku: 'WBH-PRO-001-WHT',
            price: 199.99,
            stock: 25,
            attributes: { color: 'White', size: 'Standard' },
            image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=150&h=150&fit=crop'
          },
          {
            id: '3',
            name: 'Silver',
            sku: 'WBH-PRO-001-SLV',
            price: 219.99,
            stock: 15,
            attributes: { color: 'Silver', size: 'Standard' },
            image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=150&h=150&fit=crop'
          }
        ],
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-20T14:45:00Z'
      };

      return mockProduct;
    },

    update: async (id: string, productData: any) => {
      await delay(800);

      if (simulateRandomFailure(0.05)) {
        return errorResponse('Failed to update product');
      }

      // Get the current product
      const currentProduct = await handlers.products.getById(id);

      // Merge the updates
      const updatedProduct = {
        ...currentProduct,
        ...productData,
        updatedAt: new Date().toISOString()
      };

      return updatedProduct;
    },

    uploadImages: async (_id: string, _files: File[]) => {
      await delay(1200);

      if (simulateRandomFailure(0.05)) {
        return errorResponse('Failed to upload images');
      }

      // Simulate image upload and return mock URLs
      const imageUrls = [
        `https://images.unsplash.com/photo-${Date.now()}-1?w=400&h=400&fit=crop`,
        `https://images.unsplash.com/photo-${Date.now()}-2?w=400&h=400&fit=crop`
      ];

      return { imageUrls };
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
        subcategoryCount: 0,
        status: categoryData.status || 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        visibleInSupplierApp: true,
        visibleInCustomerApp: true,
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
      await delay(300);

      const stats = mockDb.getAll<DashboardStats, 'dashboardStats'>('dashboardStats')[0];
      return stats;
    },

    getSalesData: async (period: 'day' | 'week' | 'month' | 'year') => {
      await delay(300);

      const stats = mockDb.getAll<DashboardStats, 'dashboardStats'>('dashboardStats')[0];
      if (!stats) return [];

      // Transform chart data to SalesData format
      // Note: In a real implementation, the period would affect the data returned
      console.log(`Fetching sales data for period: ${period}`);
      return stats.revenueData.datasets[0]?.data.map((value, index) => ({
        date: stats.revenueData.labels[index] || '',
        amount: value as number
      })) || [];
    },

    getUserGrowth: async (period: 'week' | 'month' | 'year') => {
      await delay(300);

      const stats = mockDb.getAll<DashboardStats, 'dashboardStats'>('dashboardStats')[0];
      if (!stats) return [];

      // Transform chart data to UserGrowth format
      // Note: In a real implementation, the period would affect the data returned
      console.log(`Fetching user growth data for period: ${period}`);
      return stats.userGrowth.datasets[0]?.data.map((value, index) => ({
        date: stats.userGrowth.labels[index] || '',
        users: value as number
      })) || [];
    },

    getCategoryDistribution: async () => {
      await delay(300);

      const stats = mockDb.getAll<DashboardStats, 'dashboardStats'>('dashboardStats')[0];
      if (!stats) return { labels: [], datasets: [] };

      return stats.categoryDistribution;
    }
  },

  // Profile
  profile: {
    getProfile: async (): Promise<UserProfile> => {
      console.log('[Mock Profile] Getting profile');
      await delay(600);

      if (simulateRandomFailure(0.02)) {
        throw new Error('Failed to fetch profile');
      }

      return mockProfile;
    },

    updateProfile: async (profileData: ProfileUpdateRequest): Promise<UserProfile> => {
      console.log('[Mock Profile] Updating profile', profileData);
      await delay(800);

      if (simulateRandomFailure(0.05)) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = updateProfileData(profileData);
      return updatedProfile;
    },

    updateProfilePicture: async (file: File | FormData): Promise<UserProfile> => {
      console.log('[Mock Profile] Updating profile picture', file);
      await delay(1200);

      if (simulateRandomFailure(0.05)) {
        throw new Error('Failed to update profile picture');
      }

      // Simulate successful upload with a new avatar URL
      const newAvatarUrl = generateAvatarUrl(mockProfile.name);
      const updatedProfile = updateProfileData({ avatar: newAvatarUrl });
      return updatedProfile;
    },

    deleteProfilePicture: async (): Promise<UserProfile> => {
      console.log('[Mock Profile] Deleting profile picture');
      await delay(700);

      if (simulateRandomFailure(0.03)) {
        throw new Error('Failed to delete profile picture');
      }

      // Remove avatar by setting it to a default generated one
      const defaultAvatarUrl = generateAvatarUrl(mockProfile.name);
      const updatedProfile = updateProfileData({ avatar: defaultAvatarUrl });
      return updatedProfile;
    },

    changePassword: async (passwordData: PasswordChangeRequest): Promise<{ success: boolean }> => {
      console.log('[Mock Profile] Changing password');
      await delay(900);

      if (!passwordData.currentPassword || !passwordData.newPassword) {
        throw new Error('Current password and new password are required');
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('New password and confirmation do not match');
      }

      if (passwordData.currentPassword === 'wrongpassword') {
        throw new Error('Current password is incorrect');
      }

      if (simulateRandomFailure(0.05)) {
        throw new Error('Failed to change password');
      }

      return { success: true };
    },

    updatePreferences: async (preferences: UserProfile['notificationsEnabled']): Promise<UserProfile['notificationsEnabled']> => {
      console.log('[Mock Profile] Updating preferences', preferences);
      await delay(600);

      if (simulateRandomFailure(0.03)) {
        throw new Error('Failed to update preferences');
      }

      return preferences;
    },

    getPreferences: async (): Promise<UserProfile['notificationsEnabled']> => {
      console.log('[Mock Profile] Getting preferences');
      await delay(400);

      if (simulateRandomFailure(0.02)) {
        throw new Error('Failed to fetch preferences');
      }

      return mockProfile.notificationsEnabled;
    },

    getActivityLog: async (params?: { page?: number; limit?: number }): Promise<ActivityLogItem[]> => {
      console.log('[Mock Profile] Getting activity log', params);
      console.log('[Mock Profile] mockActivityLog length:', mockActivityLog.length);
      console.log('[Mock Profile] mockActivityLog data:', mockActivityLog);
      await delay(700);

      if (simulateRandomFailure(0.03)) {
        throw new Error('Failed to fetch activity log');
      }

      // Simple pagination simulation
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const result = mockActivityLog.slice(startIndex, endIndex);
      console.log('[Mock Profile] Returning activity log result:', result);
      return result;
    }
  },

  // Business Types
  businessTypes: {
    getAll: async (): Promise<BusinessType[]> => {
      await delay(300);
      return businessTypes;
    },

    getById: async (id: string): Promise<BusinessType | { error: { message: string; status: number } }> => {
      await delay(300);

      const businessType = businessTypes.find(bt => bt.id === id);

      if (!businessType) {
        return errorResponse('Business type not found', 404);
      }

      return businessType;
    }
  },

  // Verifications
  verifications: {
    getAll: async (filters?: { status?: string; search?: string }) => {
      await delay(800);

      // Mock verification data
      const mockVerifications = [
        {
          id: '1',
          companyName: 'Global Electronics',
          contactPerson: 'David Chen',
          email: 'david@globalelectronics.com',
          phone: '+1 (456) 789-0123',
          status: 'pending' as const,
          submittedDate: '2024-01-12T16:20:00Z',
          documents: [
            { name: 'Business License', type: 'PDF', url: '#' },
            { name: 'Tax Certificate', type: 'PDF', url: '#' },
            { name: 'Company Profile', type: 'DOCX', url: '#' }
          ]
        },
        {
          id: '2',
          companyName: 'Fashion Trends Inc',
          contactPerson: 'Emma Thompson',
          email: 'emma@fashiontrends.com',
          phone: '+1 (789) 012-3456',
          status: 'pending' as const,
          submittedDate: '2024-01-14T15:40:00Z',
          documents: [
            { name: 'Business License', type: 'PDF', url: '#' },
            { name: 'Tax Certificate', type: 'PDF', url: '#' }
          ]
        },
        {
          id: '3',
          companyName: 'Tech Solutions Ltd',
          contactPerson: 'Michael Johnson',
          email: 'michael@techsolutions.com',
          phone: '+1 (321) 654-9870',
          status: 'approved' as const,
          submittedDate: '2024-01-10T14:30:00Z',
          approvedDate: '2024-01-11T10:15:00Z',
          documents: [
            { name: 'Business License', type: 'PDF', url: '#' },
            { name: 'Tax Certificate', type: 'PDF', url: '#' },
            { name: 'Insurance Certificate', type: 'PDF', url: '#' }
          ]
        }
      ];

      let verifications = mockVerifications;

      // Apply filters if provided
      if (filters) {
        if (filters.status) {
          verifications = verifications.filter(verification => verification.status === filters.status);
        }

        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          verifications = verifications.filter(verification =>
            verification.companyName.toLowerCase().includes(searchLower) ||
            verification.contactPerson.toLowerCase().includes(searchLower) ||
            verification.email.toLowerCase().includes(searchLower)
          );
        }
      }

      return verifications;
    },

    getById: async (id: string) => {
      await delay(600);

      const verifications = await handlers.verifications.getAll();
      const verification = verifications.find(v => v.id === id);

      if (!verification) {
        return errorResponse('Verification not found', 404);
      }

      return verification;
    },

    create: async (verificationData: any) => {
      await delay(700);

      const newVerification = {
        id: Date.now().toString(),
        companyName: verificationData.companyName,
        contactPerson: verificationData.contactPerson,
        email: verificationData.email,
        phone: verificationData.phone,
        status: 'pending' as const,
        submittedDate: new Date().toISOString(),
        documents: verificationData.documents || []
      };

      return newVerification;
    },

    update: async (id: string, verificationData: any) => {
      await delay(600);

      const verifications = await handlers.verifications.getAll();
      const verification = verifications.find(v => v.id === id);

      if (!verification) {
        return errorResponse('Verification not found', 404);
      }

      const updatedVerification = {
        ...verification,
        ...verificationData,
        updatedAt: new Date().toISOString()
      };

      return updatedVerification;
    },

    approve: async (id: string, notes?: string) => {
      await delay(600);

      const verifications = await handlers.verifications.getAll();
      const verification = verifications.find(v => v.id === id);

      if (!verification) {
        return errorResponse('Verification not found', 404);
      }

      const approvedVerification = {
        ...verification,
        status: 'approved' as const,
        approvedDate: new Date().toISOString(),
        notes: notes || '',
        updatedAt: new Date().toISOString()
      };

      return approvedVerification;
    },

    reject: async (id: string, notes: string) => {
      await delay(600);

      const verifications = await handlers.verifications.getAll();
      const verification = verifications.find(v => v.id === id);

      if (!verification) {
        return errorResponse('Verification not found', 404);
      }

      const rejectedVerification = {
        ...verification,
        status: 'rejected' as const,
        rejectedDate: new Date().toISOString(),
        notes: notes,
        updatedAt: new Date().toISOString()
      };

      return rejectedVerification;
    },

    updateStatus: async (id: string, status: string) => {
      await delay(600);

      const verifications = await handlers.verifications.getAll();
      const verification = verifications.find(v => v.id === id);

      if (!verification) {
        return errorResponse('Verification not found', 404);
      }

      const updatedVerification = {
        ...verification,
        status: status as any,
        updatedAt: new Date().toISOString()
      };

      return updatedVerification;
    }
  }
};





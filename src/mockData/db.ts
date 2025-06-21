/**
 * Mock Database
 *
 * This file serves as a mock database for development purposes.
 * It provides methods to interact with the mock data and simulates
 * basic CRUD operations.
 */

import type { User } from './entities/users';  
import { users } from './entities/users';  
import { suppliers, type Supplier } from './entities/suppliers';

import { orders, type Order } from './entities/orders';
import { dashboardStats, type DashboardStats } from './entities/dashboard';

// Define database structure
interface Database {
  users: User[];
  suppliers: Supplier[];
  orders: Order[];
  dashboardStats: DashboardStats;
}

// Local storage keys
const STORAGE_KEYS = {
  USERS: 'connectchain_users',
  SUPPLIERS: 'connectchain_suppliers',
  ORDERS: 'connectchain_orders',
};

// Type mapping for collections to their respective types
// type _CollectionType<K extends keyof Database> =
//   K extends 'users' ? User[] :
//   K extends 'suppliers' ? Supplier[] :
//   K extends 'orders' ? Order[] :
//   K extends 'dashboardStats' ? DashboardStats :
//   never;

// Helper to load data from localStorage
const loadFromStorage = <T>(key: string, defaultData: T[]): T[] => {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultData;
  } catch (error) {
    console.error(`Error loading data from localStorage for key ${key}:`, error);
    return defaultData;
  }
};

// Helper to save data to localStorage
const saveToStorage = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving data to localStorage for key ${key}:`, error);
  }
};

// Initialize database with seed data or load from localStorage
const initializeDb = (): Database => {
  console.log('[Mock DB] Initializing database');

  // Always ensure we have the admin user in the database
  let dbUsers = loadFromStorage(STORAGE_KEYS.USERS, users);

  // Check if admin user exists
  const adminExists = dbUsers.some(user =>
    user.email.toLowerCase() === 'admin@connectchain.com' && user.type === 'admin'
  );

  if (!adminExists) {
    console.log('[Mock DB] Admin user not found, adding to database');
    // Find admin in original seed data
    const adminUser = users.find(u => u.email.toLowerCase() === 'admin@connectchain.com');
    if (adminUser) {
      dbUsers.push(adminUser);
    }
  }

  const db: Database = {
    users: dbUsers,
    suppliers: loadFromStorage(STORAGE_KEYS.SUPPLIERS, suppliers),
    orders: loadFromStorage(STORAGE_KEYS.ORDERS, orders),
    dashboardStats,
  };

  // Save initial data to localStorage
  saveToStorage(STORAGE_KEYS.USERS, db.users);
  saveToStorage(STORAGE_KEYS.SUPPLIERS, db.suppliers);
  saveToStorage(STORAGE_KEYS.ORDERS, db.orders);

  return db;
};

// Initialize the database
const db = initializeDb();

// Helper to check if a collection is an array
const isArrayCollection = (collection: keyof Database): boolean => {
  return collection !== 'dashboardStats';
};

// Helper to save collection to localStorage if applicable
const saveCollectionToStorage = <K extends keyof Database>(collection: K): void => {
  if (collection === 'users') {
    saveToStorage(STORAGE_KEYS.USERS, db.users);
  } else if (collection === 'suppliers') {
    saveToStorage(STORAGE_KEYS.SUPPLIERS, db.suppliers);
  } else if (collection === 'orders') {
    saveToStorage(STORAGE_KEYS.ORDERS, db.orders);
  }
};

// Generic CRUD operations
export const mockDb = {
  // Generic get all items
  getAll: <T, K extends keyof Database>(collection: K): T[] => {
    if (isArrayCollection(collection)) {
      return [...(db[collection] as any[])] as T[];
    }
    return [db[collection]] as unknown as T[];
  },

  // Generic get item by id
  getById: <T, K extends keyof Database>(collection: K, id: string): T | undefined => {
    if (!isArrayCollection(collection)) {
      return undefined;
    }
    return ((db[collection] as any[]).find(item => item.id === id)) as T;
  },

  // Generic create item
  create: <T extends { id?: string }, K extends keyof Database>(collection: K, item: T): T => {
    if (!isArrayCollection(collection)) {
      throw new Error(`Cannot create item in non-array collection: ${collection}`);
    }

    const newItem = {
      ...item,
      id: item.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    };

    (db[collection] as any[]).push(newItem);

    // Save to localStorage if applicable
    saveCollectionToStorage(collection);

    return newItem as T;
  },

  // Generic update item
  update: <T extends { id: string }, K extends keyof Database>(collection: K, item: T): T => {
    if (!isArrayCollection(collection)) {
      throw new Error(`Cannot update item in non-array collection: ${collection}`);
    }

    const index = (db[collection] as any[]).findIndex(i => i.id === item.id);

    if (index === -1) {
      throw new Error(`Item with id ${item.id} not found in ${collection}`);
    }

    const collectionArray = db[collection] as any[];
    collectionArray[index] = { ...collectionArray[index], ...item };

    // Save to localStorage if applicable
    saveCollectionToStorage(collection);

    return item;
  },

  // Generic delete item
  delete: <K extends keyof Database>(collection: K, id: string): boolean => {
    if (!isArrayCollection(collection)) {
      throw new Error(`Cannot delete item from non-array collection: ${collection}`);
    }

    const index = (db[collection] as any[]).findIndex(item => item.id === id);

    if (index === -1) {
      return false;
    }

    (db[collection] as any[]).splice(index, 1);

    // Save to localStorage if applicable
    saveCollectionToStorage(collection);

    return true;
  },

  // Reset database to initial seed data
  reset: () => {
    console.log('[Mock DB] Resetting database to initial seed data');
    Object.values(STORAGE_KEYS).forEach(key => {
      console.log(`[Mock DB] Removing localStorage key: ${key}`);
      localStorage.removeItem(key);
    });
    return initializeDb();
  },

  // Force reset the database (for troubleshooting)
  forceReset: () => {
    console.log('[Mock DB] Force resetting database');
    // Clear all localStorage keys that might be related
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('connectchain') || key.includes('auth'))) {
        console.log(`[Mock DB] Removing key: ${key}`);
        localStorage.removeItem(key);
      }
    }
    return initializeDb();
  },
};

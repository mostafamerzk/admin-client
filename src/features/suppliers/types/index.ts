/**
 * Supplier Types
 *
 * This file defines the TypeScript interfaces for the suppliers feature.
 */

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'pending' | 'rejected' | 'banned';
  verificationStatus: 'verified' | 'pending' | 'rejected';
  joinDate: string;
  categories?: string[];
  contactPerson: string;
  logo?: string;
  website?: string;
}

export interface SupplierFormData {
  supplierName: string;
  email: string;
  phone: string;
  address: string;
  businessType: string;
  password: string;
  confirmPassword: string;
  image?: File | null;
}

// Product types for supplier products
export interface SupplierProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  minimumStock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  description?: string;
  image?: string;
  images?: string[];
  attributes?: ProductAttribute[];
  variants?: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

// Product attribute types
export interface ProductAttribute {
  id: string;
  name: string;
  value: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  unit?: string;
}

// Product variant types
export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: {
    [key: string]: string;
  };
  image?: string;
}

// Document types for verification documents
export interface SupplierDocument {
  id: string;
  name: string;
  type: 'business_license' | 'tax_certificate' | 'insurance' | 'certification' | 'other';
  fileName: string;
  fileSize: number;
  uploadDate: string;
  url: string;
  notes?: string;
}

// Analytics types for supplier performance
export interface SupplierAnalyticsData {
  totalOrders: number;
  totalRevenue: number;
  productCount: number;
  averageOrderValue: number;
  revenueHistory: {
    date: string;
    amount: number;
  }[];
  salesByProduct: {
    productName: string;
    amount: number;
    quantity: number;
  }[];
  orderTrends: {
    date: string;
    orders: number;
  }[];
  topCategories: {
    category: string;
    revenue: number;
    percentage: number;
  }[];
}

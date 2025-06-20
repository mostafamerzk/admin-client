/**
 * Supplier Types
 *
 * This file defines the TypeScript interfaces for the suppliers feature.
 */

// Backend API response wrapper
export interface ApiResponseWrapper<T> {
  success: boolean;
  message: string;
  data: T;
}

// Backend supplier interface matching API specification
export interface BackendSupplier {
  id: string; // Backend uses string IDs (UUIDs)
  name?: string; // Business name (optional)
  email: string;
  password?: string; // Only for creation
  contactPerson: string;
  phone?: string;
  address?: string;
  categories?: string; // Single category name (not array)
  image?: string; // Base64 encoded logo image (for creation/update)
  logo?: string; // Logo URL (for retrieval) - backend uses 'logo' field in responses
  status: 'active' | 'banned';
  verificationStatus: 'verified' | 'pending';
  createdDate?: string; // Backend uses createdDate (optional in case not provided)
  updatedDate?: string; // Backend uses updatedDate (optional in case not provided)
}

// Frontend supplier interface (for UI compatibility)
export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'banned'; // Backend only supports active/banned
  verificationStatus: 'verified' | 'pending'; // Backend only supports verified/pending
  categories?: string[];
  contactPerson: string;
  logo?: string;
  website?: string;
}

// Form data interface matching backend requirements
export interface SupplierFormData {
  email: string; // Required
  password: string; // Required
  contactPerson: string; // Required
  name?: string; // Optional business name
  phone?: string; // Optional
  address?: string; // Optional
  categories?: string; // Optional single category name
  image?: File | string | null; // Optional base64 encoded logo image
  // Frontend-only fields for form validation
  confirmPassword?: string;
  businessType?: string; // Maps to categories
  supplierName?: string; // Maps to name and contactPerson
}

// Backend API query parameters for suppliers
export interface SupplierQueryParams {
  page?: number; // Page number (default: 1)
  limit?: number; // Items per page (default: 20, max: 100)
  search?: string; // Search in supplier name and email
  verificationStatus?: 'verified' | 'pending'; // Filter by verification status
  status?: 'active' | 'banned'; // Filter by supplier status
  sort?: 'Name' | 'Email' | 'createdAt' | 'updatedAt'; // Sort field
  order?: 'asc' | 'desc'; // Sort order
}

// Backend pagination response
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Backend suppliers list response
export interface SuppliersListResponse {
  success: boolean;
  message: string;
  data: {
    suppliers: BackendSupplier[];
    pagination?: PaginationInfo;
  };
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

// Product types for supplier products
export interface SupplierProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  minimumStock?: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
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

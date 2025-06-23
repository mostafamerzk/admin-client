/**
 * Category Types
 *
 * This file defines the TypeScript interfaces for the categories feature.
 */

// Product interface for flat category structure
export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  image?: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

// Category interface (flat structure - no subcategories)
export interface Category {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  productCount: number;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

// Form data interfaces
export interface CategoryFormData {
  name: string;
  description: string;
  status: 'active' | 'inactive';
  image?: File | null; // Image file for upload via multer middleware
}

// Image upload data (the actual data part)
export interface CategoryImageUploadData {
  imageUrl: string;
  uploadDetails: {
    url: string;
    publicId: string;
    originalName: string;
  };
}

// Image upload response (the full API response)
export interface CategoryImageUploadResponse {
  success: boolean;
  message: string;
  data: CategoryImageUploadData;
}

// Management action types
export type CategoryAction = 'edit' | 'delete' | 'toggle-visibility';
export type ProductAction = 'view' | 'edit' | 'delete';

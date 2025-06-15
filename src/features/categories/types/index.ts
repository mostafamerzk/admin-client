/**
 * Category Types
 *
 * This file defines the TypeScript interfaces for the categories feature.
 */

// Product interface for category hierarchy
export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  image?: string;
  categoryId: string;
  subcategoryId: string;
  createdAt: string;
  updatedAt: string;
}

// Subcategory interface (second level)
export interface Subcategory {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  categoryId: string; // Parent category ID
  productCount: number;
  products?: Product[];
  image?: string;
  createdAt: string;
  updatedAt: string;
  // Visibility controls for apps
  visibleInSupplierApp: boolean;
  visibleInCustomerApp: boolean;
}

// Category interface (top level)
export interface Category {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  productCount: number;
  subcategoryCount: number;
  subcategories?: Subcategory[];
  image?: string;
  createdAt: string;
  updatedAt: string;
  // Visibility controls for apps
  visibleInSupplierApp: boolean;
  visibleInCustomerApp: boolean;
}

// Form data interfaces
export interface CategoryFormData {
  name: string;
  description: string;
  status: 'active' | 'inactive';
  image?: string;
  visibleInSupplierApp: boolean;
  visibleInCustomerApp: boolean;
}

export interface SubcategoryFormData {
  name: string;
  description: string;
  status: 'active' | 'inactive';
  categoryId: string;
  image?: string;
  visibleInSupplierApp: boolean;
  visibleInCustomerApp: boolean;
}

// Category hierarchy view data
export interface CategoryHierarchy {
  category: Category;
  subcategories: (Subcategory & { products: Product[] })[];
}

// Management action types
export type CategoryAction = 'edit' | 'delete' | 'toggle-visibility';
export type SubcategoryAction = 'edit' | 'delete' | 'toggle-visibility';
export type ProductAction = 'view' | 'edit' | 'delete';

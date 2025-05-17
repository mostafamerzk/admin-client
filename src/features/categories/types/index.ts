/**
 * Category Types
 *
 * This file defines the TypeScript interfaces for the categories feature.
 */

export interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  parentId?: string;
  subcategories?: Subcategory[];
  image?: string;
}

export interface Subcategory {
  id: string;
  name: string;
  productCount: number;
  status: 'active' | 'inactive';
}

export interface CategoryFormData {
  name: string;
  description: string;
  status: 'active' | 'inactive';
  parentCategoryId?: string;
  image?: string;
}

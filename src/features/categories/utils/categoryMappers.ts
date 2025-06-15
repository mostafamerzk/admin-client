/**
 * Category Mappers
 * 
 * Utility functions to map between different category data formats
 */

import type{ Category } from '../types/index';
import { categories as mockCategories } from '../../../mockData/entities/categories';

/**
 * Maps a mock category to the application category format
 */
export const mapMockCategoryToCategory = (mockCategory: Category): Category => {
  // The mock category already has the correct format, just ensure all required fields are present
  const category: Category = {
    id: mockCategory.id,
    name: mockCategory.name,
    description: mockCategory.description || '',
    status: mockCategory.status || 'active',
    productCount: mockCategory.productCount || 0,
    subcategoryCount: mockCategory.subcategoryCount || 0,
    subcategories: mockCategory.subcategories || [],
    createdAt: mockCategory.createdAt ? new Date(mockCategory.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: mockCategory.updatedAt ? new Date(mockCategory.updatedAt).toISOString() : new Date().toISOString(),
    visibleInSupplierApp: mockCategory.visibleInSupplierApp ?? true,
    visibleInCustomerApp: mockCategory.visibleInCustomerApp ?? true
  };

  // Add image only if it exists
  if (mockCategory.image) {
    category.image = mockCategory.image;
  }

  return category;
};

/**
 * Get all categories from mock data
 */
export const getMockCategories = (): Category[] => {
  // All categories in the mock data are already top-level categories with embedded subcategories
  return mockCategories.map(mapMockCategoryToCategory);
};

/**
 * Get all categories (parents and subcategories) from mock data
 */
export const getAllMockCategories = (): Category[] => {
  return mockCategories.map(mapMockCategoryToCategory);
};

/**
 * Get a category by ID from mock data
 */
export const getMockCategoryById = (id: string): Category | undefined => {
  const mockCategory = mockCategories.find(c => c.id === id);
  if (!mockCategory) return undefined;
  return mapMockCategoryToCategory(mockCategory);
};

// Assign to variable before exporting
const categoryMappers = {
  mapMockCategoryToCategory,
  getMockCategories,
  getAllMockCategories,
  getMockCategoryById
};

export default categoryMappers;

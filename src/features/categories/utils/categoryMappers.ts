/**
 * Category Mappers
 * 
 * Utility functions to map between different category data formats
 */

import type{ Category, Subcategory } from '../types/index';
import { categories as mockCategories } from '../../../mockData/entities/categories';

/**
 * Maps a mock category to the application category format
 */
export const mapMockCategoryToCategory = (mockCategory: any): Category => {
  // Create the base category
  const category: Category = {
    id: mockCategory.id,
    name: mockCategory.name,
    description: mockCategory.description,
    productCount: mockCategory.productCount,
    status: mockCategory.status,
    createdAt: mockCategory.createdAt ? (new Date(mockCategory.createdAt).toISOString().split('T')[0] || new Date().toISOString().split('T')[0]!) : new Date().toISOString().split('T')[0]!,
    image: mockCategory.image
  };

  // If it's a parent category, find its subcategories
  if (!mockCategory.parentId) {
    const subcategories = mockCategories
      .filter(c => c.parentId === mockCategory.id)
      .map(subcat => ({
        id: subcat.id,
        name: subcat.name,
        productCount: subcat.productCount,
        status: subcat.status
      } as Subcategory));

    if (subcategories.length > 0) {
      category.subcategories = subcategories;
    }
  } else {
    category.parentId = mockCategory.parentId;
  }

  return category;
};

/**
 * Get all parent categories from mock data
 * (Categories that don't have a parentId)
 */
export const getMockCategories = (): Category[] => {
  // Get parent categories (those without parentId)
  const parentCategories = mockCategories
    .filter(c => !c.parentId)
    .map(mapMockCategoryToCategory);

  return parentCategories;
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

export default {
  mapMockCategoryToCategory,
  getMockCategories,
  getAllMockCategories,
  getMockCategoryById
};

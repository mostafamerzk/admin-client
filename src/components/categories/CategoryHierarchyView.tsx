/**
 * Category Hierarchy View Component
 *
 * Displays the three-level hierarchy: Categories → Subcategories → Products
 */

import React, { memo } from 'react';
import CategoryManagementCard from './CategoryManagementCard';
import type { Category } from '../../features/categories/types';

interface CategoryHierarchyViewProps {
  categories: Category[];
  onDeleteCategory: (categoryId: string) => void;
  onDeleteSubcategory: (subcategoryId: string) => void;
  onToggleCategoryVisibility: (categoryId: string, app: 'supplier' | 'customer') => void;
  onToggleSubcategoryVisibility: (subcategoryId: string, app: 'supplier' | 'customer') => void;
  onProductClick: (productId: string) => void;
  onAddSubcategory: (category: Category) => void;
}

const CategoryHierarchyView: React.FC<CategoryHierarchyViewProps> = ({
  categories,
  onDeleteCategory,
  onDeleteSubcategory,
  onToggleCategoryVisibility,
  onToggleSubcategoryVisibility,
  onProductClick,
  onAddSubcategory
}) => {
  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">No categories found</div>
        <div className="text-gray-400 text-sm">
          Create your first category to get started with organizing your products
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <CategoryManagementCard
          key={category.id}
          category={category}
          onDelete={onDeleteCategory}
          onDeleteSubcategory={onDeleteSubcategory}
          onToggleVisibility={onToggleCategoryVisibility}
          onToggleSubcategoryVisibility={onToggleSubcategoryVisibility}
          onProductClick={onProductClick}
          onAddSubcategory={onAddSubcategory}
        />
      ))}
    </div>
  );
};

export default memo(CategoryHierarchyView);

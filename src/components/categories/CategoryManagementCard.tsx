/**
 * Category Management Card Component
 *
 * Displays a category with its subcategories and management options
 */

import React, { useState, memo } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import StatusBadge from '../common/StatusBadge';
import SubcategoryManagementCard from './SubcategoryManagementCard';
import {
  TrashIcon,
  PlusIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  EyeIcon,
  EyeSlashIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import type { Category } from '../../features/categories/types';

interface CategoryManagementCardProps {
  category: Category;
  onDelete: (categoryId: string) => void;
  onDeleteSubcategory: (subcategoryId: string) => void;
  onToggleVisibility: (categoryId: string, app: 'supplier' | 'customer') => void;
  onToggleSubcategoryVisibility: (subcategoryId: string, app: 'supplier' | 'customer') => void;
  onProductClick: (productId: string) => void;
  onAddSubcategory: (category: Category) => void;
}

const CategoryManagementCard: React.FC<CategoryManagementCardProps> = ({
  category,
  onDelete,
  onDeleteSubcategory,
  onToggleVisibility,
  onToggleSubcategoryVisibility,
  onProductClick,
  onAddSubcategory
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the category "${category.name}"? This will also delete all subcategories and products within it.`)) {
      onDelete(category.id);
    }
  };

  const subcategories = category.subcategories || [];

  return (
    <Card className="overflow-hidden">
      {/* Category Header */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-full hover:bg-gray-200 focus:outline-none"
            >
              {isExpanded ? (
                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronRightIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            <div className="flex items-center space-x-3">
              <TagIcon className="h-6 w-6 text-primary" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Status Badge */}
            <StatusBadge status={category.status} />
            
            {/* Stats */}
            <div className="text-sm text-gray-500">
              <span>{category.subcategoryCount} subcategories</span>
              <span className="mx-2">•</span>
              <span>{category.productCount} products</span>
            </div>

            {/* Visibility Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onToggleVisibility(category.id, 'supplier')}
                className={`p-2 rounded-full transition-colors ${
                  category.visibleInSupplierApp
                    ? 'text-green-600 bg-green-100 hover:bg-green-200'
                    : 'text-gray-400 bg-gray-100 hover:bg-gray-200'
                }`}
                title={`${category.visibleInSupplierApp ? 'Hide from' : 'Show in'} Supplier App`}
              >
                {category.visibleInSupplierApp ? (
                  <EyeIcon className="h-4 w-4" />
                ) : (
                  <EyeSlashIcon className="h-4 w-4" />
                )}
              </button>
              
              <button
                onClick={() => onToggleVisibility(category.id, 'customer')}
                className={`p-2 rounded-full transition-colors ${
                  category.visibleInCustomerApp
                    ? 'text-blue-600 bg-blue-100 hover:bg-blue-200'
                    : 'text-gray-400 bg-gray-100 hover:bg-gray-200'
                }`}
                title={`${category.visibleInCustomerApp ? 'Hide from' : 'Show in'} Customer App`}
              >
                {category.visibleInCustomerApp ? (
                  <EyeIcon className="h-4 w-4" />
                ) : (
                  <EyeSlashIcon className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                icon={<PlusIcon className="h-4 w-4" />}
                onClick={() => onAddSubcategory(category)}
              >
                Add Subcategory
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                icon={<TrashIcon className="h-4 w-4" />}
                onClick={handleDelete}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Subcategories */}
      {isExpanded && (
        <div className="p-6">
          {subcategories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <TagIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-lg font-medium mb-1">No subcategories yet</p>
              <p className="text-sm">Add subcategories to organize products within this category</p>
              <Button
                variant="outline"
                size="sm"
                icon={<PlusIcon className="h-4 w-4" />}
                onClick={() => onAddSubcategory(category)}
                className="mt-4"
              >
                Add First Subcategory
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {subcategories.map((subcategory) => (
                <SubcategoryManagementCard
                  key={subcategory.id}
                  subcategory={subcategory}
                  onDelete={onDeleteSubcategory}
                  onToggleVisibility={onToggleSubcategoryVisibility}
                  onProductClick={onProductClick}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default memo(CategoryManagementCard);

/**
 * Subcategory Management Card Component
 *
 * Displays a subcategory with its products and management options
 */

import React, { useState, memo } from 'react';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import ProductCard from './ProductCard';
import {
  TrashIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  EyeIcon,
  EyeSlashIcon,
  FolderIcon
} from '@heroicons/react/24/outline';
import type { Subcategory } from '../../features/categories/types';

interface SubcategoryManagementCardProps {
  subcategory: Subcategory;
  onDelete: (subcategoryId: string) => void;
  onToggleVisibility: (subcategoryId: string, app: 'supplier' | 'customer') => void;
  onProductClick: (productId: string) => void;
}

const SubcategoryManagementCard: React.FC<SubcategoryManagementCardProps> = ({
  subcategory,
  onDelete,
  onToggleVisibility,
  onProductClick
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the subcategory "${subcategory.name}"? This will also delete all products within it.`)) {
      onDelete(subcategory.id);
    }
  };

  const products = subcategory.products || [];

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      {/* Subcategory Header */}
      <div className="p-4 border-b border-gray-100 bg-gray-25">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-full hover:bg-gray-200 focus:outline-none"
            >
              {isExpanded ? (
                <ChevronDownIcon className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRightIcon className="h-4 w-4 text-gray-500" />
              )}
            </button>
            
            <div className="flex items-center space-x-2">
              <FolderIcon className="h-5 w-5 text-blue-500" />
              <div>
                <h4 className="font-medium text-gray-900">{subcategory.name}</h4>
                <p className="text-sm text-gray-600">{subcategory.description}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Status Badge */}
            <StatusBadge status={subcategory.status} />
            
            {/* Product Count */}
            <div className="text-sm text-gray-500">
              {subcategory.productCount} products
            </div>

            {/* Visibility Controls */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => onToggleVisibility(subcategory.id, 'supplier')}
                className={`p-1.5 rounded-full transition-colors ${
                  subcategory.visibleInSupplierApp
                    ? 'text-green-600 bg-green-100 hover:bg-green-200'
                    : 'text-gray-400 bg-gray-100 hover:bg-gray-200'
                }`}
                title={`${subcategory.visibleInSupplierApp ? 'Hide from' : 'Show in'} Supplier App`}
              >
                {subcategory.visibleInSupplierApp ? (
                  <EyeIcon className="h-3 w-3" />
                ) : (
                  <EyeSlashIcon className="h-3 w-3" />
                )}
              </button>
              
              <button
                onClick={() => onToggleVisibility(subcategory.id, 'customer')}
                className={`p-1.5 rounded-full transition-colors ${
                  subcategory.visibleInCustomerApp
                    ? 'text-blue-600 bg-blue-100 hover:bg-blue-200'
                    : 'text-gray-400 bg-gray-100 hover:bg-gray-200'
                }`}
                title={`${subcategory.visibleInCustomerApp ? 'Hide from' : 'Show in'} Customer App`}
              >
                {subcategory.visibleInCustomerApp ? (
                  <EyeIcon className="h-3 w-3" />
                ) : (
                  <EyeSlashIcon className="h-3 w-3" />
                )}
              </button>
            </div>

            {/* Delete Button */}
            <Button
              variant="outline"
              size="sm"
              icon={<TrashIcon className="h-3 w-3" />}
              onClick={handleDelete}
              className="text-red-600 border-red-300 hover:bg-red-50 px-2 py-1"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Products */}
      {isExpanded && (
        <div className="p-4">
          {products.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <div className="text-sm">No products in this subcategory</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={onProductClick}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(SubcategoryManagementCard);

/**
 * Product Card Component
 *
 * Displays a product within the category hierarchy
 */

import React, { memo } from 'react';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency } from '../../utils/formatters';
import { CubeIcon } from '@heroicons/react/24/outline';
import type { Product } from '../../features/categories/types';

interface ProductCardProps {
  product: Product;
  onClick: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const handleClick = () => {
    onClick(product.id);
  };

  return (
    <div
      onClick={handleClick}
      className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer bg-white"
    >
      {/* Product Image */}
      <div className="aspect-square bg-gray-100 rounded-md mb-3 flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <CubeIcon className="h-8 w-8 text-gray-400" />
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <div>
          <h5 className="font-medium text-gray-900 text-sm truncate" title={product.name}>
            {product.name}
          </h5>
          <p className="text-xs text-gray-500 truncate" title={product.sku}>
            SKU: {product.sku}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-900">
            {formatCurrency(product.price)}
          </div>
          <StatusBadge status={product.status} />
        </div>

        <div className="text-xs text-gray-500">
          Stock: {product.stock}
        </div>
      </div>
    </div>
  );
};

export default memo(ProductCard);

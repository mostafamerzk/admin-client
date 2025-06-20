/**
 * Product Edit Form Component
 * 
 * A comprehensive form for editing product details including images, attributes, and variants.
 */

import React from 'react';
import FormField from './FormField';
import MultipleImageUpload from './MultipleImageUpload';
import DynamicArrayField from './DynamicArrayField';
import Card from './Card';
import { TagIcon, ClipboardDocumentListIcon, PhotoIcon } from '@heroicons/react/24/outline';
import type { ProductAttribute, ProductVariant, ProductFormDataWithImages } from '../../features/products/types';

interface ProductEditFormProps {
  formData: Partial<ProductFormDataWithImages>;
  errors: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onImagesChange: (images: (File | string)[]) => void;
  onAttributesChange: (attributes: ProductAttribute[]) => void;
  onVariantsChange: (variants: ProductVariant[]) => void;
  createEmptyAttribute: () => ProductAttribute;
  createEmptyVariant: () => ProductVariant;
  attributeFieldConfigs: any[];
  variantFieldConfigs: any[];
  disabled?: boolean;
}

const ProductEditForm: React.FC<ProductEditFormProps> = ({
  formData,
  errors,
  onInputChange,
  onImagesChange,
  onAttributesChange,
  onVariantsChange,
  createEmptyAttribute,
  createEmptyVariant,
  attributeFieldConfigs,
  variantFieldConfigs,
  disabled = false
}) => {
  const categoryOptions = [
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Accessories', label: 'Accessories' },
    { value: 'Clothing', label: 'Clothing' },
    { value: 'Home & Garden', label: 'Home & Garden' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Books', label: 'Books' },
    { value: 'Other', label: 'Other' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'out_of_stock', label: 'Out of Stock' }
  ];

  return (
    <div className="space-y-6">
      {/* Basic Product Information */}
      <Card>
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Product Name"
              name="name"
              type="text"
              value={formData.name || ''}
              onChange={onInputChange}
              error={errors.name}
              required
              disabled={disabled}
              placeholder="Enter product name"
            />

            <FormField
              label="SKU"
              name="sku"
              type="text"
              value={formData.sku || ''}
              onChange={onInputChange}
              error={errors.sku}
              required
              disabled={disabled}
              placeholder="e.g., WBH-PRO-001"
            />

            <FormField
              label="Category"
              name="category"
              type="select"
              value={formData.category || ''}
              onChange={onInputChange}
              error={errors.category}
              required
              disabled={disabled}
              options={categoryOptions}
            />

            <FormField
              label="Status"
              name="status"
              type="select"
              value={formData.status || 'active'}
              onChange={onInputChange}
              error={errors.status}
              required
              disabled={disabled}
              options={statusOptions}
            />

            <FormField
              label="Price"
              name="price"
              type="number"
              value={formData.price || 0}
              onChange={onInputChange}
              error={errors.price}
              required
              disabled={disabled}
              placeholder="0.00"
            />

            <FormField
              label="Stock Quantity"
              name="stock"
              type="number"
              value={formData.stock || 0}
              onChange={onInputChange}
              error={errors.stock}
              required
              disabled={disabled}
              placeholder="0"
            />

            <FormField
              label="Minimum Stock Level"
              name="minimumStock"
              type="number"
              value={formData.minimumStock || 0}
              onChange={onInputChange}
              error={errors.minimumStock}
              required
              disabled={disabled}
              placeholder="0"
            />
          </div>

          <FormField
            label="Description"
            name="description"
            type="textarea"
            value={formData.description || ''}
            onChange={onInputChange}
            error={errors.description}
            disabled={disabled}
            placeholder="Enter product description..."
          />
        </div>
      </Card>

      {/* Product Images */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <PhotoIcon className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">Product Images</h3>
          </div>
          
          <MultipleImageUpload
            label="Product Images"
            name="images"
            value={formData.images || []}
            onChange={onImagesChange}
            error={errors.images}
            disabled={disabled}
            maxFiles={10}
            maxSize={5 * 1024 * 1024} // 5MB
            allowedTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp']}
          />
        </div>
      </Card>

      {/* Product Attributes */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <TagIcon className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">Product Attributes</h3>
          </div>
          
          <DynamicArrayField
            label="Attributes"
            value={formData.attributes || []}
            onChange={onAttributesChange}
            fieldConfigs={attributeFieldConfigs}
            createEmpty={createEmptyAttribute}
            error={errors.attributes || undefined}
            disabled={disabled}
            maxItems={20}
            itemLabel={(item: ProductAttribute) => item.name || 'New Attribute'}
          />
        </div>
      </Card>

      {/* Product Variants */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <ClipboardDocumentListIcon className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">Product Variants</h3>
          </div>
          
          <DynamicArrayField
            label="Variants"
            value={formData.variants || []}
            onChange={onVariantsChange}
            fieldConfigs={variantFieldConfigs}
            createEmpty={createEmptyVariant}
            error={errors.variants || undefined}
            disabled={disabled}
            maxItems={50}
            itemLabel={(item: ProductVariant) => item.name || 'New Variant'}
          />
        </div>
      </Card>
    </div>
  );
};

export default ProductEditForm;

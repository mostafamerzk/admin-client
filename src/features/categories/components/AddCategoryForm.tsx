/**
 * Add Category Form Component
 * 
 * This component provides a form for adding new categories.
 */

import React, { useState } from 'react';
import Button from '../../../components/common/Button';
import ImageUpload from '../../../components/common/ImageUpload';
import type { CategoryFormData } from '../types/index';
import { validateForm, validationRules } from '../../../utils/validation';

interface AddCategoryFormProps {
  onSubmit: (categoryData: CategoryFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Partial<CategoryFormData>;
}

const AddCategoryForm: React.FC<AddCategoryFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData
}) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    status: initialData?.status || 'active',
    image: null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateFormData = () => {
    const validationErrors = validateForm({
      name: formData.name,
      description: formData.description,
      status: formData.status
    }, {
      name: [
        validationRules.required('Category name is required'),
        validationRules.categoryName('Category name must be between 1 and 255 characters')
      ],
      description: [
        validationRules.required('Description is required'),
        validationRules.categoryDescription('Description must not exceed 1000 characters')
      ],
      status: [validationRules.categoryStatus('Status must be either active or inactive')]
    });

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleImageChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, image: file }));
    // Clear image error if exists
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateFormData()) {
      // Pass all category data including image in one object
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Category Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
              errors.name ? 'border-red-300' : ''
            }`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
              errors.description ? 'border-red-300' : ''
            }`}
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div>
          <ImageUpload
            label="Category Image"
            name="image"
            value={formData.image || null}
            onChange={handleImageChange}
            error={errors.image}
            maxSize={5 * 1024 * 1024} // 5MB
            allowedTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp']}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isLoading}
        >
          {initialData ? 'Update Category' : 'Add Category'}
        </Button>
      </div>
    </form>
  );
};

export default AddCategoryForm;

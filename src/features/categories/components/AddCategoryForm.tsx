/**
 * Add Category Form Component
 * 
 * This component provides a form for adding new categories.
 */

import React, { useState } from 'react';
import Button from '../../../components/common/Button.tsx';
import type { CategoryFormData } from '../types/index.ts';
import { validateForm, validationRules } from '../../../utils/validation.ts';

interface AddCategoryFormProps {
  onSubmit: (categoryData: CategoryFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const AddCategoryForm: React.FC<AddCategoryFormProps> = ({ 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    status: 'active',
    parentCategoryId: ''
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
      description: formData.description
    }, {
      name: [validationRules.required('Category name is required')],
      description: [validationRules.required('Description is required')]
    });

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateFormData()) {
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
          <label htmlFor="parentCategoryId" className="block text-sm font-medium text-gray-700">
            Parent Category
          </label>
          <select
            id="parentCategoryId"
            name="parentCategoryId"
            value={formData.parentCategoryId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            <option value="">None (Top Level Category)</option>
            <option value="1">Electronics</option>
            <option value="2">Office Supplies</option>
            <option value="3">Furniture</option>
          </select>
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
          Add Category
        </Button>
      </div>
    </form>
  );
};

export default AddCategoryForm;

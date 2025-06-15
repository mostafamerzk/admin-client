/**
 * Add Subcategory Form Component
 *
 * Form for adding a new subcategory to a category
 */

import React, { useState } from 'react';
import Button from '../common/Button';
import { validateForm, validationRules } from '../../utils/validation';
import type { SubcategoryFormData } from '../../features/categories/types';

interface AddSubcategoryFormProps {
  categoryId: string;
  onSubmit: (data: SubcategoryFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const AddSubcategoryForm: React.FC<AddSubcategoryFormProps> = ({
  categoryId,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<SubcategoryFormData>({
    name: '',
    description: '',
    status: 'active',
    categoryId,
    visibleInSupplierApp: true,
    visibleInCustomerApp: true
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
      name: [validationRules.required('Subcategory name is required')],
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
            Subcategory Name <span className="text-red-500">*</span>
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
            placeholder="Enter subcategory name"
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
            placeholder="Enter subcategory description"
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="visibleInSupplierApp"
                checked={formData.visibleInSupplierApp}
                onChange={(e) => setFormData(prev => ({ ...prev, visibleInSupplierApp: e.target.checked }))}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">Visible in Supplier App</span>
            </label>
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="visibleInCustomerApp"
                checked={formData.visibleInCustomerApp}
                onChange={(e) => setFormData(prev => ({ ...prev, visibleInCustomerApp: e.target.checked }))}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">Visible in Customer App</span>
            </label>
          </div>
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
          Add Subcategory
        </Button>
      </div>
    </form>
  );
};

export default AddSubcategoryForm;

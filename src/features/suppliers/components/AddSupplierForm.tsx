/**
 * Add Supplier Form Component
 * 
 * This component provides a form for adding new suppliers.
 */

import React, { useState } from 'react';
import Button from '../../../components/common/Button.tsx';
import type{ SupplierFormData } from '../types/index.ts';
import { validateForm, validationRules } from '../../../utils/validation.ts';

interface AddSupplierFormProps {
  onSubmit: (supplierData: SupplierFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const AddSupplierForm: React.FC<AddSupplierFormProps> = ({ 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState<SupplierFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    contactPerson: '',
    categories: [],
    logo: ''
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

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selectedCategories: string[] = [];
    
    for (let i = 0; i < options.length; i++) {
      if (options[i]?.selected) {
        selectedCategories.push(options[i]?.value || '');
      }
    }
    
    setFormData(prev => ({ ...prev, categories: selectedCategories }));
    
    // Clear error when field is edited
    if (errors.categories) {
      setErrors(prev => ({ ...prev, categories: '' }));
    }
  };

  const validateFormData = () => {
    const validationErrors = validateForm({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      contactPerson: formData.contactPerson,
      address: formData.address
    }, {
      name: [validationRules.required('Company name is required')],
      email: [validationRules.required('Email is required'), validationRules.email()],
      phone: [validationRules.required('Phone number is required'), validationRules.phone()],
      contactPerson: [validationRules.required('Contact person is required')],
      address: [validationRules.required('Address is required')]
    });

    if (formData.categories.length === 0) {
      const newValidationErrors = {
        ...validationErrors,
        categories: 'Please select at least one category'
      };
      setErrors(newValidationErrors);
      return Object.keys(newValidationErrors).length === 0;
    }

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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Company Name <span className="text-red-500">*</span>
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
          <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">
            Contact Person <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="contactPerson"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
              errors.contactPerson ? 'border-red-300' : ''
            }`}
          />
          {errors.contactPerson && <p className="mt-1 text-sm text-red-600">{errors.contactPerson}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
              errors.email ? 'border-red-300' : ''
            }`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
              errors.phone ? 'border-red-300' : ''
            }`}
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
              errors.address ? 'border-red-300' : ''
            }`}
          />
          {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="categories" className="block text-sm font-medium text-gray-700">
            Categories <span className="text-red-500">*</span>
          </label>
          <select
            id="categories"
            name="categories"
            multiple
            value={formData.categories}
            onChange={handleCategoryChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
              errors.categories ? 'border-red-300' : ''
            }`}
            size={4}
          >
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Office Supplies">Office Supplies</option>
            <option value="Food & Beverages">Food & Beverages</option>
            <option value="Clothing">Clothing</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Software">Software</option>
            <option value="Hardware">Hardware</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">Hold Ctrl (or Cmd) to select multiple categories</p>
          {errors.categories && <p className="mt-1 text-sm text-red-600">{errors.categories}</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
            Logo URL
          </label>
          <input
            type="text"
            id="logo"
            name="logo"
            value={formData.logo}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
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
          Add Supplier
        </Button>
      </div>
    </form>
  );
};

export default AddSupplierForm;




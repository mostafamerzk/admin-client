/**
 * Supplier Edit Form Component
 * 
 * This component provides a form for editing existing supplier information.
 */

import React, { useState, useEffect } from 'react';
import Button from '../../../components/common/Button';
import useNotification from '../../../hooks/useNotification';
import type { Supplier, SupplierFormData } from '../types/index';
import { validateForm, validationRules } from '../../../utils/validation';
import { XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface SupplierEditFormProps {
  supplier: Supplier;
  onSave?: (supplierData: SupplierFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

const SupplierEditForm: React.FC<SupplierEditFormProps> = ({ 
  supplier,
  onSave,
  onCancel,
  isLoading = false 
}) => {
  const { showSuccess, showError } = useNotification();
  const [isSaving, setIsSaving] = useState(false);
  
  // Initialize form data with supplier information
  const [formData, setFormData] = useState<SupplierFormData>({
    name: supplier.name || '',
    email: supplier.email || '',
    phone: supplier.phone || '',
    address: supplier.address || '',
    contactPerson: supplier.contactPerson || '',
    categories: supplier.categories || [],
    logo: supplier.logo || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Update form data when supplier prop changes
  useEffect(() => {
    setFormData({
      name: supplier.name || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || '',
      contactPerson: supplier.contactPerson || '',
      categories: supplier.categories || [],
      logo: supplier.logo || ''
    });
    setHasChanges(false);
  }, [supplier]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setHasChanges(true);
    
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
    setHasChanges(true);

    // Clear error when field is edited
    if (errors.categories) {
      setErrors(prev => ({ ...prev, categories: '' }));
    }
  };

  // Clear individual field
  const clearField = (fieldName: keyof SupplierFormData) => {
    if (fieldName === 'categories') {
      setFormData(prev => ({ ...prev, [fieldName]: [] }));
    } else {
      setFormData(prev => ({ ...prev, [fieldName]: '' }));
    }
    setHasChanges(true);

    // Clear error when field is cleared
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  // Reset form to original values
  const resetForm = () => {
    if (window.confirm('Are you sure you want to reset all fields to their original values? This will discard all unsaved changes.')) {
      setFormData({
        name: supplier.name || '',
        email: supplier.email || '',
        phone: supplier.phone || '',
        address: supplier.address || '',
        contactPerson: supplier.contactPerson || '',
        categories: supplier.categories || [],
        logo: supplier.logo || ''
      });
      setHasChanges(false);
      setErrors({});
    }
  };

  // Clear all form fields
  const clearAllFields = () => {
    if (window.confirm('Are you sure you want to clear all fields? This will remove all data from the form.')) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        contactPerson: '',
        categories: [],
        logo: ''
      });
      setHasChanges(true);
      setErrors({});
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateFormData()) {
      return;
    }

    if (!hasChanges) {
      showSuccess('No changes to save');
      return;
    }

    try {
      setIsSaving(true);
      
      if (onSave) {
        await onSave(formData);
        showSuccess('Supplier information updated successfully');
        setHasChanges(false);
      } else {
        // Mock save for development
        await new Promise(resolve => setTimeout(resolve, 1000));
        showSuccess('Supplier information updated successfully');
        setHasChanges(false);
      }
    } catch (error) {
      console.error('Error saving supplier:', error);
      showError('Failed to update supplier information');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        // Reset form to original values
        setFormData({
          name: supplier.name || '',
          email: supplier.email || '',
          phone: supplier.phone || '',
          address: supplier.address || '',
          contactPerson: supplier.contactPerson || '',
          categories: supplier.categories || [],
          logo: supplier.logo || ''
        });
        setHasChanges(false);
        setErrors({});
        if (onCancel) onCancel();
      }
    } else {
      if (onCancel) onCancel();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Edit Supplier Information</h3>
              <p className="mt-1 text-sm text-gray-500">
                Update the supplier's contact and business information below.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearAllFields}
                disabled={isLoading || isSaving}
                icon={<XMarkIcon className="h-4 w-4" />}
              >
                Clear All
              </Button>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Company Name <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading || isSaving}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm pr-10 ${
                    errors.name ? 'border-red-300' : ''
                  } ${isLoading || isSaving ? 'bg-gray-50' : ''}`}
                />
                {formData.name && !isLoading && !isSaving && (
                  <button
                    type="button"
                    onClick={() => clearField('name')}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    title="Clear field"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">
                Contact Person <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1">
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  disabled={isLoading || isSaving}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm pr-10 ${
                    errors.contactPerson ? 'border-red-300' : ''
                  } ${isLoading || isSaving ? 'bg-gray-50' : ''}`}
                />
                {formData.contactPerson && !isLoading && !isSaving && (
                  <button
                    type="button"
                    onClick={() => clearField('contactPerson')}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    title="Clear field"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
              {errors.contactPerson && <p className="mt-1 text-sm text-red-600">{errors.contactPerson}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading || isSaving}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm pr-10 ${
                    errors.email ? 'border-red-300' : ''
                  } ${isLoading || isSaving ? 'bg-gray-50' : ''}`}
                />
                {formData.email && !isLoading && !isSaving && (
                  <button
                    type="button"
                    onClick={() => clearField('email')}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    title="Clear field"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isLoading || isSaving}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm pr-10 ${
                    errors.phone ? 'border-red-300' : ''
                  } ${isLoading || isSaving ? 'bg-gray-50' : ''}`}
                />
                {formData.phone && !isLoading && !isSaving && (
                  <button
                    type="button"
                    onClick={() => clearField('phone')}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    title="Clear field"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Physical Address <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1">
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={isLoading || isSaving}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm pr-10 ${
                    errors.address ? 'border-red-300' : ''
                  } ${isLoading || isSaving ? 'bg-gray-50' : ''}`}
                />
                {formData.address && !isLoading && !isSaving && (
                  <button
                    type="button"
                    onClick={() => clearField('address')}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    title="Clear field"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between">
                <label htmlFor="categories" className="block text-sm font-medium text-gray-700">
                  Business Categories <span className="text-red-500">*</span>
                </label>
                {formData.categories.length > 0 && !isLoading && !isSaving && (
                  <button
                    type="button"
                    onClick={() => clearField('categories')}
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                    title="Clear all categories"
                  >
                    <XMarkIcon className="h-4 w-4 mr-1" />
                    Clear all
                  </button>
                )}
              </div>
              <select
                id="categories"
                name="categories"
                multiple
                value={formData.categories}
                onChange={handleCategoryChange}
                disabled={isLoading || isSaving}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                  errors.categories ? 'border-red-300' : ''
                } ${isLoading || isSaving ? 'bg-gray-50' : ''}`}
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
                <option value="Technology">Technology</option>
                <option value="Consumer Electronics">Consumer Electronics</option>
                <option value="Home Decor">Home Decor</option>
                <option value="Organic Products">Organic Products</option>
                <option value="Fashion">Fashion</option>
                <option value="Apparel">Apparel</option>
                <option value="Accessories">Accessories</option>
              </select>
              <div className="mt-1 flex items-center justify-between">
                <p className="text-xs text-gray-500">Hold Ctrl (or Cmd) to select multiple categories</p>
                {formData.categories.length > 0 && (
                  <p className="text-xs text-blue-600">{formData.categories.length} selected</p>
                )}
              </div>
              {errors.categories && <p className="mt-1 text-sm text-red-600">{errors.categories}</p>}
            </div>


          </div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {hasChanges && <span className="text-orange-600">• You have unsaved changes</span>}
              </div>
              {hasChanges && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={resetForm}
                  disabled={isLoading || isSaving}
                  icon={<ArrowPathIcon className="h-4 w-4" />}
                >
                  Reset
                </Button>
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading || isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isSaving}
                disabled={isLoading || !hasChanges}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierEditForm;

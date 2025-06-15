/**
 * Add Supplier Form Component
 *
 * This component provides a form for adding new suppliers.
 */

import React, { useState, useEffect } from 'react';
import Button from '../../../components/common/Button';
import FormField from '../../../components/common/FormField';
import ImageUpload from '../../../components/common/ImageUpload';
import type{ SupplierFormData } from '../types/index';
import { validateForm, validationRules } from '../../../utils/validation';
import type { Category } from '../../categories/types';

interface AddSupplierFormProps {
  onSubmit: (supplierData: SupplierFormData, setFieldError?: (field: string, message: string) => void) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const AddSupplierForm: React.FC<AddSupplierFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<SupplierFormData>({
    supplierName: '',
    email: '',
    phone: '',
    address: '',
    businessType: '',
    password: '',
    confirmPassword: '',
    image: null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories for business type dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        // For now, use mock data. In production, you would use the categories API
        const mockCategories: Category[] = [
          {
            id: '1',
            name: 'Retail',
            description: 'Retail business',
            productCount: 0,
            subcategoryCount: 0,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            visibleInSupplierApp: true,
            visibleInCustomerApp: true
          },
          {
            id: '2',
            name: 'Wholesale',
            description: 'Wholesale business',
            productCount: 0,
            subcategoryCount: 0,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            visibleInSupplierApp: true,
            visibleInCustomerApp: true
          },
          {
            id: '3',
            name: 'Manufacturing',
            description: 'Manufacturing business',
            productCount: 0,
            subcategoryCount: 0,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            visibleInSupplierApp: true,
            visibleInCustomerApp: true
          },
          {
            id: '4',
            name: 'Technology',
            description: 'Technology business',
            productCount: 0,
            subcategoryCount: 0,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            visibleInSupplierApp: true,
            visibleInCustomerApp: true
          },
          {
            id: '5',
            name: 'Healthcare',
            description: 'Healthcare business',
            productCount: 0,
            subcategoryCount: 0,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            visibleInSupplierApp: true,
            visibleInCustomerApp: true
          },
          {
            id: '6',
            name: 'Food & Beverage',
            description: 'Food & Beverage business',
            productCount: 0,
            subcategoryCount: 0,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            visibleInSupplierApp: true,
            visibleInCustomerApp: true
          },
          {
            id: '7',
            name: 'Automotive',
            description: 'Automotive business',
            productCount: 0,
            subcategoryCount: 0,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            visibleInSupplierApp: true,
            visibleInCustomerApp: true
          }
        ];
        setCategories(mockCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, image: file }));

    // Clear error when field is edited
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const validateFormData = () => {
    const formValidationRules = {
      supplierName: [validationRules.required('Supplier name is required')],
      email: [validationRules.required('Email is required'), validationRules.email()],
      phone: [validationRules.required('Phone number is required'), validationRules.phone()],
      address: [validationRules.required('Address is required')],
      businessType: [validationRules.required('Business type is required')],
      password: [validationRules.required('Password is required'), validationRules.password()],
      confirmPassword: [validationRules.required('Confirm password is required'), validationRules.passwordMatch()],
    };

    const validationErrors = validateForm(formData, formValidationRules);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const setFieldError = (field: string, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateFormData()) {
      onSubmit(formData, setFieldError);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
          label="Supplier Name"
          name="supplierName"
          value={formData.supplierName}
          onChange={handleChange}
          error={errors.supplierName}
          required
        />

        <FormField
          label="Business Type"
          name="businessType"
          type="select"
          value={formData.businessType}
          onChange={handleChange}
          error={errors.businessType}
          required
          loading={loadingCategories}
          options={[
            { value: '', label: 'Select a business type' },
            ...categories.map((category) => ({
              value: category.name,
              label: category.name
            }))
          ]}
        />

        <FormField
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        <FormField
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          required
        />

        <FormField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />

        <FormField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
        />

        <FormField
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          error={errors.address}
          required
          className="sm:col-span-2"
        />
      </div>

      {/* Image Upload Field */}
      <ImageUpload
        label="Supplier Image"
        name="image"
        value={formData.image || null}
        onChange={handleImageChange}
        error={errors.image}
        maxSize={5 * 1024 * 1024} // 5MB
        allowedTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp']}
      />

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




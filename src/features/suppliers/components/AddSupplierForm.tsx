/**
 * Add Supplier Form Component
 *
 * This component provides a form for adding new suppliers.
 */

import React, { useState } from 'react';
import Button from '../../../components/common/Button';
import FormField from '../../../components/common/FormField';
import ImageUpload from '../../../components/common/ImageUpload';
import type{ SupplierFormData } from '../types/index';
import { validateForm, validationRules } from '../../../utils/validation';

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
    contactPerson: '', // Required field for backend
    image: null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  // Static business type options - no need for API call for this simple dropdown
  const businessTypeOptions = [
    { value: '', label: 'Select a business type' },
    { value: 'Retail', label: 'Retail' },
    { value: 'Wholesale', label: 'Wholesale' },
    { value: 'Manufacturing', label: 'Manufacturing' },
    { value: 'Technology', label: 'Technology' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Food & Beverage', label: 'Food & Beverage' },
    { value: 'Automotive', label: 'Automotive' },
    { value: 'Other', label: 'Other' }
  ];

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
          options={businessTypeOptions}
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




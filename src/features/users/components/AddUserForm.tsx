/**
 * Add User Form Component
 *
 * This component provides a form for adding new users.
 */

import React, { useState, useEffect } from 'react';
import Button from '../../../components/common/Button';
import FormField from '../../../components/common/FormField';
import ImageUpload from '../../../components/common/ImageUpload';
import { validateForm, validationRules } from '../../../utils/validation';
import { getBusinessTypes } from '../api/businessTypesApi';
import type { UserFormData, BusinessType } from '../types';

interface AddUserFormProps {
  onSubmit: (userData: UserFormData & { confirmPassword: string; sendInvite: boolean }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'customer' as const,
    phone: '',
    address: '',
    businessType: '',
    password: '',
    confirmPassword: '',
    sendInvite: true,
    image: null as File | null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [loadingBusinessTypes, setLoadingBusinessTypes] = useState(false);

  // Load business types on component mount
  useEffect(() => {
    const loadBusinessTypes = async () => {
      setLoadingBusinessTypes(true);
      try {
        const types = await getBusinessTypes();
        setBusinessTypes(types);
      } catch (error) {
        console.error('Failed to load business types:', error);
        // You might want to show a notification here
      } finally {
        setLoadingBusinessTypes(false);
      }
    };

    loadBusinessTypes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, image: file }));

    // Clear error when image is changed
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const validateUserForm = () => {
    const formValidationRules = {
      name: [validationRules.required('Name is required')],
      email: [validationRules.required('Email is required'), validationRules.email()],
      type: [validationRules.required('User type is required')],
      password: [validationRules.required('Password is required'), validationRules.password()],
      confirmPassword: [validationRules.required('Confirm password is required'), validationRules.passwordMatch()],
      address: [validationRules.required('Address is required')],
      businessType: [validationRules.required('Business type is required')],
    };

    const newErrors = validateForm(formData, formValidationRules);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateUserForm()) {
      const submitData = {
        ...formData,
        // Include image field, even if null
        image: formData.image
      };
      onSubmit(submitData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />
        
        <FormField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
        
        <FormField
          label="User Type"
          name="type"
          type="select"
          value={formData.type}
          onChange={handleChange}
          error={errors.type}
          required
          options={[
            { value: 'customer', label: 'Customer' },
            { value: 'supplier', label: 'Supplier' }
          ]}
        />
        
        <FormField
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
        />

        <FormField
          label="Address"
          name="address"
          type="textarea"
          value={formData.address}
          onChange={handleChange}
          error={errors.address}
          required
          placeholder="Enter full address"
        />

        <FormField
          label="Business Type"
          name="businessType"
          type="select"
          value={formData.businessType}
          onChange={handleChange}
          error={errors.businessType}
          required
          loading={loadingBusinessTypes}
          options={[
            { value: '', label: 'Select Business Type' },
            ...businessTypes.map(type => ({
              value: type.id,
              label: type.name
            }))
          ]}
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
      </div>

      {/* Image Upload Field */}
      <ImageUpload
        label="Profile Picture"
        name="image"
        value={formData.image}
        onChange={handleImageChange}
        error={errors.image || undefined}
        maxSize={5 * 1024 * 1024} // 5MB
        allowedTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp']}
      />

      <div className="flex items-center">
        <FormField
          label="Send invitation email"
          name="sendInvite"
          type="checkbox"
          value={formData.sendInvite}
          onChange={handleChange}
          className="flex items-center space-x-2"
        />
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button
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
          Add User
        </Button>
      </div>
    </form>
  );
};

export default AddUserForm;








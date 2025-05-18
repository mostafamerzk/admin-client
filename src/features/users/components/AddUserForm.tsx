/**
 * Add User Form Component
 *
 * This component provides a form for adding new users.
 */

import React, { useState } from 'react';
import Button from '../../../components/common/Button';
import FormField from '../../../components/common/FormField';
import { validateForm, validationRules } from '../../../utils/validation';
import type { UserFormData } from '../types';

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
    password: '',
    confirmPassword: '',
    sendInvite: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const validateUserForm = () => {
    const formValidationRules = {
      name: [validationRules.required('Name is required')],
      email: [validationRules.required('Email is required'), validationRules.email()],
      type: [validationRules.required('User type is required')],
      password: [validationRules.required('Password is required'), validationRules.password()],
      confirmPassword: [validationRules.required('Confirm password is required'), validationRules.passwordMatch()],
    };
    
    const newErrors = validateForm(formData, formValidationRules);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateUserForm()) {
      onSubmit(formData);
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








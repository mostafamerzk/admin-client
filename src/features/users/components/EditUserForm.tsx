/**
 * Edit User Form Component
 *
 * This component provides a form for editing existing users.
 */

import React, { useState, useEffect } from 'react';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import { validateForm, validationRules } from '../../../utils/validation';
import type { User, UserFormDataFrontend } from '../types/index';

interface EditUserFormProps {
  user: User;
  onSubmit: (userData: UserFormDataFrontend) => Promise<void>;
  isLoading?: boolean;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ 
  user, 
  onSubmit, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState<UserFormDataFrontend>({
    name: '',
    email: '',
    type: 'customer',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        type: user.type,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      type: [validationRules.required('User type is required')]
    };
    
    const newErrors = validateForm(formData, formValidationRules);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateUserForm()) {
      try {
        await onSubmit(formData);
        // Success notification is handled in the parent component
      } catch (error) {
        // Error handling is done in the parent component
        console.error('Form submission error:', error);
      }
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                errors['name'] ? 'border-red-300' : ''
              }`}
            />
            {errors['name'] && <p className="mt-1 text-sm text-red-600">{errors['name']}</p>}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                errors['email'] ? 'border-red-300' : ''
              }`}
            />
            {errors['email'] && <p className="mt-1 text-sm text-red-600">{errors['email']}</p>}
          </div>
          
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              User Type <span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                errors['type'] ? 'border-red-300' : ''
              }`}
            >
              <option value="customer">Customer</option>
              <option value="supplier">Supplier</option>
            </select>
            {errors['type'] && <p className="mt-1 text-sm text-red-600">{errors['type']}</p>}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password || ''}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                errors['password'] ? 'border-red-300' : ''
              }`}
            />
            {errors['password'] && <p className="mt-1 text-sm text-red-600">{errors['password']}</p>}
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            type="button"
            onClick={() => window.history.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isLoading}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default EditUserForm;

/**
 * EntityForm Component
 *
 * A reusable form component for editing entities (users, suppliers, etc.)
 * Dynamically adapts its fields based on the entity type.
 */

import React, { useState, useEffect } from 'react';
import Button from './Button';
import type{ User } from '../../features/users/types/index';
import type{ Supplier } from '../../features/suppliers/types/index';
import useErrorHandler from '../../hooks/useErrorHandler';
import { handleValidationError } from '../../utils/errorHandling';

export type EntityType = 'user' | 'supplier';

interface EntityFormProps {
  entity: User | Supplier | null;
  entityType: EntityType;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const EntityForm: React.FC<EntityFormProps> = ({
  entity,
  entityType,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Error handling
  const {
    clearError
  } = useErrorHandler({
    enableNotifications: false, // We'll handle validation errors locally
    enableReporting: false
  });

  // Initialize form data when entity changes
  useEffect(() => {
    if (entity) {
      setFormData({ ...entity });
    }
  }, [entity]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev: any) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    clearError();

    try {
      // Common validations for all entity types
      if (!formData.name?.trim()) {
        const validationError = handleValidationError('name', 'Name is required', 'REQUIRED');
        newErrors.name = validationError.message;
      }

      if (!formData.email?.trim()) {
        const validationError = handleValidationError('email', 'Email is required', 'REQUIRED');
        newErrors.email = validationError.message;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        const validationError = handleValidationError('email', 'Email is invalid', 'INVALID_FORMAT');
        newErrors.email = validationError.message;
      }

      // Entity-specific validations
      if (entityType === 'user') {
        // User-specific validations
        if (formData.password && formData.password.length < 8) {
          const validationError = handleValidationError('password', 'Password must be at least 8 characters', 'MIN_LENGTH');
          newErrors.password = validationError.message;
        }
      } else if (entityType === 'supplier') {
        // Supplier-specific validations
        if (!formData.contactPerson?.trim()) {
          const validationError = handleValidationError('contactPerson', 'Contact person is required', 'REQUIRED');
          newErrors.contactPerson = validationError.message;
        }

        if (!formData.phone?.trim()) {
          const validationError = handleValidationError('phone', 'Phone number is required', 'REQUIRED');
          newErrors.phone = validationError.message;
        }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    } catch (error) {
      console.error('Form validation error:', error);
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // Render user-specific fields
  const renderUserFields = () => (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
              errors.name ? 'border-red-300' : ''
            }`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
              errors.email ? 'border-red-300' : ''
            }`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            name="status"
            value={formData.status || 'active'}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            <option value="active">Active</option>
            <option value="banned">Banned</option>
          </select>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password {!entity && <span className="text-red-500">*</span>}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password || ''}
            onChange={handleChange}
            placeholder={entity ? "Leave blank to keep current password" : ""}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
              errors.password ? 'border-red-300' : ''
            }`}
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>
      </div>
    </>
  );

  // Render supplier-specific fields
  const renderSupplierFields = () => (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || ''}
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
            value={formData.contactPerson || ''}
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
            value={formData.email || ''}
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
            value={formData.phone || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
              errors.phone ? 'border-red-300' : ''
            }`}
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            name="status"
            value={formData.status || 'active'}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>
      </div>
    </>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {entityType === 'user' ? renderUserFields() : renderSupplierFields()}

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
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default EntityForm;

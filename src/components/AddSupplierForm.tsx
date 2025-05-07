import React, { useState } from 'react';
import Button from './Button.tsx';

interface AddSupplierFormProps {
  onSubmit: (supplierData: SupplierFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface SupplierFormData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  taxId?: string;
  notes?: string;
  sendInvite: boolean;
}

const AddSupplierForm: React.FC<AddSupplierFormProps> = ({ onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState<SupplierFormData>({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    taxId: '',
    notes: '',
    sendInvite: true
  });

  const [errors, setErrors] = useState<Partial<Record<keyof SupplierFormData, string>>>({});
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error when field is edited
    if (errors[name as keyof SupplierFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Partial<Record<keyof SupplierFormData, string>> = {};
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      handleNextStep();
    } else {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {currentStep === 1 ? (
        <>
          <div className="mb-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full">
                1
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                <p className="text-sm text-gray-500">Enter the supplier's company and contact details</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                  errors.companyName ? 'border-red-300' : ''
                }`}
              />
              {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>}
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

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="taxId" className="block text-sm font-medium text-gray-700">
                Tax ID / VAT Number
              </label>
              <input
                type="text"
                id="taxId"
                name="taxId"
                value={formData.taxId}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="mb-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full">
                2
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Address & Additional Information</h3>
                <p className="text-sm text-gray-500">Enter the supplier's address and any additional details</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Street Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State / Province
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                ZIP / Postal Code
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              >
                <option value="">Select a country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="AU">Australia</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                {/* Add more countries as needed */}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="Any additional information about this supplier..."
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="sendInvite"
              name="sendInvite"
              type="checkbox"
              checked={formData.sendInvite}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="sendInvite" className="ml-2 block text-sm text-gray-700">
              Send invitation email to supplier
            </label>
          </div>
        </>
      )}

      <div className="flex justify-end space-x-3">
        {currentStep === 1 ? (
          <>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleNextStep}
            >
              Next Step
            </Button>
          </>
        ) : (
          <>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handlePrevStep}
            >
              Back
            </Button>
            <Button 
              type="submit" 
              loading={isLoading}
            >
              Add Supplier
            </Button>
          </>
        )}
      </div>
    </form>
  );
};

export default AddSupplierForm;

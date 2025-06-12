import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  error?: string | undefined;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder = '',
  options = [],
  className = '',
  disabled = false,
  loading = false
}) => {
  const inputClasses = `mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
    error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary focus:ring-primary'
  }`;
  
  const renderField = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={inputClasses}
            placeholder={placeholder}
            disabled={disabled}
          />
        );
      
      case 'select':
        return (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={inputClasses}
            disabled={disabled || loading}
          >
            {loading ? (
              <option value="">Loading...</option>
            ) : (
              options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))
            )}
          </select>
        );
      
      case 'checkbox':
        return (
          <input
            type="checkbox"
            id={name}
            name={name}
            checked={value}
            onChange={onChange}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            disabled={disabled}
          />
        );
      
      default:
        return (
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={inputClasses}
            placeholder={placeholder}
            disabled={disabled}
          />
        );
    }
  };
  
  return (
    <div className={`${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {renderField()}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormField;

/**
 * Validation Utilities
 * 
 * This file provides a comprehensive form validation utility with both function-based
 * and rule-based validation approaches.
 */

// Type definitions
export type ValidationRule = {
  validator: (value: any, formData?: any) => boolean;
  message: string;
};

export type ValidationRules = Record<string, ValidationRule | ValidationRule[]>;

// Individual validation functions
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phone);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

export const minLength = (value: string, min: number): boolean => {
  return value.length >= min;
};

export const maxLength = (value: string, max: number): boolean => {
  return value.length <= max;
};

export const isNumeric = (value: string): boolean => {
  return /^[0-9]+$/.test(value);
};

export const isDecimal = (value: string): boolean => {
  return /^[0-9]+(\.[0-9]+)?$/.test(value);
};

export const isAlphanumeric = (value: string): boolean => {
  return /^[a-zA-Z0-9]+$/.test(value);
};

export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

export const doPasswordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

export const isStrongPassword = (password: string): boolean => {
  // Password must be at least 8 characters long
  if (password.length < 8) return false;
  
  // Password must contain at least one uppercase letter
  if (!/[A-Z]/.test(password)) return false;
  
  // Password must contain at least one lowercase letter
  if (!/[a-z]/.test(password)) return false;
  
  // Password must contain at least one number
  if (!/[0-9]/.test(password)) return false;
  
  // Password must contain at least one special character
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) return false;
  
  return true;
};

// Field validation
export const validateField = (
  _name: string,
  value: any,
  rules: ValidationRule | ValidationRule[],
  formData?: any
): string => {
  const ruleArray = Array.isArray(rules) ? rules : [rules];
  
  for (const rule of ruleArray) {
    if (!rule.validator(value, formData)) {
      return rule.message;
    }
  }
  
  return '';
};

// Form validation
export const validateForm = <T extends Record<string, any>>(
  values: T,
  validationRules: ValidationRules
): Partial<Record<keyof T, string>> => {
  const errors: Partial<Record<keyof T, string>> = {};
  
  Object.entries(validationRules).forEach(([fieldName, rules]) => {
    const key = fieldName as keyof T;
    const error = validateField(fieldName, values[key], rules, values);
    if (error) {
      errors[key] = error;
    }
  });
  
  return errors;
};

// Common validation rules
export const validationRules = {
  required: (message: string = 'This field is required'): ValidationRule => ({
    validator: isRequired,
    message
  }),
  
  email: (message: string = 'Please enter a valid email address'): ValidationRule => ({
    validator: isValidEmail,
    message
  }),
  
  phone: (message: string = 'Please enter a valid phone number'): ValidationRule => ({
    validator: isValidPhone,
    message
  }),
  
  url: (message: string = 'Please enter a valid URL'): ValidationRule => ({
    validator: isValidUrl,
    message
  }),
  
  minLength: (min: number, message?: string): ValidationRule => ({
    validator: (value: string) => minLength(value, min),
    message: message || `Must be at least ${min} characters`
  }),
  
  maxLength: (max: number, message?: string): ValidationRule => ({
    validator: (value: string) => maxLength(value, max),
    message: message || `Must be no more than ${max} characters`
  }),
  
  numeric: (message: string = 'Please enter a numeric value'): ValidationRule => ({
    validator: isNumeric,
    message
  }),
  
  decimal: (message: string = 'Please enter a valid decimal number'): ValidationRule => ({
    validator: isDecimal,
    message
  }),
  
  alphanumeric: (message: string = 'Please use only letters and numbers'): ValidationRule => ({
    validator: isAlphanumeric,
    message
  }),
  
  date: (message: string = 'Please enter a valid date'): ValidationRule => ({
    validator: isValidDate,
    message
  }),
  
  password: (message: string = 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character'): ValidationRule => ({
    validator: isStrongPassword,
    message
  }),
  
  passwordMatch: (message: string = 'Passwords do not match'): ValidationRule => ({
    validator: (value: string, formData?: any) => doPasswordsMatch(value, formData?.confirmPassword),
    message
  }),
  
  confirmPasswordMatch: (message: string = 'Passwords do not match'): ValidationRule => ({
    validator: (value: string, formData?: any) => doPasswordsMatch(value, formData?.password),
    message
  }),

  // Product-specific validation rules
  sku: (message: string = 'Please enter a valid SKU'): ValidationRule => ({
    validator: (value: string) => /^[A-Z0-9-_]{3,20}$/i.test(value),
    message
  }),

  price: (message: string = 'Please enter a valid price'): ValidationRule => ({
    validator: (value: number) => value > 0 && value <= 999999,
    message
  }),

  stock: (message: string = 'Please enter a valid stock quantity'): ValidationRule => ({
    validator: (value: number) => Number.isInteger(value) && value >= 0,
    message
  }),

  minimumStock: (message: string = 'Please enter a valid minimum stock level'): ValidationRule => ({
    validator: (value: number) => Number.isInteger(value) && value >= 0,
    message
  }),

  stockConsistency: (message: string = 'Minimum stock cannot be greater than current stock'): ValidationRule => ({
    validator: (minimumStock: number, formData?: any) => {
      if (!formData || !formData.stock) return true;
      return minimumStock <= formData.stock;
    },
    message
  }),

  arrayNotEmpty: (message: string = 'At least one item is required'): ValidationRule => ({
    validator: (value: any[]) => Array.isArray(value) && value.length > 0,
    message
  }),

  imageArray: (maxFiles: number = 10, message?: string): ValidationRule => ({
    validator: (value: any[]) => {
      if (!Array.isArray(value)) return false;
      return value.length <= maxFiles;
    },
    message: message || `Maximum ${maxFiles} images allowed`
  }),

  // Category-specific validation rules to match backend Joi validation
  categoryName: (message?: string): ValidationRule => ({
    validator: (value: string) => {
      if (!value || typeof value !== 'string') return false;
      const trimmed = value.trim();
      return trimmed.length >= 1 && trimmed.length <= 255;
    },
    message: message || 'Category name must be between 1 and 255 characters'
  }),

  categoryDescription: (message?: string): ValidationRule => ({
    validator: (value: string) => {
      if (!value || typeof value !== 'string') return false;
      return value.trim().length <= 1000;
    },
    message: message || 'Description must not exceed 1000 characters'
  }),

  categoryStatus: (message?: string): ValidationRule => ({
    validator: (value: string) => {
      return value === 'active' || value === 'inactive';
    },
    message: message || 'Status must be either active or inactive'
  }),

  optionalImageUrl: (message?: string): ValidationRule => ({
    validator: (value: string | null | undefined) => {
      // Optional field - null/undefined is valid
      if (!value) return true;
      // If provided, must be a valid URL
      return isValidUrl(value);
    },
    message: message || 'Image URL must be a valid URL'
  })
};


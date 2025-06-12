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
  })
};


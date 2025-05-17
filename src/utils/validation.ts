/**
 * Validation Utilities
 * 
 * This file provides form validation utility functions.
 */

/**
 * Email validation
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Phone number validation
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phone);
};

/**
 * URL validation
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Required field validation
 */
export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

/**
 * Minimum length validation
 */
export const minLength = (value: string, min: number): boolean => {
  return value.length >= min;
};

/**
 * Maximum length validation
 */
export const maxLength = (value: string, max: number): boolean => {
  return value.length <= max;
};

/**
 * Numeric value validation
 */
export const isNumeric = (value: string): boolean => {
  return /^[0-9]+$/.test(value);
};

/**
 * Decimal value validation
 */
export const isDecimal = (value: string): boolean => {
  return /^[0-9]+(\.[0-9]+)?$/.test(value);
};

/**
 * Alphanumeric validation
 */
export const isAlphanumeric = (value: string): boolean => {
  return /^[a-zA-Z0-9]+$/.test(value);
};

/**
 * Date validation
 */
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

/**
 * Password match validation
 */
export const doPasswordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

/**
 * Validate form fields
 * 
 * @param values Form values object
 * @param validationRules Validation rules object
 * @returns Object with validation errors
 */
export const validateForm = <T extends Record<string, any>>(
  values: T,
  validationRules: Record<keyof T, Array<{
    validator: (value: any, allValues?: T) => boolean;
    message: string;
  }>>
): Partial<Record<keyof T, string>> => {
  const errors: Partial<Record<keyof T, string>> = {};

  Object.keys(validationRules).forEach((fieldName) => {
    const key = fieldName as keyof T;
    const value = values[key];
    const rules = validationRules[key];

    for (const rule of rules) {
      if (!rule.validator(value, values)) {
        errors[key] = rule.message;
        break;
      }
    }
  });

  return errors;
};

/**
 * Common validation rules
 */
export const validationRules = {
  required: (message: string = 'This field is required') => ({
    validator: isRequired,
    message
  }),
  
  email: (message: string = 'Please enter a valid email address') => ({
    validator: isValidEmail,
    message
  }),
  
  phone: (message: string = 'Please enter a valid phone number') => ({
    validator: isValidPhone,
    message
  }),
  
  url: (message: string = 'Please enter a valid URL') => ({
    validator: isValidUrl,
    message
  }),
  
  minLength: (min: number, message?: string) => ({
    validator: (value: string) => minLength(value, min),
    message: message || `Must be at least ${min} characters`
  }),
  
  maxLength: (max: number, message?: string) => ({
    validator: (value: string) => maxLength(value, max),
    message: message || `Must be no more than ${max} characters`
  }),
  
  numeric: (message: string = 'Please enter a numeric value') => ({
    validator: isNumeric,
    message
  }),
  
  decimal: (message: string = 'Please enter a valid decimal number') => ({
    validator: isDecimal,
    message
  }),
  
  alphanumeric: (message: string = 'Please use only letters and numbers') => ({
    validator: isAlphanumeric,
    message
  }),
  
  date: (message: string = 'Please enter a valid date') => ({
    validator: isValidDate,
    message
  }),
  
  passwordMatch: (message: string = 'Passwords do not match') => ({
    validator: (value: string, allValues?: any) => doPasswordsMatch(value, allValues?.confirmPassword),
    message
  }),
  
  confirmPasswordMatch: (message: string = 'Passwords do not match') => ({
    validator: (value: string, allValues?: any) => doPasswordsMatch(value, allValues?.password),
    message
  })
};

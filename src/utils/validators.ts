/**
 * Validators
 * 
 * This file contains utility functions for validating data.
 */

/**
 * Validate an email address
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate a password (at least 8 characters, with at least one number and one letter)
 */
export const isValidPassword = (password: string): boolean => {
  if (password.length < 8) return false;
  
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  return hasLetter && hasNumber;
};

/**
 * Validate a phone number
 */
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check if it's a valid length (10 digits for US, or 11 if it starts with 1)
  return (cleaned.length === 10) || (cleaned.length === 11 && cleaned.startsWith('1'));
};

/**
 * Validate a URL
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
 * Validate a credit card number using Luhn algorithm
 */
export const isValidCreditCard = (cardNumber: string): boolean => {
  // Remove all non-numeric characters
  const cleaned = cardNumber.replace(/\D/g, '');
  
  if (cleaned.length < 13 || cleaned.length > 19) return false;
  
  // Luhn algorithm
  let sum = 0;
  let shouldDouble = false;
  
  // Loop through values starting from the rightmost digit
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
};

/**
 * Validate a zip/postal code (US format)
 */
export const isValidZipCode = (zipCode: string): boolean => {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode);
};

/**
 * Validate that a string is not empty
 */
export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Validate that a number is within a range
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Validate that a value is a number
 */
export const isNumber = (value: any): boolean => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

/**
 * Validate that a date is in the future
 */
export const isFutureDate = (date: Date): boolean => {
  const now = new Date();
  return date > now;
};

/**
 * Validate that a date is in the past
 */
export const isPastDate = (date: Date): boolean => {
  const now = new Date();
  return date < now;
};

/**
 * Validate a tax ID (US format - EIN)
 */
export const isValidTaxId = (taxId: string): boolean => {
  const taxIdRegex = /^\d{2}-\d{7}$/;
  return taxIdRegex.test(taxId);
};

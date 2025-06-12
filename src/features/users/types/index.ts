/**
 * User Types
 * 
 * This file defines the TypeScript interfaces for the users feature.
 */

export interface User {
  id: string;
  name: string;
  email: string;
  type: 'customer' | 'supplier';
  status: 'active' | 'banned';
  lastLogin: string;
  avatar?: string;
  address?: string;
  businessType?: string;
  phone?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  type: 'customer' | 'supplier';
  password?: string;
  address?: string;
  businessType?: string;
  phone?: string;
  image?: File | null;
}

export interface BusinessType {
  id: string;
  name: string;
  description?: string;
}

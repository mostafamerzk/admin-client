/**
 * User Types
 *
 * This file defines the TypeScript interfaces for the users feature.
 */

// Pagination interface for API responses
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Standard API response wrapper
export interface ApiResponseWrapper<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: Pagination;
}

// User interface matching the API specification
export interface User {
  id: string;
  name: string;
  email: string;
  type: 'customer' | 'supplier';
  status: 'active' | 'banned';
  avatar?: string;
  phone?: string;
  address?: string;
  businessType?: string;
  verificationStatus?: 'verified' | 'pending' | 'rejected';
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Backend user response format (matching API spec)
export interface BackendUser {
  id: string;
  name: string;
  email: string;
  type: 'customer' | 'supplier';
  status: 'active' | 'banned';
  avatar?: string;
  phone?: string;
  address?: string;
  businessType?: string;
  verificationStatus?: 'verified' | 'pending' | 'rejected';
  lastLogin?: string;
}

// Form data for creating/updating users
export interface UserFormData {
  Name: string;  // Backend expects capital N
  Email: string; // Backend expects capital E
  password?: string;
  PhoneNumber?: string; // Backend expects PhoneNumber
  Address?: string; // Backend expects capital A
  BusinessType?: string; // Backend expects capital B
  verificationStatus?: 'verified' | 'pending' | 'rejected';
}

// Frontend form data (what the UI uses)
export interface UserFormDataFrontend {
  name: string;
  email: string;
  type: 'customer' | 'supplier';
  password?: string;
  phone?: string;
  address?: string;
  businessType?: string;
  verificationStatus?: 'verified' | 'pending' | 'rejected';
  image?: File | null;
}

// Query parameters for user search and filtering
export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'banned';
  sort?: 'Name' | 'Email' | 'createdAt' | 'updatedAt';
  order?: 'asc' | 'desc';
}

// Status update request
export interface UserStatusUpdate {
  status: 'active' | 'banned';
}

// Image upload response
export interface ImageUploadResponse {
  imageUrl: string;
}

export interface BusinessType {
  id: string;
  name: string;
  description?: string;
}

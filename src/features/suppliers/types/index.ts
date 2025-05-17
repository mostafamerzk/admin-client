/**
 * Supplier Types
 *
 * This file defines the TypeScript interfaces for the suppliers feature.
 */

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'pending' | 'rejected';
  verificationStatus: 'verified' | 'pending' | 'rejected';
  joinDate: string;
  categories: string[];
  contactPerson: string;
  logo?: string;
  website?: string;
}

export interface SupplierFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  categories: string[];
  contactPerson: string;
  logo?: string;
}

/**
 * Supplier Mappers
 * 
 * Utility functions to map between different supplier data formats
 */

import type{ Supplier } from '../types/index';
import { suppliers as mockSuppliers } from '../../../mockData/entities/suppliers';

/**
 * Maps a mock supplier to the application supplier format
 */
export const mapMockSupplierToSupplier = (mockSupplier: any): Supplier => {
  return {
    id: mockSupplier.id,
    name: mockSupplier.companyName,
    contactPerson: mockSupplier.contactPerson,
    email: mockSupplier.email,
    phone: mockSupplier.phone,
    status: 'active', // Default to active since mock data doesn't have this field
    verificationStatus: mockSupplier.status,
    joinDate: mockSupplier.verificationDate ? new Date(mockSupplier.verificationDate).toISOString().split('T')[0]! : new Date().toISOString().split('T')[0]!,
    address: [
      mockSupplier.address,
      mockSupplier.city,
      mockSupplier.state,
      mockSupplier.zipCode,
      mockSupplier.country
    ].filter(Boolean).join(', '),
    categories: mockSupplier.categories || ['General'],
    logo: mockSupplier.logo || '',
    website: mockSupplier.website
  };
};

/**
 * Get all suppliers from mock data
 */
export const getMockSuppliers = (): Supplier[] => {
  return mockSuppliers.map(mapMockSupplierToSupplier);
};

/**
 * Get a supplier by ID from mock data
 */
export const getMockSupplierById = (id: string): Supplier | undefined => {
  const mockSupplier = mockSuppliers.find(s => s.id === id);
  if (!mockSupplier) return undefined;
  return mapMockSupplierToSupplier(mockSupplier);
};

export default {
  mapMockSupplierToSupplier,
  getMockSuppliers,
  getMockSupplierById
};

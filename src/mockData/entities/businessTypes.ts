/**
 * Mock Business Types Data
 * 
 * This file contains mock data for business types in the ConnectChain admin panel.
 */

export interface BusinessType {
  id: string;
  name: string;
  description?: string;
}

export const businessTypes: BusinessType[] = [
  {
    id: '1',
    name: 'Retail',
    description: 'Businesses that sell products directly to consumers'
  },
  {
    id: '2',
    name: 'Wholesale',
    description: 'Businesses that sell products in bulk to other businesses'
  },
  {
    id: '3',
    name: 'Manufacturing',
    description: 'Businesses that produce goods from raw materials'
  },
  {
    id: '4',
    name: 'Technology',
    description: 'Businesses focused on technology products and services'
  },
  {
    id: '5',
    name: 'Healthcare',
    description: 'Businesses providing medical and health-related services'
  },
  {
    id: '6',
    name: 'Food & Beverage',
    description: 'Businesses in the food and beverage industry'
  },
  {
    id: '7',
    name: 'Automotive',
    description: 'Businesses related to vehicles and automotive services'
  },
  {
    id: '8',
    name: 'Construction',
    description: 'Businesses involved in building and construction'
  },
  {
    id: '9',
    name: 'Education',
    description: 'Educational institutions and training services'
  },
  {
    id: '10',
    name: 'Financial Services',
    description: 'Banks, insurance companies, and financial institutions'
  },
  {
    id: '11',
    name: 'Real Estate',
    description: 'Property development, sales, and management'
  },
  {
    id: '12',
    name: 'Transportation',
    description: 'Logistics, shipping, and transportation services'
  },
  {
    id: '13',
    name: 'Entertainment',
    description: 'Media, entertainment, and recreational services'
  },
  {
    id: '14',
    name: 'Agriculture',
    description: 'Farming, livestock, and agricultural products'
  },
  {
    id: '15',
    name: 'Professional Services',
    description: 'Consulting, legal, accounting, and other professional services'
  }
];

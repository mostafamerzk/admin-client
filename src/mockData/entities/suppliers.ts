/**
 * Mock Suppliers Data
 * 
 * This file contains mock data for suppliers in the ConnectChain admin panel.
 */

export interface Supplier {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: 'active' | 'pending' | 'rejected' | 'banned';
  verificationStatus: 'verified' | 'pending' | 'rejected';
  verificationDate: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  taxId?: string;
  notes?: string;
  productCount: number;
  rating: number;
  logo?: string;
  categories?: string[];
  createdAt: string;
  updatedAt: string;
}

export const suppliers: Supplier[] = [
  {
    id: '1',
    companyName: 'Tech Supplies Inc',
    contactPerson: 'Mike Johnson',
    email: 'mike@techsupplies.com',
    phone: '+1 (234) 567-8900',
    status: 'active',
    verificationStatus: 'verified',
    verificationDate: '2024-01-10T09:30:00Z',
    website: 'https://techsupplies.com',
    address: '123 Tech Street, San Francisco, CA 94105, USA',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    country: 'USA',
    taxId: 'TX-12345',
    notes: 'Premium supplier with excellent service history.',
    productCount: 156,
    rating: 4.8,
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop&crop=center',
    categories: ['Electronics', 'Technology', 'Hardware'],
    createdAt: '2023-09-15T14:30:00Z',
    updatedAt: '2024-01-10T09:30:00Z'
  },
  {
    id: '2',
    companyName: 'Office Solutions Ltd',
    contactPerson: 'Sarah Williams',
    email: 'sarah@officesolutions.com',
    phone: '+1 (345) 678-9012',
    status: 'active',
    verificationStatus: 'verified',
    verificationDate: '2024-01-05T11:15:00Z',
    website: 'https://officesolutions.com',
    address: '456 Office Avenue, Chicago, IL 60601, USA',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    country: 'USA',
    taxId: 'TX-67890',
    notes: 'Specializes in office furniture and supplies.',
    productCount: 243,
    rating: 4.5,
    logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=150&h=150&fit=crop&crop=center',
    categories: ['Office Supplies', 'Furniture', 'Business Equipment'],
    createdAt: '2023-10-20T10:45:00Z',
    updatedAt: '2024-01-05T11:15:00Z'
  },
  {
    id: '3',
    companyName: 'Global Electronics',
    contactPerson: 'David Chen',
    email: 'david@globalelectronics.com',
    phone: '+1 (456) 789-0123',
    status: 'active',
    verificationStatus: 'pending',
    verificationDate: '',
    website: 'https://globalelectronics.com',
    address: '789 Circuit Road, Boston, MA 02108, USA',
    city: 'Boston',
    state: 'MA',
    zipCode: '02108',
    country: 'USA',
    taxId: 'TX-24680',
    notes: 'New supplier with competitive pricing on electronics.',
    productCount: 0,
    rating: 0,
    logo: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=150&h=150&fit=crop&crop=center',
    categories: ['Electronics', 'Consumer Electronics'],
    createdAt: '2024-01-12T16:20:00Z',
    updatedAt: '2024-01-12T16:20:00Z'
  },
  {
    id: '4',
    companyName: 'Furniture Depot',
    contactPerson: 'Lisa Rodriguez',
    email: 'lisa@furnituredepot.com',
    phone: '+1 (567) 890-1234',
    status: 'rejected',
    verificationStatus: 'rejected',
    verificationDate: '2024-01-08T14:45:00Z',
    website: 'https://furnituredepot.com',
    address: '101 Chair Street, Miami, FL 33101, USA',
    city: 'Miami',
    state: 'FL',
    zipCode: '33101',
    country: 'USA',
    taxId: 'TX-13579',
    notes: 'Rejected due to incomplete documentation.',
    productCount: 0,
    rating: 0,
    logo: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=150&h=150&fit=crop&crop=center',
    categories: ['Furniture', 'Home Decor'],
    createdAt: '2023-12-30T09:10:00Z',
    updatedAt: '2024-01-08T14:45:00Z'
  },
  {
    id: '5',
    companyName: 'Food Distributors Co',
    contactPerson: 'James Wilson',
    email: 'james@fooddistributors.com',
    phone: '+1 (678) 901-2345',
    status: 'active',
    verificationStatus: 'verified',
    verificationDate: '2023-12-15T10:30:00Z',
    website: 'https://fooddistributors.com',
    address: '202 Market Street, Seattle, WA 98101, USA',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98101',
    country: 'USA',
    taxId: 'TX-97531',
    notes: 'Specializes in organic food products.',
    productCount: 189,
    rating: 4.7,
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&h=150&fit=crop&crop=center',
    categories: ['Food & Beverage', 'Organic Products'],
    createdAt: '2023-11-10T13:25:00Z',
    updatedAt: '2023-12-15T10:30:00Z'
  },
  {
    id: '6',
    companyName: 'Fashion Trends Inc',
    contactPerson: 'Emma Thompson',
    email: 'emma@fashiontrends.com',
    phone: '+1 (789) 012-3456',
    status: 'active',
    verificationStatus: 'pending',
    verificationDate: '',
    website: 'https://fashiontrends.com',
    address: '303 Style Avenue, New York, NY 10001, USA',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
    taxId: 'TX-86420',
    notes: 'Awaiting verification of business license.',
    productCount: 0,
    rating: 0,
    logo: '', // No logo for this supplier to test fallback
    categories: ['Fashion', 'Apparel', 'Accessories'],
    createdAt: '2024-01-14T15:40:00Z',
    updatedAt: '2024-01-14T15:40:00Z'
  }
];

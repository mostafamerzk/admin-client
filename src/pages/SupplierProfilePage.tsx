/**
 * Supplier Profile Page
 *
 * This page displays comprehensive supplier information with multiple tabs/sections,
 * following the exact design pattern and styling used in UserEditPage and UserDetails.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import Tabs from '../components/common/Tabs';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import useNotification from '../hooks/useNotification';
import { TrashIcon } from '@heroicons/react/24/outline';
import SupplierPersonalInfo from '../features/suppliers/components/SupplierPersonalInfo';
import SupplierEditForm from '../features/suppliers/components/SupplierEditForm';
import SupplierDocuments from '../features/suppliers/components/SupplierDocuments';
import SupplierProducts from '../features/suppliers/components/SupplierProducts';
import SupplierAnalytics from '../features/suppliers/components/SupplierAnalytics';
import { getMockSupplierById } from '../features/suppliers/utils/supplierMappers';
import type {
  Supplier,
  SupplierFormData,
  SupplierProduct,
  SupplierDocument,
  SupplierAnalyticsData
} from '../features/suppliers/types';
import { ROUTES } from '../constants/routes';

const SupplierProfilePage: React.FC = () => {
  const { id: supplierId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotification();
  
  // State
  const [activeTab, setActiveTab] = useState<'personal' | 'edit' | 'documents' | 'products' | 'analytics'>('personal');
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [supplierProducts, setSupplierProducts] = useState<SupplierProduct[]>([]);
  const [supplierDocuments, setSupplierDocuments] = useState<SupplierDocument[]>([]);
  const [supplierAnalytics, setSupplierAnalytics] = useState<SupplierAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Hooks - commented out for now, using mock data
  // const { getSupplierById } = useSuppliers();

  // Mock data for development
  const mockSupplierProducts: SupplierProduct[] = [
    {
      id: '1',
      name: 'Wireless Bluetooth Headphones',
      sku: 'WBH-001',
      category: 'Electronics',
      price: 99.99,
      stock: 150,
      status: 'active',
      description: 'High-quality wireless headphones with noise cancellation',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-20T14:45:00Z'
    },
    {
      id: '2',
      name: 'Smart Watch Pro',
      sku: 'SWP-002',
      category: 'Electronics',
      price: 299.99,
      stock: 75,
      status: 'active',
      description: 'Advanced smartwatch with health monitoring features',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop',
      createdAt: '2024-01-10T09:15:00Z',
      updatedAt: '2024-01-18T16:20:00Z'
    },
    {
      id: '3',
      name: 'USB-C Cable',
      sku: 'USC-003',
      category: 'Accessories',
      price: 19.99,
      stock: 0,
      status: 'out_of_stock',
      description: 'High-speed USB-C charging cable',
      createdAt: '2024-01-05T11:00:00Z',
      updatedAt: '2024-01-22T13:30:00Z'
    }
  ];

  const mockSupplierDocuments: SupplierDocument[] = [
    {
      id: '1',
      name: 'Business License',
      type: 'business_license',
      fileName: 'business_license_2024.pdf',
      fileSize: 2048576,
      uploadDate: '2024-01-10T09:30:00Z',
      status: 'approved',
      url: '#',
      notes: 'Valid until December 2024'
    },
    {
      id: '2',
      name: 'Tax Certificate',
      type: 'tax_certificate',
      fileName: 'tax_cert_2024.pdf',
      fileSize: 1536000,
      uploadDate: '2024-01-12T14:15:00Z',
      status: 'approved',
      url: '#'
    },
    {
      id: '3',
      name: 'Insurance Policy',
      type: 'insurance',
      fileName: 'insurance_policy.pdf',
      fileSize: 3072000,
      uploadDate: '2024-01-15T11:45:00Z',
      status: 'pending',
      url: '#',
      notes: 'Awaiting verification'
    }
  ];

  const mockSupplierAnalytics: SupplierAnalyticsData = {
    totalOrders: 245,
    totalRevenue: 48750.50,
    productCount: 156,
    averageOrderValue: 198.98,
    revenueHistory: [
      { date: '2024-01', amount: 12500 },
      { date: '2024-02', amount: 15200 },
      { date: '2024-03', amount: 21050.50 }
    ],
    salesByProduct: [
      { productName: 'Wireless Headphones', amount: 15000, quantity: 150 },
      { productName: 'Smart Watch Pro', amount: 22500, quantity: 75 },
      { productName: 'USB-C Cable', amount: 1999, quantity: 100 }
    ],
    orderTrends: [
      { date: '2024-01', orders: 85 },
      { date: '2024-02', orders: 92 },
      { date: '2024-03', orders: 68 }
    ],
    topCategories: [
      { category: 'Electronics', revenue: 37500, percentage: 76.9 },
      { category: 'Accessories', revenue: 11250.50, percentage: 23.1 }
    ]
  };

  // Fetch supplier data
  const fetchSupplierData = useCallback(async () => {
    if (!supplierId) {
      setError('No supplier ID provided');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Use mock data for development
      const supplierData = getMockSupplierById(supplierId);
      if (!supplierData) {
        throw new Error('Supplier not found');
      }
      setSupplier(supplierData);

      // Set mock data for development
      setSupplierProducts(mockSupplierProducts);
      setSupplierDocuments(mockSupplierDocuments);
      setSupplierAnalytics(mockSupplierAnalytics);

    } catch (error) {
      console.error('Error fetching supplier data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch supplier data';
      setError(errorMessage);
      showError('Failed to load supplier data');
    } finally {
      setIsLoading(false);
    }
  }, [supplierId, showError]);

  useEffect(() => {
    fetchSupplierData();
  }, [fetchSupplierData]);

  // Handle supplier save
  const handleSupplierSave = async (supplierData: SupplierFormData) => {
    try {
      // In a real implementation, this would call an API to update the supplier
      console.log('Saving supplier data:', supplierData);

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update the local supplier state with new data
      setSupplier(prev => prev ? {
        ...prev,
        name: supplierData.name,
        email: supplierData.email,
        phone: supplierData.phone,
        address: supplierData.address,
        contactPerson: supplierData.contactPerson,
        categories: supplierData.categories,
        logo: supplierData.logo || ''
      } : null);

      // Optionally refresh all data
      // await fetchSupplierData();

    } catch (error) {
      console.error('Error saving supplier:', error);
      throw error; // Re-throw to let the form handle the error
    }
  };

  // Handle supplier deletion
  const handleDeleteSupplier = async () => {
    if (!supplier) return;

    try {
      setIsDeleting(true);

      // In a real implementation, this would call an API to delete the supplier
      console.log('Deleting supplier:', supplier.id);

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      showSuccess(`Supplier "${supplier.name}" has been deleted successfully`);
      setIsDeleteModalOpen(false);

      // Navigate back to suppliers list
      navigate(ROUTES.SUPPLIERS);

    } catch (error) {
      console.error('Error deleting supplier:', error);
      showError('Failed to delete supplier');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as 'personal' | 'edit' | 'documents' | 'products' | 'analytics');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state
  if (error || !supplier) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Supplier Profile"
          description="Supplier not found"
          breadcrumbs={[
            { label: 'Suppliers', path: ROUTES.SUPPLIERS },
            { label: 'Profile' }
          ]}
        />
        <div className="text-center py-12">
          <p className="text-gray-500">{error || 'Supplier not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Supplier: ${supplier.name}`}
        description="Comprehensive supplier profile and management"
        breadcrumbs={[
          { label: 'Suppliers', path: ROUTES.SUPPLIERS },
          { label: supplier.name }
        ]}
        actions={
          <Button
            variant="danger"
            size="sm"
            onClick={() => setIsDeleteModalOpen(true)}
            icon={<TrashIcon className="h-4 w-4" />}
            disabled={isLoading || isDeleting}
          >
            Delete Supplier
          </Button>
        }
      />
      
      <Tabs
        tabs={[
          { id: 'personal', label: 'Personal Information' },
          { id: 'edit', label: 'Edit Supplier' },
          { id: 'documents', label: 'Verification Documents' },
          { id: 'products', label: 'Products' },
          { id: 'analytics', label: 'Analytics' }
        ]}
        activeTab={activeTab}
        onChange={handleTabChange}
      />
      
      {activeTab === 'personal' && (
        <SupplierPersonalInfo supplier={supplier} />
      )}

      {activeTab === 'edit' && (
        <SupplierEditForm
          supplier={supplier}
          onSave={handleSupplierSave}
          onCancel={() => setActiveTab('personal')}
        />
      )}

      {activeTab === 'documents' && (
        <SupplierDocuments 
          documents={supplierDocuments}
          supplierId={supplier.id}
          onDocumentUpdate={fetchSupplierData}
        />
      )}
      
      {activeTab === 'products' && (
        <SupplierProducts 
          products={supplierProducts}
          supplierId={supplier.id}
          onProductUpdate={fetchSupplierData}
        />
      )}
      
      {activeTab === 'analytics' && supplierAnalytics && (
        <SupplierAnalytics
          supplierData={supplierAnalytics}
          supplierId={supplier.id}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Supplier"
        size="sm"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteSupplier}
              loading={isDeleting}
              icon={<TrashIcon className="h-4 w-4" />}
            >
              Delete Supplier
            </Button>
          </>
        }
      >
        <div className="text-sm text-gray-500">
          <p className="mb-3">
            Are you sure you want to delete <strong>"{supplier.name}"</strong>?
          </p>
          <p className="text-red-600 font-medium">
            This action cannot be undone and will permanently remove:
          </p>
          <ul className="mt-2 list-disc list-inside text-red-600">
            <li>All supplier information</li>
            <li>Associated products and documents</li>
            <li>Order history and analytics</li>
          </ul>
        </div>
      </Modal>
    </div>
  );
};

export default SupplierProfilePage;

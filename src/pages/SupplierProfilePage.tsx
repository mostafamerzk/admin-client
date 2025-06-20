/**
 * Supplier Profile Page
 *
 * This page displays comprehensive supplier information with multiple tabs/sections,
 * following the exact design pattern and styling used in UserEditPage and UserDetails.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import Tabs from '../components/common/Tabs';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import useNotification from '../hooks/useNotification';
import { TrashIcon, NoSymbolIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import SupplierPersonalInfo from '../features/suppliers/components/SupplierPersonalInfo';
import SupplierDocuments from '../features/suppliers/components/SupplierDocuments';
import SupplierProducts from '../features/suppliers/components/SupplierProducts';
import SupplierAnalytics from '../features/suppliers/components/SupplierAnalytics';
import { useSuppliers } from '../features/suppliers/hooks/useSuppliers';
import { suppliersApi } from '../features/suppliers/api/suppliersApi';
import type {
  Supplier,
  SupplierProduct,
  SupplierDocument,
  SupplierAnalyticsData
} from '../features/suppliers/types';
import { ROUTES } from '../constants/routes';



const SupplierProfilePage: React.FC = () => {
  const { id: supplierId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotification();

  // Use refs to store stable references to notification functions
  const showErrorRef = useRef(showError);
  const showSuccessRef = useRef(showSuccess);
  const isMountedRef = useRef(true);

  // Update refs when functions change
  useEffect(() => {
    showErrorRef.current = showError;
    showSuccessRef.current = showSuccess;
  }, [showError, showSuccess]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  // State
  const [activeTab, setActiveTab] = useState<'personal' | 'documents' | 'products' | 'analytics'>('personal');
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [supplierProducts, setSupplierProducts] = useState<SupplierProduct[]>([]);
  const [supplierDocuments, setSupplierDocuments] = useState<SupplierDocument[]>([]);
  const [supplierAnalytics, setSupplierAnalytics] = useState<SupplierAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [isBanning, setIsBanning] = useState(false);
  const [documentsAvailable, setDocumentsAvailable] = useState(true);
  const [analyticsAvailable, setAnalyticsAvailable] = useState(true);

  // Use the useSuppliers hook for API integration
  const {
    deleteSupplier,
    banSupplier,
    unbanSupplier
  } = useSuppliers();



  // Add a ref to track if data is currently being fetched
  const isFetchingRef = useRef(false);

  // Simplified data fetching without complex state management
  const fetchSupplierData = useCallback(async () => {
    if (!supplierId) {
      setError('No supplier ID provided');
      setIsLoading(false);
      return;
    }

    // Prevent duplicate requests
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      // Fetch supplier data directly from API
      const response = await suppliersApi.getSupplierById(supplierId);

      // Set supplier state
      setSupplier(response);

      // Fetch products
      try {
        const products = await suppliersApi.getSupplierProducts(supplierId);
        console.log('Fetched products:', products, 'Type:', typeof products, 'IsArray:', Array.isArray(products));
        setSupplierProducts(Array.isArray(products) ? products : []);
      } catch (productError) {
        console.warn('Products fetch failed:', productError);
        setSupplierProducts([]);
      }

      // Fetch optional data
      try {
        const [documents, analytics] = await Promise.all([
          suppliersApi.getSupplierDocuments(supplierId).catch(() => []),
          suppliersApi.getSupplierAnalytics(supplierId).catch(() => null)
        ]);

        setSupplierDocuments(documents || []);
        setDocumentsAvailable(documents && documents.length > 0);
        setSupplierAnalytics(analytics);
        setAnalyticsAvailable(analytics !== null);
      } catch (optionalError) {
        console.warn('Optional data fetch failed:', optionalError);
      }

    } catch (error) {
      console.error('Error fetching supplier data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch supplier data';
      setError(errorMessage);
      showErrorRef.current('Failed to load supplier data');
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [supplierId, showErrorRef]);

  // Effect to fetch data when supplierId changes
  useEffect(() => {
    fetchSupplierData();
  }, [fetchSupplierData]);

  // Effect to handle tab switching when endpoints become unavailable
  useEffect(() => {
    if (activeTab === 'documents' && !documentsAvailable) {
      setActiveTab('personal');
    } else if (activeTab === 'analytics' && !analyticsAvailable) {
      setActiveTab('personal');
    }
  }, [activeTab, documentsAvailable, analyticsAvailable]);



  // Handle supplier deletion
  const handleDeleteSupplier = async () => {
    if (!supplier) return;

    try {
      setIsDeleting(true);

      await deleteSupplier(supplier.id);

      showSuccessRef.current(`Supplier "${supplier.name}" has been deleted successfully`);
      setIsDeleteModalOpen(false);

      // Navigate back to suppliers list
      navigate(ROUTES.SUPPLIERS);

    } catch (error) {
      console.error('Error deleting supplier:', error);
      showErrorRef.current('Failed to delete supplier');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle supplier ban
  const handleBanSupplier = async () => {
    if (!supplier) return;

    try {
      setIsBanning(true);

      // Get the updated supplier data from the ban API
      const updatedSupplier = await banSupplier(supplier.id);

      // Preserve existing supplier data and only update the status-related fields
      // This prevents data loss when the API response is incomplete
      setSupplier(prevSupplier => ({
        ...prevSupplier!,
        // Only update status if it's a valid value, otherwise preserve existing
        status: (updatedSupplier.status === 'banned' || updatedSupplier.status === 'active')
          ? updatedSupplier.status
          : prevSupplier!.status,
        // Only update verificationStatus if it's a valid value, otherwise preserve existing
        verificationStatus: (updatedSupplier.verificationStatus === 'verified' || updatedSupplier.verificationStatus === 'pending')
          ? updatedSupplier.verificationStatus
          : prevSupplier!.verificationStatus,
        // Only update other fields if they have meaningful values from the API
        ...(updatedSupplier.name && updatedSupplier.name !== '' && { name: updatedSupplier.name }),
        ...(updatedSupplier.email && updatedSupplier.email !== '' && { email: updatedSupplier.email }),
        ...(updatedSupplier.phone && updatedSupplier.phone !== '' && { phone: updatedSupplier.phone }),
        ...(updatedSupplier.address && updatedSupplier.address !== '' && { address: updatedSupplier.address }),
        ...(updatedSupplier.contactPerson && updatedSupplier.contactPerson !== '' && { contactPerson: updatedSupplier.contactPerson }),
        ...(updatedSupplier.logo && updatedSupplier.logo !== '' && { logo: updatedSupplier.logo }),
        ...(updatedSupplier.categories && updatedSupplier.categories.length > 0 && { categories: updatedSupplier.categories })
      }));

      showSuccessRef.current(`Supplier "${supplier.name}" has been banned successfully`);
      setIsBanModalOpen(false);

    } catch (error) {
      console.error('Error banning supplier:', error);
      showErrorRef.current('Failed to ban supplier');
    } finally {
      setIsBanning(false);
    }
  };

  // Handle supplier unban
  const handleUnbanSupplier = async () => {
    if (!supplier) return;

    try {
      setIsBanning(true);

      // Get the updated supplier data from the unban API
      const updatedSupplier = await unbanSupplier(supplier.id);

      // Preserve existing supplier data and only update the status-related fields
      // This prevents data loss when the API response is incomplete
      setSupplier(prevSupplier => ({
        ...prevSupplier!,
        // Only update status if it's a valid value, otherwise preserve existing
        status: (updatedSupplier.status === 'banned' || updatedSupplier.status === 'active')
          ? updatedSupplier.status
          : prevSupplier!.status,
        // Only update verificationStatus if it's a valid value, otherwise preserve existing
        verificationStatus: (updatedSupplier.verificationStatus === 'verified' || updatedSupplier.verificationStatus === 'pending')
          ? updatedSupplier.verificationStatus
          : prevSupplier!.verificationStatus,
        // Only update other fields if they have meaningful values from the API
        ...(updatedSupplier.name && updatedSupplier.name !== '' && { name: updatedSupplier.name }),
        ...(updatedSupplier.email && updatedSupplier.email !== '' && { email: updatedSupplier.email }),
        ...(updatedSupplier.phone && updatedSupplier.phone !== '' && { phone: updatedSupplier.phone }),
        ...(updatedSupplier.address && updatedSupplier.address !== '' && { address: updatedSupplier.address }),
        ...(updatedSupplier.contactPerson && updatedSupplier.contactPerson !== '' && { contactPerson: updatedSupplier.contactPerson }),
        ...(updatedSupplier.logo && updatedSupplier.logo !== '' && { logo: updatedSupplier.logo }),
        ...(updatedSupplier.categories && updatedSupplier.categories.length > 0 && { categories: updatedSupplier.categories })
      }));

      showSuccessRef.current(`Supplier "${supplier.name}" has been unbanned successfully`);

    } catch (error) {
      console.error('Error unbanning supplier:', error);
      showErrorRef.current('Failed to unban supplier');
    } finally {
      setIsBanning(false);
    }
  };

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    const typedTabId = tabId as 'personal' | 'documents' | 'products' | 'analytics';

    // Prevent switching to disabled tabs
    if (typedTabId === 'documents' && !documentsAvailable) return;
    if (typedTabId === 'analytics' && !analyticsAvailable) return;

    setActiveTab(typedTabId);
  };

  // TEMPORARILY DISABLED: Loading state logic to debug the issue
  // if (isLoading || hookLoading) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       <LoadingSpinner size="lg" />
  //     </div>
  //   );
  // }



  // Error state - only show if there's an actual error, not just missing supplier data
  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Supplier Profile"
          description="Error loading supplier"
          breadcrumbs={[
            { label: 'Suppliers', path: ROUTES.SUPPLIERS },
            { label: 'Profile' }
          ]}
        />
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
          <button
            onClick={fetchSupplierData}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show page even if supplier is not loaded yet, with loading indicators
  const pageTitle = supplier ? `Supplier: ${supplier.name}` : `Supplier Profile${supplierId ? ` (${supplierId})` : ''}`;
  const pageDescription = supplier ? "Comprehensive supplier profile and management" : "Loading supplier information...";
  const breadcrumbLabel = supplier ? supplier.name : 'Loading...';

  return (
    <div className="space-y-6">
      <PageHeader
        title={pageTitle}
        description={pageDescription}
        breadcrumbs={[
          { label: 'Suppliers', path: ROUTES.SUPPLIERS },
          { label: breadcrumbLabel }
        ]}
        actions={supplier ? (
          <div className="flex gap-2">
            {supplier.status === 'banned' ? (
              <Button
                variant="success"
                size="sm"
                onClick={handleUnbanSupplier}
                icon={<CheckCircleIcon className="h-4 w-4" />}
                disabled={isLoading || isBanning || isDeleting}
                loading={isBanning}
              >
                Unban Supplier
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsBanModalOpen(true)}
                icon={<NoSymbolIcon className="h-4 w-4" />}
                disabled={isLoading || isBanning || isDeleting}
              >
                Ban Supplier
              </Button>
            )}
            <Button
              variant="danger"
              size="sm"
              onClick={() => setIsDeleteModalOpen(true)}
              icon={<TrashIcon className="h-4 w-4" />}
              disabled={isLoading || isDeleting || isBanning}
            >
              Delete Supplier
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <LoadingSpinner size="sm" />
            <span className="text-sm text-gray-500">Loading actions...</span>
          </div>
        )}
      />
      
      <Tabs
        tabs={[
          { id: 'personal', label: 'Personal Information' },
          {
            id: 'documents',
            label: documentsAvailable ? 'Verification Documents' : 'Documents (Coming Soon)',
            disabled: !documentsAvailable
          },
          { id: 'products', label: 'Products' },
          {
            id: 'analytics',
            label: analyticsAvailable ? 'Analytics' : 'Analytics (Coming Soon)',
            disabled: !analyticsAvailable
          }
        ]}
        activeTab={activeTab}
        onChange={handleTabChange}
      />
      
      {activeTab === 'personal' && (
        supplier ? (
          <SupplierPersonalInfo supplier={supplier} />
        ) : (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="flex items-center justify-center">
              <LoadingSpinner size="lg" />
              <span className="ml-3 text-gray-500">Loading supplier information...</span>
            </div>
          </div>
        )
      )}

      {activeTab === 'documents' && (
        documentsAvailable ? (
          supplier ? (
            <SupplierDocuments
              documents={supplierDocuments}
              supplierId={supplier.id}
            />
          ) : (
            <div className="bg-white rounded-lg shadow p-8">
              <div className="flex items-center justify-center">
                <LoadingSpinner size="lg" />
                <span className="ml-3 text-gray-500">Loading documents...</span>
              </div>
            </div>
          )
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Documents Coming Soon</h3>
            <p className="text-gray-500">The verification documents feature is currently under development and will be available soon.</p>
          </div>
        )
      )}

      {activeTab === 'products' && (
        supplier ? (
          <SupplierProducts
            products={Array.isArray(supplierProducts) ? supplierProducts : []}
            supplierId={supplier.id}
            onProductUpdate={fetchSupplierData}
          />
        ) : (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="flex items-center justify-center">
              <LoadingSpinner size="lg" />
              <span className="ml-3 text-gray-500">Loading products...</span>
            </div>
          </div>
        )
      )}

      {activeTab === 'analytics' && (
        analyticsAvailable && supplierAnalytics ? (
          supplier ? (
            <SupplierAnalytics
              supplierData={supplierAnalytics}
              supplierId={supplier.id}
            />
          ) : (
            <div className="bg-white rounded-lg shadow p-8">
              <div className="flex items-center justify-center">
                <LoadingSpinner size="lg" />
                <span className="ml-3 text-gray-500">Loading analytics...</span>
              </div>
            </div>
          )
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
            <p className="text-gray-500">The analytics dashboard is currently under development and will be available soon.</p>
          </div>
        )
      )}

      {/* Ban Confirmation Modal */}
      <Modal
        isOpen={isBanModalOpen}
        onClose={() => setIsBanModalOpen(false)}
        title="Ban Supplier"
        size="sm"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setIsBanModalOpen(false)}
              disabled={isBanning}
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={handleBanSupplier}
              loading={isBanning}
              icon={<NoSymbolIcon className="h-4 w-4" />}
            >
              Ban Supplier
            </Button>
          </>
        }
      >
        <div className="text-sm text-gray-500">
          <p className="mb-3">
            Are you sure you want to ban <strong>"{supplier?.name || 'this supplier'}"</strong>?
          </p>
          <p className="text-orange-600 font-medium">
            This action will:
          </p>
          <ul className="mt-2 list-disc list-inside text-orange-600">
            <li>Change the supplier's status to 'banned'</li>
            <li>Prevent them from receiving new orders</li>
            <li>Restrict their access to the platform</li>
            <li>Allow for potential future reactivation</li>
          </ul>
          <p className="mt-3 text-gray-600">
            Unlike deletion, this action can be reversed by changing the supplier's status back to 'active'.
          </p>
        </div>
      </Modal>

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
            Are you sure you want to delete <strong>"{supplier?.name || 'this supplier'}"</strong>?
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

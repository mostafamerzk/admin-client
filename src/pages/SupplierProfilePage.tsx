/**
 * Supplier Profile Page
 *
 * This page displays comprehensive supplier information with multiple tabs/sections,
 * following the exact design pattern and styling used in UserEditPage and UserDetails.
 */

import React, { useState, useEffect, useRef } from 'react';
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

  // Update refs when functions change
  useEffect(() => {
    showErrorRef.current = showError;
    showSuccessRef.current = showSuccess;
  }, [showError, showSuccess]);

  // Use ref to store supplierId to avoid recreating fetchSupplierData
  const supplierIdRef = useRef(supplierId);
  useEffect(() => {
    supplierIdRef.current = supplierId;
  }, [supplierId]);
  
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

  // Use the useSuppliers hook for API integration
  const {
    getSupplierById,
    getSupplierProducts,
    getSupplierDocuments,
    getSupplierAnalytics,
    deleteSupplier,
    banSupplier,
    unbanSupplier,
    isLoading: hookLoading
  } = useSuppliers();



  // Fetch supplier data - using useRef to prevent recreation
  const fetchSupplierData = useRef(async () => {
    const currentSupplierId = supplierIdRef.current;

    if (!currentSupplierId) {
      setError('No supplier ID provided');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch supplier data from API
      const supplierData = await getSupplierById(currentSupplierId);
      setSupplier(supplierData);

      // Fetch related data in parallel
      const [products, documents, analytics] = await Promise.all([
        getSupplierProducts(currentSupplierId),
        getSupplierDocuments(currentSupplierId),
        getSupplierAnalytics(currentSupplierId)
      ]);

      setSupplierProducts(products);
      setSupplierDocuments(documents);
      setSupplierAnalytics(analytics);

    } catch (error) {
      console.error('Error fetching supplier data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch supplier data';
      setError(errorMessage);
      showErrorRef.current('Failed to load supplier data');
    } finally {
      setIsLoading(false);
    }
  });

  // Effect to fetch data when supplierId changes
  useEffect(() => {
    fetchSupplierData.current();
  }, [supplierId]);



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

      await banSupplier(supplier.id);

      showSuccessRef.current(`Supplier "${supplier.name}" has been banned successfully`);
      setIsBanModalOpen(false);

      // Refresh supplier data to show updated status
      await fetchSupplierData.current();

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

      await unbanSupplier(supplier.id);

      showSuccessRef.current(`Supplier "${supplier.name}" has been unbanned successfully`);

      // Refresh supplier data to show updated status
      await fetchSupplierData.current();

    } catch (error) {
      console.error('Error unbanning supplier:', error);
      showErrorRef.current('Failed to unban supplier');
    } finally {
      setIsBanning(false);
    }
  };

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as 'personal' | 'documents' | 'products' | 'analytics');
  };

  // Loading state
  if (isLoading || hookLoading) {
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
        }
      />
      
      <Tabs
        tabs={[
          { id: 'personal', label: 'Personal Information' },
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


      {activeTab === 'documents' && (
        <SupplierDocuments
          documents={supplierDocuments}
          supplierId={supplier.id}
        />
      )}
      
      {activeTab === 'products' && (
        <SupplierProducts
          products={supplierProducts}
          supplierId={supplier.id}
          onProductUpdate={fetchSupplierData.current}
        />
      )}
      
      {activeTab === 'analytics' && supplierAnalytics && (
        <SupplierAnalytics
          supplierData={supplierAnalytics}
          supplierId={supplier.id}
        />
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
            Are you sure you want to ban <strong>"{supplier.name}"</strong>?
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

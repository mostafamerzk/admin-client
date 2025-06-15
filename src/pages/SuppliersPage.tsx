/**
 * Suppliers Page
 *
 * This page displays and manages suppliers in the system.
 */

import React, { useState, useMemo, useCallback } from 'react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { BuildingOffice2Icon } from '@heroicons/react/24/outline';
import SupplierList from '../features/suppliers/components/SupplierList';
import SupplierDetails from '../features/suppliers/components/SupplierDetails';
import AddSupplierForm from '../features/suppliers/components/AddSupplierForm';
import type { Supplier, SupplierFormData } from '../features/suppliers/types';
import { useSuppliers } from '../features/suppliers/hooks/useSuppliers';
import useErrorHandler from '../hooks/useErrorHandler';

const SuppliersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isSupplierDetailsModalOpen, setIsSupplierDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Use the useSuppliers hook for API integration
  const {
    suppliers,
    isLoading: suppliersLoading,
    createEntity: createSupplier,
    deleteEntity: deleteSupplier,
    updateVerificationStatus
  } = useSuppliers();

  // Error handling
  const {
    withFormErrorHandling,
    clearError
  } = useErrorHandler({
    enableNotifications: true,
    enableReporting: true
  });

  // Memoize filtered suppliers to prevent unnecessary recalculations
  const filteredSuppliers = useMemo(() => {
    if (activeTab === 'all') return suppliers;
    return suppliers.filter(supplier => supplier.verificationStatus === activeTab);
  }, [suppliers, activeTab]);

  const handleSupplierClick = (supplier: Supplier) => {
    handleViewSupplier(supplier);
  };

  const handleViewSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsSupplierDetailsModalOpen(true);
  };



  const handleDeleteSupplier = useCallback((supplier: Supplier) => {
    setSupplierToDelete(supplier);
    setIsDeleteModalOpen(true);
  }, []);

  const confirmDeleteSupplier = useCallback(async () => {
    if (!supplierToDelete) return;

    setIsDeleting(true);
    const result = await withFormErrorHandling(async () => {
      await deleteSupplier(supplierToDelete.id);
      return true;
    }, undefined, `Delete supplier ${supplierToDelete.name}`);

    setIsDeleting(false);
    if (result) {
      setIsDeleteModalOpen(false);
      setSupplierToDelete(null);
    } else {
      console.error('Failed to delete supplier');
    }
  }, [supplierToDelete, withFormErrorHandling, deleteSupplier]);

  const handleAddSupplier = useCallback(async (supplierData: SupplierFormData, setFieldError?: (field: string, message: string) => void) => {
    setIsLoading(true);
    clearError();

    const result = await withFormErrorHandling(async () => {
      const newSupplier = await createSupplier(supplierData, false); // Don't show notifications from hook
      setIsAddSupplierModalOpen(false);
      return newSupplier;
    }, setFieldError, 'Add Supplier');

    setIsLoading(false);

    if (result) {
      console.log('Supplier added successfully:', result);
    }
  }, [withFormErrorHandling, createSupplier, clearError]);

  const handleVerifySupplier = async (supplierId: string, newStatus: 'verified' | 'rejected') => {
    try {
      await updateVerificationStatus(supplierId, newStatus);
      setIsSupplierDetailsModalOpen(false);
    } catch (error) {
      console.error('Error updating verification status:', error);
      // Error notification is handled by the hook
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Suppliers</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your suppliers and verify applications</p>
        </div>
        <Button
          icon={<BuildingOffice2Icon className="h-5 w-5" />}
          onClick={() => setIsAddSupplierModalOpen(true)}
        >
          Add Supplier
        </Button>
      </div>

      <Card>
        <div className="flex flex-wrap gap-3 mb-6">
          <Button
            variant={activeTab === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('all')}
          >
            All Suppliers
          </Button>
          <Button
            variant={activeTab === 'pending' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('pending')}
          >
            Pending Verification
          </Button>
          <Button
            variant={activeTab === 'verified' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('verified')}
          >
            Verified
          </Button>
          <Button
            variant={activeTab === 'rejected' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('rejected')}
          >
            Rejected
          </Button>
        </div>

        {suppliersLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <SupplierList
            suppliers={filteredSuppliers}
            onSupplierClick={handleSupplierClick}
            onViewSupplier={handleViewSupplier}
            onDeleteSupplier={handleDeleteSupplier}
            title={`${activeTab ? activeTab.charAt(0).toUpperCase() + activeTab.slice(1) : 'All'} Suppliers (${filteredSuppliers.length})`}
          />
        )}
      </Card>

      {/* Add Supplier Modal */}
      <Modal
        isOpen={isAddSupplierModalOpen}
        onClose={() => setIsAddSupplierModalOpen(false)}
        title="Add New Supplier"
        size="lg"
      >
        <AddSupplierForm
          onSubmit={handleAddSupplier}
          onCancel={() => setIsAddSupplierModalOpen(false)}
          isLoading={isLoading}
        />
      </Modal>

      {/* Supplier Details Modal */}
      {selectedSupplier && (
        <Modal
          isOpen={isSupplierDetailsModalOpen}
          onClose={() => setIsSupplierDetailsModalOpen(false)}
          title="Supplier Details"
          size="lg"
          footer={
            <>
              <Button
                variant="outline"
                onClick={() => setIsSupplierDetailsModalOpen(false)}
              >
                Close
              </Button>
              {selectedSupplier.verificationStatus === 'pending' && (
                <>
                  <Button
                    variant="danger"
                    onClick={() => handleVerifySupplier(selectedSupplier.id, 'rejected')}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="success"
                    onClick={() => handleVerifySupplier(selectedSupplier.id, 'verified')}
                  >
                    Verify
                  </Button>
                </>
              )}
            </>
          }
        >
          <SupplierDetails supplier={selectedSupplier} />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {supplierToDelete && (
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
                onClick={confirmDeleteSupplier}
                loading={isDeleting}
              >
                Delete Supplier
              </Button>
            </>
          }
        >
          <div className="text-sm text-gray-500">
            Are you sure you want to delete "{supplierToDelete.name}"? This action cannot be undone.
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SuppliersPage;
/**
 * Suppliers Page
 *
 * This page displays and manages suppliers in the system.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import { BuildingOffice2Icon } from '@heroicons/react/24/outline';
import { ROUTES } from '../constants/routes';
import SupplierList from '../features/suppliers/components/SupplierList';
import SupplierDetails from '../features/suppliers/components/SupplierDetails';
import AddSupplierForm from '../features/suppliers/components/AddSupplierForm';
import type { Supplier, SupplierFormData } from '../features/suppliers/types';
import { getMockSuppliers } from '../features/suppliers/utils/supplierMappers';

const SuppliersPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
  const [isAddingSupplier, setIsAddingSupplier] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isSupplierDetailsModalOpen, setIsSupplierDetailsModalOpen] = useState(false);

  // In a real implementation, we would use the useSuppliers hook
  // const { suppliers, isLoading, createSupplier, deleteSupplier, updateVerificationStatus } = useSuppliers();

  // Use mock data from the centralized mock data file
  const [suppliers, setSuppliers] = useState<Supplier[]>(getMockSuppliers());

  const filteredSuppliers = suppliers.filter(supplier => {
    if (activeTab === 'all') return true;
    return supplier.verificationStatus === activeTab;
  });

  const handleSupplierClick = (supplier: Supplier) => {
    handleViewSupplier(supplier);
  };

  const handleViewSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsSupplierDetailsModalOpen(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    // Navigate to the supplier profile page
    navigate(ROUTES.getSupplierProfileRoute(supplier.id));
  };

  const handleDeleteSupplier = (supplier: Supplier) => {
    if (window.confirm(`Are you sure you want to delete ${supplier.name}?`)) {
      setSuppliers(suppliers.filter(s => s.id !== supplier.id));
    }
  };

  const handleAddSupplier = (supplierData: SupplierFormData) => {
    setIsAddingSupplier(true);

    // Simulate API call
    setTimeout(() => {
      // Create new supplier with form data
      const newSupplier: Supplier = {
        id: (suppliers.length + 1).toString(),
        name: supplierData.name,
        contactPerson: supplierData.contactPerson,
        email: supplierData.email,
        phone: supplierData.phone,
        status: 'active',
        verificationStatus: 'pending',
        joinDate: new Date().toISOString().split('T')[0]!,
        address: supplierData.address,
        categories: supplierData.categories,
        logo: supplierData.logo || '',
        website: '' // Add empty website field for consistency
      };

      // Add to suppliers array
      setSuppliers([...suppliers, newSupplier]);

      // Reset state
      setIsAddingSupplier(false);
      setIsAddSupplierModalOpen(false);
    }, 1500);
  };

  const handleVerifySupplier = (supplierId: string, newStatus: 'verified' | 'rejected') => {
    setSuppliers(suppliers.map(supplier => {
      if (supplier.id === supplierId) {
        return {
          ...supplier,
          verificationStatus: newStatus,
          joinDate: new Date().toISOString().split('T')[0]!
        };
      }
      return supplier;
    }));
    setIsSupplierDetailsModalOpen(false);
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

        <SupplierList
          suppliers={filteredSuppliers}
          onSupplierClick={handleSupplierClick}
          onViewSupplier={handleViewSupplier}
          onEditSupplier={handleEditSupplier}
          onDeleteSupplier={handleDeleteSupplier}
          title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Suppliers (${filteredSuppliers.length})`}
        />
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
          isLoading={isAddingSupplier}
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
    </div>
  );
};

export default SuppliersPage;
import React, { useState } from 'react';
import DataTable from '../components/DataTable.tsx';
import Button from '../components/Button.tsx';
import Card from '../components/Card.tsx';
import Modal from '../components/Modal.tsx';
import AddSupplierForm, { SupplierFormData } from '../components/AddSupplierForm.tsx';
import {
  BuildingOffice2Icon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

interface Supplier {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: 'pending' | 'verified' | 'rejected';
  verificationDate: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  taxId?: string;
  notes?: string;
}

const SuppliersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
  const [isAddingSupplier, setIsAddingSupplier] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isSupplierDetailsModalOpen, setIsSupplierDetailsModalOpen] = useState(false);

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: '1',
      companyName: 'Tech Supplies Inc',
      contactPerson: 'Mike Johnson',
      email: 'mike@techsupplies.com',
      phone: '+1 234-567-8900',
      status: 'verified',
      verificationDate: '2024-01-10',
      website: 'https://techsupplies.com',
      address: '123 Tech Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'US',
      taxId: 'TX-12345',
      notes: 'Premium supplier with excellent service history.'
    },
    {
      id: '2',
      companyName: 'Office Solutions',
      contactPerson: 'Sarah Williams',
      email: 'sarah@officesolutions.com',
      phone: '+1 234-567-8901',
      status: 'pending',
      verificationDate: '-',
      website: 'https://officesolutions.com',
      address: '456 Office Avenue',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'US'
    },
    {
      id: '3',
      companyName: 'Global Electronics',
      contactPerson: 'David Chen',
      email: 'david@globalelectronics.com',
      phone: '+1 234-567-8902',
      status: 'verified',
      verificationDate: '2023-12-15',
      website: 'https://globalelectronics.com',
      address: '789 Electronic Blvd',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'US'
    },
    {
      id: '4',
      companyName: 'Furniture Depot',
      contactPerson: 'Lisa Brown',
      email: 'lisa@furnituredepot.com',
      phone: '+1 234-567-8903',
      status: 'rejected',
      verificationDate: '2023-11-20',
      website: 'https://furnituredepot.com',
      address: '101 Furniture Lane',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30301',
      country: 'US',
      notes: 'Failed verification due to incomplete documentation.'
    },
  ]);

  const filteredSuppliers = suppliers.filter(supplier => {
    if (activeTab === 'all') return true;
    return supplier.status === activeTab;
  });

  const columns = [
    {
      key: 'companyName',
      label: 'Company',
      sortable: true,
      render: (value: string, supplier: Supplier) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center mr-3">
            <BuildingOffice2Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{supplier.companyName}</div>
            <div className="text-xs text-gray-500">ID: {supplier.id}</div>
          </div>
        </div>
      )
    },
    { key: 'contactPerson', label: 'Contact Person', sortable: true },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center">
          <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-2" />
          <span>{value}</span>
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center">
          <PhoneIcon className="w-4 h-4 text-gray-400 mr-2" />
          <span>{value}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => {
        let icon;
        switch(value) {
          case 'verified':
            icon = <CheckCircleIcon className="w-4 h-4 text-green-500 mr-1" />;
            break;
          case 'pending':
            icon = <ClockIcon className="w-4 h-4 text-yellow-500 mr-1" />;
            break;
          case 'rejected':
            icon = <XCircleIcon className="w-4 h-4 text-red-500 mr-1" />;
            break;
        }
        return (
          <div className="flex items-center">
            {icon}
            <span>{value.charAt(0).toUpperCase() + value.slice(1)}</span>
          </div>
        );
      }
    },
    { key: 'verificationDate', label: 'Verification Date', sortable: true },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, supplier: Supplier) => (
        <div className="flex items-center space-x-2">
          <button
            className="p-1 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              handleViewSupplier(supplier);
            }}
          >
            <EyeIcon className="w-5 h-5" />
          </button>
          <button
            className="p-1 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Edit supplier:', supplier);
            }}
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            className="p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteSupplier(supplier);
            }}
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      )
    }
  ];

  const handleSupplierClick = (supplier: Supplier) => {
    handleViewSupplier(supplier);
  };

  const handleViewSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsSupplierDetailsModalOpen(true);
  };

  const handleDeleteSupplier = (supplier: Supplier) => {
    if (window.confirm(`Are you sure you want to delete ${supplier.companyName}?`)) {
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
        companyName: supplierData.companyName,
        contactPerson: supplierData.contactPerson,
        email: supplierData.email,
        phone: supplierData.phone,
        status: 'pending',
        verificationDate: '-',
        website: supplierData.website,
        address: supplierData.address,
        city: supplierData.city,
        state: supplierData.state,
        zipCode: supplierData.zipCode,
        country: supplierData.country,
        taxId: supplierData.taxId,
        notes: supplierData.notes
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
          status: newStatus,
          verificationDate: new Date().toISOString().split('T')[0]
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

        <DataTable
          columns={columns}
          data={filteredSuppliers}
          onRowClick={handleSupplierClick}
          title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Suppliers (${filteredSuppliers.length})`}
          pagination={true}
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
              {selectedSupplier.status === 'pending' && (
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
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center">
                  <BuildingOffice2Icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{selectedSupplier.companyName}</h3>
                  <p className="text-sm text-gray-500">ID: {selectedSupplier.id}</p>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedSupplier.status === 'verified'
                        ? 'bg-green-100 text-green-800'
                        : selectedSupplier.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedSupplier.status.charAt(0).toUpperCase() + selectedSupplier.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              {selectedSupplier.website && (
                <a
                  href={selectedSupplier.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm"
                >
                  Visit Website
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h4>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-xs text-gray-500">Contact Person</dt>
                    <dd className="text-sm text-gray-900">{selectedSupplier.contactPerson}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500">Email</dt>
                    <dd className="text-sm text-gray-900">{selectedSupplier.email}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500">Phone</dt>
                    <dd className="text-sm text-gray-900">{selectedSupplier.phone}</dd>
                  </div>
                  {selectedSupplier.taxId && (
                    <div>
                      <dt className="text-xs text-gray-500">Tax ID</dt>
                      <dd className="text-sm text-gray-900">{selectedSupplier.taxId}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3">Address</h4>
                <address className="not-italic text-sm text-gray-900">
                  {selectedSupplier.address && <div>{selectedSupplier.address}</div>}
                  {selectedSupplier.city && selectedSupplier.state && (
                    <div>{selectedSupplier.city}, {selectedSupplier.state} {selectedSupplier.zipCode}</div>
                  )}
                  {selectedSupplier.country && <div>{selectedSupplier.country}</div>}
                </address>
              </div>
            </div>

            {selectedSupplier.notes && (
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Notes</h4>
                <p className="text-sm text-gray-600">{selectedSupplier.notes}</p>
              </div>
            )}

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Verification Status</h4>
              <div className="flex items-center space-x-2">
                {selectedSupplier.status === 'verified' ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                ) : selectedSupplier.status === 'pending' ? (
                  <ClockIcon className="w-5 h-5 text-yellow-500" />
                ) : (
                  <XCircleIcon className="w-5 h-5 text-red-500" />
                )}
                <span className="text-sm text-gray-700">
                  {selectedSupplier.status === 'verified'
                    ? `Verified on ${selectedSupplier.verificationDate}`
                    : selectedSupplier.status === 'pending'
                      ? 'Pending verification'
                      : `Rejected on ${selectedSupplier.verificationDate}`}
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SuppliersPage;
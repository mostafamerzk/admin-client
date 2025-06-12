/**
 * Supplier Edit Page
 *
 * This page allows editing of supplier details.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import EntityForm from '../components/common/EntityForm';
import PageHeader from '../components/layout/PageHeader';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Supplier } from '../features/suppliers/types/index';
import { ROUTES } from '../constants/routes';
import useNotification from '../hooks/useNotification';

const SupplierEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch supplier data
  useEffect(() => {
    const fetchSupplier = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // For now, we'll use mock data
        const mockSuppliers: Supplier[] = [
          {
            id: '1',
            name: 'Tech Supplies Inc',
            contactPerson: 'Mike Johnson',
            email: 'mike@techsupplies.com',
            phone: '+1 234-567-8900',
            status: 'active',
            verificationStatus: 'verified',
            joinDate: '2024-01-10',
            address: '123 Tech Street, San Francisco, CA 94105, US',
            categories: ['Electronics', 'Software'],
            logo: 'https://via.placeholder.com/150'
          },
          {
            id: '2',
            name: 'Office Solutions',
            contactPerson: 'Sarah Williams',
            email: 'sarah@officesolutions.com',
            phone: '+1 234-567-8901',
            status: 'active',
            verificationStatus: 'pending',
            joinDate: '-',
            address: '456 Office Avenue, Chicago, IL 60601, US',
            categories: ['Office Supplies', 'Furniture'],
            logo: ''
          },
        ];

        const foundSupplier = mockSuppliers.find(s => s.id === id);
        if (foundSupplier) {
          setSupplier(foundSupplier);
        } else {
          showNotification({
            type: 'error',
            title: 'Error',
            message: 'Supplier not found'
          });
          navigate(ROUTES.SUPPLIERS);
        }
      } catch (error) {
        console.error('Error fetching supplier:', error);
        showNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to fetch supplier details'
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchSupplier();
    }
  }, [id, navigate, showNotification]);

  const handleSubmit = async (supplierData: Supplier) => {
    setIsSaving(true);
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the supplier state
      setSupplier(supplierData);
      
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'Supplier updated successfully'
      });
      
      // Navigate back to suppliers page
      navigate(ROUTES.SUPPLIERS);
    } catch (error) {
      console.error('Error updating supplier:', error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update supplier'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.SUPPLIERS);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Supplier"
        description={`Edit details for ${supplier?.name || 'supplier'}`}
        actions={
          <button
            onClick={handleCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
            Back to Suppliers
          </button>
        }
      />

      <Card>
        <EntityForm
          entity={supplier}
          entityType="supplier"
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isSaving}
        />
      </Card>
    </div>
  );
};

export default SupplierEditPage;

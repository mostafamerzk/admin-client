/**
 * Suppliers Hook
 * 
 * This hook provides methods and state for working with suppliers.
 */

import { useState, useCallback, useEffect } from 'react';
import type{ Supplier, SupplierFormData } from '../types/index.ts';
import suppliersApi from '../api/suppliersApi.ts';
import useNotification from '../../../hooks/useNotification.ts';

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showNotification } = useNotification();

  // Fetch all suppliers
  const fetchSuppliers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await suppliersApi.getSuppliers();
      setSuppliers(data);
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch suppliers'
      });
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Create a new supplier
  const createSupplier = useCallback(async (supplierData: SupplierFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newSupplier = await suppliersApi.createSupplier(supplierData);
      setSuppliers(prevSuppliers => [...prevSuppliers, newSupplier]);
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'Supplier created successfully'
      });
      return newSupplier;
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to create supplier'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Update a supplier
  const updateSupplier = useCallback(async (id: string, supplierData: Partial<SupplierFormData>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedSupplier = await suppliersApi.updateSupplier(id, supplierData);
      setSuppliers(prevSuppliers => 
        prevSuppliers.map(supplier => supplier.id === id ? updatedSupplier : supplier)
      );
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'Supplier updated successfully'
      });
      return updatedSupplier;
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update supplier'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Delete a supplier
  const deleteSupplier = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await suppliersApi.deleteSupplier(id);
      setSuppliers(prevSuppliers => prevSuppliers.filter(supplier => supplier.id !== id));
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'Supplier deleted successfully'
      });
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete supplier'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Update supplier verification status
  const updateVerificationStatus = useCallback(async (id: string, status: 'verified' | 'pending' | 'rejected') => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedSupplier = await suppliersApi.updateVerificationStatus(id, status);
      setSuppliers(prevSuppliers => 
        prevSuppliers.map(supplier => supplier.id === id ? updatedSupplier : supplier)
      );
      showNotification({
        type: 'success',
        title: 'Success',
        message: `Supplier ${status === 'verified' ? 'verified' : status === 'rejected' ? 'rejected' : 'set to pending'} successfully`
      });
      return updatedSupplier;
    } catch (err) {
      setError(err as Error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: `Failed to update supplier verification status`
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Load suppliers on mount
  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  return {
    suppliers,
    isLoading,
    error,
    fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    updateVerificationStatus
  };
};

export default useSuppliers;

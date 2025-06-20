/**
 * Suppliers Hook
 *
 * This hook provides methods and state for working with suppliers.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type{ Supplier, SupplierFormData } from '../types/index';
import suppliersApi from '../api/suppliersApi';
import useNotification from '../../../hooks/useNotification';

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showNotification } = useNotification();

  // Use ref to avoid dependency issues with showNotification
  const showNotificationRef = useRef(showNotification);
  const hasInitialFetched = useRef(false);

  // Update ref when showNotification changes
  useEffect(() => {
    showNotificationRef.current = showNotification;
  });

  // Fetch all suppliers
  const fetchSuppliers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await suppliersApi.getSuppliers();
      setSuppliers(data);
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch suppliers'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new supplier
  const createSupplier = useCallback(async (supplierData: SupplierFormData, showNotifications: boolean = true) => {
    setIsLoading(true);
    setError(null);
    try {
      const newSupplier = await suppliersApi.createSupplier(supplierData);
      setSuppliers(prevSuppliers => [...prevSuppliers, newSupplier]);
      if (showNotifications) {
        showNotificationRef.current({
          type: 'success',
          title: 'Success',
          message: 'Supplier created successfully'
        });
      }
      return newSupplier;
    } catch (err) {
      setError(err as Error);
      // Don't show error notifications when showNotifications is false
      // Let the form error handler manage the error display
      if (showNotifications) {
        showNotificationRef.current({
          type: 'error',
          title: 'Error',
          message: 'Failed to create supplier'
        });
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update a supplier
  const updateSupplier = useCallback(async (id: string, supplierData: Partial<SupplierFormData>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedSupplier = await suppliersApi.updateSupplier(id, supplierData);
      setSuppliers(prevSuppliers =>
        prevSuppliers.map(supplier => supplier.id === id ? updatedSupplier : supplier)
      );
      showNotificationRef.current({
        type: 'success',
        title: 'Success',
        message: 'Supplier updated successfully'
      });
      return updatedSupplier;
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to update supplier'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete a supplier
  const deleteSupplier = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await suppliersApi.deleteSupplier(id);
      setSuppliers(prevSuppliers => prevSuppliers.filter(supplier => supplier.id !== id));
      // Note: Success notification is handled by the calling component for better UX
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete supplier'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get supplier by ID
  const getSupplierById = useCallback(async (id: string, setLoadingState: boolean = true) => {
    if (setLoadingState) {
      setIsLoading(true);
    }
    setError(null);
    try {
      const supplier = await suppliersApi.getSupplierById(id);
      return supplier;
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch supplier details'
      });
      throw err;
    } finally {
      if (setLoadingState) {
        setIsLoading(false);
      }
    }
  }, []);

  // Update supplier verification status (backend only supports verified/pending)
  const updateVerificationStatus = useCallback(async (id: string, status: 'verified' | 'pending') => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedSupplier = await suppliersApi.updateVerificationStatus(id, status);
      setSuppliers(prevSuppliers =>
        prevSuppliers.map(supplier => supplier.id === id ? updatedSupplier : supplier)
      );
      showNotificationRef.current({
        type: 'success',
        title: 'Success',
        message: `Supplier ${status === 'verified' ? 'verified' : 'set to pending'} successfully`
      });
      return updatedSupplier;
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: `Failed to update supplier verification status`
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load suppliers on mount
  useEffect(() => {
    if (!hasInitialFetched.current) {
      hasInitialFetched.current = true;
      fetchSuppliers();
    }
  }, []);



  // Get supplier documents (gracefully handles 404s for endpoints under development)
  const getSupplierDocuments = useCallback(async (supplierId: string) => {
    try {
      const documents = await suppliersApi.getSupplierDocuments(supplierId);
      return documents;
    } catch (err) {
      // Only show error notifications for non-404 errors
      const error = err as any;
      if (error.response?.status !== 404 && error.status !== 404) {
        setError(err as Error);
        showNotificationRef.current({
          type: 'error',
          title: 'Error',
          message: 'Failed to fetch supplier documents'
        });
      }
      // Return empty array for any error to prevent breaking the UI
      return [];
    }
  }, []);

  // Get supplier analytics (gracefully handles 404s for endpoints under development)
  const getSupplierAnalytics = useCallback(async (supplierId: string) => {
    try {
      const analytics = await suppliersApi.getSupplierAnalytics(supplierId);
      return analytics;
    } catch (err) {
      // Only show error notifications for non-404 errors
      const error = err as any;
      if (error.response?.status !== 404 && error.status !== 404) {
        setError(err as Error);
        showNotificationRef.current({
          type: 'error',
          title: 'Error',
          message: 'Failed to fetch supplier analytics'
        });
      }
      // Return null for any error to prevent breaking the UI
      return null;
    }
  }, []);

  // Upload supplier image
  const uploadSupplierImage = useCallback(async (supplierId: string, file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await suppliersApi.uploadSupplierImage(supplierId, file);
      showNotificationRef.current({
        type: 'success',
        title: 'Success',
        message: 'Supplier image uploaded successfully'
      });
      return result;
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to upload supplier image'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Ban a supplier
  const banSupplier = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const bannedSupplier = await suppliersApi.banSupplier(id);
      setSuppliers(prevSuppliers =>
        prevSuppliers.map(supplier => supplier.id === id ? bannedSupplier : supplier)
      );
      // Note: Success notification is handled by the calling component for better UX
      return bannedSupplier;
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to ban supplier'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Unban a supplier
  const unbanSupplier = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const unbannedSupplier = await suppliersApi.unbanSupplier(id);
      setSuppliers(prevSuppliers =>
        prevSuppliers.map(supplier => supplier.id === id ? unbannedSupplier : supplier)
      );
      // Note: Success notification is handled by the calling component for better UX
      return unbannedSupplier;
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to unban supplier'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    suppliers,
    isLoading,
    error,
    fetchSuppliers,
    getSupplierById,
    createSupplier,
    createEntity: createSupplier, // Alias for consistency with user pattern
    updateSupplier,
    deleteSupplier,
    deleteEntity: deleteSupplier, // Alias for consistency with user pattern
    updateVerificationStatus,
    getSupplierDocuments,
    getSupplierAnalytics,
    uploadSupplierImage,
    banSupplier,
    unbanSupplier
  };
};

export default useSuppliers;

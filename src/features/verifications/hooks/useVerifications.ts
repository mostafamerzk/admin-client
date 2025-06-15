/**
 * Verifications Hook
 *
 * This hook provides methods and state for working with verifications.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type{ Verification, VerificationUpdateData } from '../types/index';
import verificationsApi from '../api/verificationsApi';
import useNotification from '../../../hooks/useNotification';

export const useVerifications = () => {
  const [verifications, setVerifications] = useState<Verification[]>([]);
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

  // Fetch all verifications
  const fetchVerifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await verificationsApi.getVerifications();
      setVerifications(data);
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch verifications'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get a verification by ID
  const getVerificationById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const verification = await verificationsApi.getVerificationById(id);
      return verification;
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: `Failed to fetch verification ${id}`
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get verifications by status
  const getVerificationsByStatus = useCallback(async (status: Verification['status']) => {
    setIsLoading(true);
    setError(null);
    try {
      const filteredVerifications = await verificationsApi.getVerificationsByStatus(status);
      return filteredVerifications;
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: `Failed to fetch verifications with status ${status}`
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update a verification
  const updateVerification = useCallback(async (id: string, data: VerificationUpdateData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedVerification = await verificationsApi.updateVerification(id, data);
      setVerifications(prevVerifications =>
        prevVerifications.map(verification => verification.id === id ? updatedVerification : verification)
      );
      showNotificationRef.current({
        type: 'success',
        title: 'Success',
        message: 'Verification updated successfully'
      });
      return updatedVerification;
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to update verification'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Approve a verification
  const approveVerification = useCallback(async (id: string, notes: string = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const approvedVerification = await verificationsApi.approveVerification(id, notes);
      setVerifications(prevVerifications =>
        prevVerifications.map(verification => verification.id === id ? approvedVerification : verification)
      );
      return approvedVerification;
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to approve verification'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Reject a verification
  const rejectVerification = useCallback(async (id: string, notes: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const rejectedVerification = await verificationsApi.rejectVerification(id, notes);
      setVerifications(prevVerifications =>
        prevVerifications.map(verification => verification.id === id ? rejectedVerification : verification)
      );
      return rejectedVerification;
    } catch (err) {
      setError(err as Error);
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'Failed to reject verification'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load verifications on mount
  useEffect(() => {
    if (!hasInitialFetched.current) {
      hasInitialFetched.current = true;
      fetchVerifications();
    }
  }, []);

  return {
    verifications,
    isLoading,
    error,
    fetchVerifications,
    getVerificationById,
    getVerificationsByStatus,
    updateVerification,
    approveVerification,
    rejectVerification
  };
};

export default useVerifications;

/**
 * VerificationsPage Component
 *
 * The verifications page for the ConnectChain admin panel.
 */

import React, { useState, useMemo } from 'react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import useNotification from '../hooks/useNotification';
import {
  VerificationList,
  VerificationDetails,
  ApproveVerificationModal,
  RejectVerificationModal,
  Verification,
  useVerifications
} from '../features/verifications/index';

const VerificationsPage: React.FC = () => {
  // Use the useVerifications hook for API integration
  const { verifications, isLoading, approveVerification, rejectVerification } = useVerifications();

  const { showSuccess, showError } = useNotification();
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Track processed verifications to remove them from the list
  const [processedVerificationIds, setProcessedVerificationIds] = useState<Set<string>>(new Set());

  // Filter out processed verifications to show only pending ones
  const displayedVerifications = useMemo(() => {
    return verifications.filter(verification =>
      !processedVerificationIds.has(verification.id) && verification.status === 'pending'
    );
  }, [verifications, processedVerificationIds]);



  const handleViewVerification = (verification: Verification) => {
    setSelectedVerification(verification);
    setIsViewModalOpen(true);
  };

  const handleApproveClick = (verification: Verification) => {
    setSelectedVerification(verification);
    setIsApproveModalOpen(true);
  };

  const handleRejectClick = (verification: Verification) => {
    setSelectedVerification(verification);
    setIsRejectModalOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedVerification) return;

    try {
      await approveVerification(selectedVerification.id);

      // Add to processed list to remove from display
      setProcessedVerificationIds(prev => new Set(prev).add(selectedVerification.id));

      showSuccess(`${selectedVerification.companyName} has been approved`);
      setIsApproveModalOpen(false);
      setSelectedVerification(null);
    } catch (error) {
      console.error('Error approving verification:', error);
      // Error notification is handled by the hook
      // Don't add to processed list if there was an error
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      showError('Please provide a reason for rejection');
      return;
    }

    if (!selectedVerification) return;

    try {
      await rejectVerification(selectedVerification.id, rejectReason);

      // Add to processed list to remove from display
      setProcessedVerificationIds(prev => new Set(prev).add(selectedVerification.id));

      showSuccess(`${selectedVerification.companyName} has been rejected`);
      setIsRejectModalOpen(false);
      setRejectReason('');
      setSelectedVerification(null);
    } catch (error) {
      console.error('Error rejecting verification:', error);
      // Error notification is handled by the hook
      // Don't add to processed list if there was an error
    }
  };

  return (
    <div>
      <PageHeader
        title="Supplier Verifications"
        description="Review and manage supplier verification requests"
        breadcrumbs={[{ label: 'Verifications' }]}
      />

      <Card>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : displayedVerifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No pending verifications</div>
            <div className="text-gray-400 text-sm">
              All verification requests have been processed or there are no new requests.
            </div>
          </div>
        ) : (
          <VerificationList
            verifications={displayedVerifications}
            onViewVerification={handleViewVerification}
            onApproveClick={handleApproveClick}
            onRejectClick={handleRejectClick}
            title="Pending Verifications"
            description="Suppliers waiting for verification approval"
          />
        )}
      </Card>

      {/* View Verification Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Verification Details"
        size="lg"
      >
        {selectedVerification && (
          <VerificationDetails
            verification={selectedVerification}
            onClose={() => setIsViewModalOpen(false)}
            onApprove={() => {
              setIsViewModalOpen(false);
              setIsApproveModalOpen(true);
            }}
            onReject={() => {
              setIsViewModalOpen(false);
              setIsRejectModalOpen(true);
            }}
          />
        )}
      </Modal>

      {/* Approve Confirmation Modal */}
      <ApproveVerificationModal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        onApprove={handleApprove}
        verification={selectedVerification}
      />

      {/* Reject Modal */}
      <RejectVerificationModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onReject={handleReject}
        verification={selectedVerification}
        rejectReason={rejectReason}
        setRejectReason={setRejectReason}
      />
    </div>
  );
};

export default VerificationsPage;

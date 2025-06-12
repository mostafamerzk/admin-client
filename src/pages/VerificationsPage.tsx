/**
 * VerificationsPage Component
 *
 * The verifications page for the ConnectChain admin panel.
 */

import React, { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import useNotification from '../hooks/useNotification';
import {
  VerificationList,
  VerificationDetails,
  ApproveVerificationModal,
  RejectVerificationModal,
  Verification,

} from '../features/verifications/index';

const VerificationsPage: React.FC = () => {
  // In a real implementation, we would use the useVerifications hook
  // const { verifications, isLoading, approveVerification, rejectVerification } = useVerifications();

  const { showSuccess, showError } = useNotification();
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Mock data
  const verifications: Verification[] = [
    {
      id: '1',
      companyName: 'Global Electronics',
      contactPerson: 'David Chen',
      email: 'david@globalelectronics.com',
      phone: '+1 (456) 789-0123',
      status: 'pending',
      submittedDate: '2024-01-12T16:20:00Z',
      documents: [
        { name: 'Business License', type: 'PDF', url: '#' },
        { name: 'Tax Certificate', type: 'PDF', url: '#' },
        { name: 'Company Profile', type: 'DOCX', url: '#' }
      ]
    },
    {
      id: '2',
      companyName: 'Fashion Trends Inc',
      contactPerson: 'Emma Thompson',
      email: 'emma@fashiontrends.com',
      phone: '+1 (789) 012-3456',
      status: 'pending',
      submittedDate: '2024-01-14T15:40:00Z',
      documents: [
        { name: 'Business License', type: 'PDF', url: '#' },
        { name: 'Tax Certificate', type: 'PDF', url: '#' }
      ]
    },
    {
      id: '3',
      companyName: 'Organic Foods Co',
      contactPerson: 'Michael Brown',
      email: 'michael@organicfoods.com',
      phone: '+1 (234) 567-8901',
      status: 'pending',
      submittedDate: '2024-01-10T09:15:00Z',
      documents: [
        { name: 'Business License', type: 'PDF', url: '#' },
        { name: 'Food Safety Certificate', type: 'PDF', url: '#' },
        { name: 'Organic Certification', type: 'PDF', url: '#' }
      ]
    }
  ];

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

  const handleApprove = () => {
    // In a real app, this would call an API to approve the verification
    // approveVerification(selectedVerification!.id);
    showSuccess(`${selectedVerification?.companyName} has been approved`);
    setIsApproveModalOpen(false);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      showError('Please provide a reason for rejection');
      return;
    }

    // In a real app, this would call an API to reject the verification
    // rejectVerification(selectedVerification!.id, rejectReason);
    showSuccess(`${selectedVerification?.companyName} has been rejected`);
    setIsRejectModalOpen(false);
    setRejectReason('');
  };

  return (
    <div>
      <PageHeader
        title="Supplier Verifications"
        description="Review and manage supplier verification requests"
        breadcrumbs={[{ label: 'Verifications' }]}
      />

      <Card>
        <VerificationList
          verifications={verifications}
          onViewVerification={handleViewVerification}
          onApproveClick={handleApproveClick}
          onRejectClick={handleRejectClick}
          title="Pending Verifications"
          description="Suppliers waiting for verification approval"
        />
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

/**
 * Reject Verification Modal Component
 * 
 * This component displays a modal for rejecting a verification with a reason.
 */

import React from 'react';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';
import type{ Verification } from '../types/index';

interface RejectVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: () => void;
  verification: Verification | null;
  rejectReason: string;
  setRejectReason: (reason: string) => void;
}

const RejectVerificationModal: React.FC<RejectVerificationModalProps> = ({
  isOpen,
  onClose,
  onReject,
  verification,
  rejectReason,
  setRejectReason
}) => {
  if (!verification) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reject Supplier"
      size="sm"
      footer={
        <>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onReject}
          >
            Reject
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Are you sure you want to reject <span className="font-medium">{verification.companyName}</span>'s verification request?
        </p>
        
        <div>
          <label htmlFor="reject-reason" className="block text-sm font-medium text-gray-700">
            Reason for Rejection
          </label>
          <textarea
            id="reject-reason"
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="Please provide a reason for rejection"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </div>
        
        <p className="text-xs text-gray-500">
          This reason will be sent to the supplier via email.
        </p>
      </div>
    </Modal>
  );
};

export default RejectVerificationModal;

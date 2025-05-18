/**
 * Approve Verification Modal Component
 * 
 * This component displays a confirmation modal for approving a verification.
 */

import React from 'react';
import Modal from '../../../components/common/Modal.tsx';
import Button from '../../../components/common/Button.tsx';
import type{ Verification } from '../types/index.ts';

interface ApproveVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  verification: Verification | null;
}

const ApproveVerificationModal: React.FC<ApproveVerificationModalProps> = ({
  isOpen,
  onClose,
  onApprove,
  verification
}) => {
  if (!verification) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Approve Supplier"
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
            variant="success"
            onClick={onApprove}
          >
            Approve
          </Button>
        </>
      }
    >
      <p className="text-sm text-gray-600">
        Are you sure you want to approve <span className="font-medium">{verification.companyName}</span> as a verified supplier?
      </p>
      <p className="text-sm text-gray-600 mt-2">
        This will grant them access to list products and receive orders on the platform.
      </p>
    </Modal>
  );
};

export default ApproveVerificationModal;

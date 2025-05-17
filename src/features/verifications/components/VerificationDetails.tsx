/**
 * Verification Details Component
 * 
 * This component displays detailed information about a verification.
 */

import React from 'react';
import { Verification } from '../types/index.ts';
import Button from '../../../components/common/Button.tsx';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface VerificationDetailsProps {
  verification: Verification;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}

const VerificationDetails: React.FC<VerificationDetailsProps> = ({
  verification,
  onClose,
  onApprove,
  onReject
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Company Information</h3>
          <div className="mt-2 space-y-2">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Company Name:</span> {verification.companyName}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Contact Person:</span> {verification.contactPerson}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Email:</span> {verification.email}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Phone:</span> {verification.phone}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Submitted Date:</span> {new Date(verification.submittedDate).toLocaleString()}
            </p>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Submitted Documents</h3>
          <div className="mt-2">
            <ul className="divide-y divide-gray-200">
              {verification.documents.map((doc, index) => (
                <li key={index} className="py-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.type} Document</p>
                    </div>
                    <Button
                      variant="outline"
                      size="xs"
                      href={doc.url}
                      target="_blank"
                    >
                      View
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            variant="success"
            icon={<CheckIcon className="h-4 w-4" />}
            onClick={onApprove}
          >
            Approve
          </Button>
          <Button
            variant="danger"
            icon={<XMarkIcon className="h-4 w-4" />}
            onClick={onReject}
          >
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerificationDetails;

/**
 * VerificationsPage Component
 * 
 * The verifications page for the ConnectChain admin panel.
 */

import React, { useState } from 'react';
import { CheckIcon, XMarkIcon, EyeIcon } from '@heroicons/react/24/outline';
import PageHeader from '../components/layout/PageHeader.tsx';
import Card from '../components/common/Card.tsx';
import Button from '../components/common/Button.tsx';
import DataTable from '../components/common/DataTable.tsx';
import Modal from '../components/common/Modal.tsx';
import Badge from '../components/common/Badge.tsx';
import useNotification from '../hooks/useNotification.ts';

interface Verification {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: 'pending' | 'verified' | 'rejected';
  submittedDate: string;
  documents: {
    name: string;
    type: string;
    url: string;
  }[];
}

const VerificationsPage: React.FC = () => {
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
    showSuccess(`${selectedVerification?.companyName} has been approved`);
    setIsApproveModalOpen(false);
  };
  
  const handleReject = () => {
    if (!rejectReason.trim()) {
      showError('Please provide a reason for rejection');
      return;
    }
    
    // In a real app, this would call an API to reject the verification
    showSuccess(`${selectedVerification?.companyName} has been rejected`);
    setIsRejectModalOpen(false);
    setRejectReason('');
  };
  
  const columns = [
    { key: 'companyName', label: 'Company Name', sortable: true },
    { key: 'contactPerson', label: 'Contact Person', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone', sortable: true },
    { 
      key: 'submittedDate', 
      label: 'Submitted Date', 
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === 'pending' ? 'warning' : value === 'verified' ? 'success' : 'danger'}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: Verification) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            icon={<EyeIcon className="h-4 w-4" />}
            onClick={() => handleViewVerification(row)}
          >
            View
          </Button>
          <Button
            variant="success"
            size="sm"
            icon={<CheckIcon className="h-4 w-4" />}
            onClick={() => handleApproveClick(row)}
          >
            Approve
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={<XMarkIcon className="h-4 w-4" />}
            onClick={() => handleRejectClick(row)}
          >
            Reject
          </Button>
        </div>
      )
    }
  ];
  
  return (
    <div>
      <PageHeader
        title="Supplier Verifications"
        description="Review and manage supplier verification requests"
        breadcrumbs={[{ label: 'Verifications' }]}
      />
      
      <Card>
        <DataTable
          columns={columns}
          data={verifications}
          title="Pending Verifications"
          description="Suppliers waiting for verification approval"
          pagination={true}
          selectable={false}
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
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Company Information</h3>
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Company Name:</span> {selectedVerification.companyName}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Contact Person:</span> {selectedVerification.contactPerson}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Email:</span> {selectedVerification.email}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Phone:</span> {selectedVerification.phone}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Submitted Date:</span> {new Date(selectedVerification.submittedDate).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Submitted Documents</h3>
                <div className="mt-2">
                  <ul className="divide-y divide-gray-200">
                    {selectedVerification.documents.map((doc, index) => (
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
                  onClick={() => setIsViewModalOpen(false)}
                >
                  Close
                </Button>
                <Button
                  variant="success"
                  icon={<CheckIcon className="h-4 w-4" />}
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setIsApproveModalOpen(true);
                  }}
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  icon={<XMarkIcon className="h-4 w-4" />}
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setIsRejectModalOpen(true);
                  }}
                >
                  Reject
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
      
      {/* Approve Confirmation Modal */}
      <Modal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        title="Approve Supplier"
        size="sm"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setIsApproveModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={handleApprove}
            >
              Approve
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to approve <span className="font-medium">{selectedVerification?.companyName}</span> as a verified supplier?
        </p>
        <p className="text-sm text-gray-600 mt-2">
          This will grant them access to list products and receive orders on the platform.
        </p>
      </Modal>
      
      {/* Reject Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Reject Supplier"
        size="sm"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setIsRejectModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleReject}
            >
              Reject
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to reject <span className="font-medium">{selectedVerification?.companyName}</span>'s verification request?
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
    </div>
  );
};

export default VerificationsPage;

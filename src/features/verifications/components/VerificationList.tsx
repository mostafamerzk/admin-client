/**
 * Verification List Component
 * 
 * This component displays a list of verifications in a data table.
 */

import React from 'react';
import DataTable, { type Column } from '../../../components/common/DataTable';
import { type Verification } from '../types/index';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import { CheckIcon, XMarkIcon, EyeIcon } from '@heroicons/react/24/outline';

interface VerificationListProps {
  verifications: Verification[];
  onViewVerification: (verification: Verification) => void;
  onApproveClick: (verification: Verification) => void;
  onRejectClick: (verification: Verification) => void;
  title?: string;
  description?: string;
}

const VerificationList: React.FC<VerificationListProps> = ({
  verifications,
  onViewVerification,
  onApproveClick,
  onRejectClick,
  title = 'Verifications',
  description
}) => {
  const columns: Column<Verification>[] = [
    { key: 'companyName', label: 'Company Name', sortable: true },
    { key: 'contactPerson', label: 'Contact Person', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone', sortable: true },
    { 
      key: 'submittedDate', 
      label: 'Submitted Date', 
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (value) => (
        <Badge variant={value === 'pending' ? 'warning' : value === 'verified' ? 'success' : 'danger'}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, verification) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            icon={<EyeIcon className="h-4 w-4" />}
            onClick={() => onViewVerification(verification)}
          >
            View
          </Button>
          <Button
            variant="success"
            size="sm"
            icon={<CheckIcon className="h-4 w-4" />}
            onClick={() => onApproveClick(verification)}
          >
            Approve
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={<XMarkIcon className="h-4 w-4" />}
            onClick={() => onRejectClick(verification)}
          >
            Reject
          </Button>
        </div>
      )
    }
  ];

  return (
    <DataTable<Verification>
      columns={columns}
      data={verifications}
      title={title}
      description={description}
      pagination={true}
      selectable={false}
    />
  );
};

export default VerificationList;

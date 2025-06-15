/**
 * Verification List Component
 *
 * This component displays a list of verifications in a data table.
 */

import React from 'react';
import DataTable, { type Column } from '../../../components/common/DataTable';
import Avatar from '../../../components/common/Avatar';
import { type Verification } from '../types/index';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

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
    {
      key: 'companyName',
      label: 'Company Name',
      sortable: true,
      render: (_value: string, verification: Verification) => (
        <div className="flex items-center">
          <div className="mr-3">
            <Avatar
              alt={verification.companyName}
              name={verification.companyName}
              size="sm"
            />
          </div>
          <div>
            <div className="font-medium text-gray-900">{verification.companyName}</div>
            <div className="text-xs text-gray-500">ID: {verification.id}</div>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center">
          <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-2" />
          <span>{value}</span>
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center">
          <PhoneIcon className="w-4 h-4 text-gray-400 mr-2" />
          <span>{value}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => {
        // Handle undefined or null values
        if (!value) {
          return (
            <div className="flex items-center">
              <ClockIcon className="w-4 h-4 text-gray-400 mr-1" />
              <span>Unknown</span>
            </div>
          );
        }

        let icon;
        switch(value) {
          case 'verified':
            icon = <CheckCircleIcon className="w-4 h-4 text-green-500 mr-1" />;
            break;
          case 'pending':
            icon = <ClockIcon className="w-4 h-4 text-yellow-500 mr-1" />;
            break;
          case 'rejected':
            icon = <XCircleIcon className="w-4 h-4 text-red-500 mr-1" />;
            break;
          default:
            icon = <ClockIcon className="w-4 h-4 text-gray-400 mr-1" />;
        }
        return (
          <div className="flex items-center">
            {icon}
            <span>{value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Unknown'}</span>
          </div>
        );
      }
    },
    {
      key: 'submittedDate',
      label: 'Submitted Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, verification: Verification) => (
        <div className="flex items-center space-x-2">
          <button
            className="p-1 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              onViewVerification(verification);
            }}
            title="View verification details"
          >
            <EyeIcon className="w-5 h-5" />
          </button>
          <button
            className="p-1 text-gray-500 hover:text-green-600 rounded-full hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              onApproveClick(verification);
            }}
            title="Approve verification"
          >
            <CheckIcon className="w-5 h-5" />
          </button>
          <button
            className="p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              onRejectClick(verification);
            }}
            title="Reject verification"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
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

/**
 * Supplier List Component
 *
 * This component displays a list of suppliers in a data table.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../../components/common/DataTable';
import Avatar from '../../../components/common/Avatar';
import type{ Supplier } from '../types/index';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  TrashIcon,
  EyeIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import { ROUTES } from '../../../constants/routes';

interface SupplierListProps {
  suppliers: Supplier[];
  onViewSupplier: (supplier: Supplier) => void;
  onDeleteSupplier: (supplier: Supplier) => void;
  onSupplierClick: (supplier: Supplier) => void;
  title?: string;
}

const SupplierList: React.FC<SupplierListProps> = ({
  suppliers,
  onViewSupplier,
  onDeleteSupplier,
  onSupplierClick: _onSupplierClick, // Keep for interface compatibility but use navigation instead
  title = 'Suppliers'
}) => {
  const navigate = useNavigate();

  // Handle row click to navigate to supplier profile page
  const handleRowClick = (supplier: Supplier) => {
    navigate(ROUTES.getSupplierProfileRoute(supplier.id));
  };
  const columns = [
    {
      key: 'name',
      label: 'Supplier Name',
      sortable: true,
      render: (_value: string, supplier: Supplier) => (
        <div className="flex items-center">
          <div className="mr-3">
            <Avatar
              {...(supplier.logo && { src: supplier.logo })}
              alt={supplier.name}
              name={supplier.name}
              size="sm"
            />
          </div>
          <div>
            <div className="font-medium text-gray-900">{supplier.name}</div>
            <div className="text-xs text-gray-500">ID: {supplier.id}</div>
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
      key: 'verificationStatus',
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
    { key: 'joinDate', label: 'Join Date', sortable: true },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, supplier: Supplier) => (
        <div className="flex items-center space-x-2">
          <button
            className="p-1 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              onViewSupplier(supplier);
            }}
            title="View supplier details"
          >
            <EyeIcon className="w-5 h-5" />
          </button>
          <button
            className="p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteSupplier(supplier);
            }}
            title="Delete supplier"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={suppliers}
      onRowClick={handleRowClick}
      title={title}
      pagination={true}
    />
  );
};

export default SupplierList;

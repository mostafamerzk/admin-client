/**
 * Supplier List Component
 *
 * This component displays a list of suppliers in a data table.
 */

import React from 'react';
import DataTable from '../../../components/common/DataTable.tsx';
import type{ Supplier } from '../types/index.ts';
import {
  BuildingOffice2Icon,
  BuildingStorefrontIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

interface SupplierListProps {
  suppliers: Supplier[];
  onViewSupplier: (supplier: Supplier) => void;
  onEditSupplier: (supplier: Supplier) => void;
  onDeleteSupplier: (supplier: Supplier) => void;
  onSupplierClick: (supplier: Supplier) => void;
  title?: string;
}

const SupplierList: React.FC<SupplierListProps> = ({
  suppliers,
  onViewSupplier,
  onEditSupplier,
  onDeleteSupplier,
  onSupplierClick,
  title = 'Suppliers'
}) => {
  const columns = [
    {
      key: 'name',
      label: 'Company',
      sortable: true,
      render: (value: string, supplier: Supplier) => (
        <div className="flex items-center">
          {supplier.logo ? (
            <img
              src={supplier.logo}
              alt={supplier.name}
              className="w-8 h-8 rounded-full mr-3 object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
              </svg>
            </div>
          )}
          <div>
            <div className="font-medium text-gray-900">{supplier.name}</div>
            <div className="text-xs text-gray-500">ID: {supplier.id}</div>
          </div>
        </div>
      )
    },
    { key: 'contactPerson', label: 'Contact Person', sortable: true },
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
        }
        return (
          <div className="flex items-center">
            {icon}
            <span>{value.charAt(0).toUpperCase() + value.slice(1)}</span>
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
          >
            <EyeIcon className="w-5 h-5" />
          </button>
          <button
            className="p-1 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              onEditSupplier(supplier);
            }}
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            className="p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteSupplier(supplier);
            }}
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
      onRowClick={onSupplierClick}
      title={title}
      pagination={true}
    />
  );
};

export default SupplierList;

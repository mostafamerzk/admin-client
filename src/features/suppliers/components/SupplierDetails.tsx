/**
 * Supplier Details Component
 * 
 * This component displays detailed information about a supplier.
 */

import React from 'react';
import Avatar from '../../../components/common/Avatar';
import type{ Supplier } from '../types/index';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface SupplierDetailsProps {
  supplier: Supplier;
}

const SupplierDetails: React.FC<SupplierDetailsProps> = ({ supplier }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar
            {...(supplier.logo && { src: supplier.logo })}
            alt={supplier.name}
            name={supplier.name}
            size="xl"
          />
          <div>
            <h3 className="text-lg font-medium text-gray-900">{supplier.name}</h3>
            <p className="text-sm text-gray-500">ID: {supplier.id}</p>
            <div className="mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                supplier.verificationStatus === 'verified'
                  ? 'bg-green-100 text-green-800'
                  : supplier.verificationStatus === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
              }`}>
                {supplier.verificationStatus.charAt(0).toUpperCase() + supplier.verificationStatus.slice(1)}
              </span>
            </div>
          </div>
        </div>
        {supplier.website && (
          <a
            href={supplier.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline text-sm"
          >
            Visit Website
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h4>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs text-gray-500">Contact Person</dt>
              <dd className="text-sm text-gray-900">{supplier.contactPerson}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Email</dt>
              <dd className="text-sm text-gray-900">{supplier.email}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Phone</dt>
              <dd className="text-sm text-gray-900">{supplier.phone}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-3">Address</h4>
          <address className="not-italic text-sm text-gray-900">
            {supplier.address}
          </address>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-medium text-gray-500 mb-2">Categories</h4>
        <div className="flex flex-wrap gap-2">
          {supplier.categories.map((category, index) => (
            <span 
              key={index} 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {category}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-medium text-gray-500 mb-2">Verification Status</h4>
        <div className="flex items-center space-x-2">
          {supplier.verificationStatus === 'verified' ? (
            <CheckCircleIcon className="w-5 h-5 text-green-500" />
          ) : supplier.verificationStatus === 'pending' ? (
            <ClockIcon className="w-5 h-5 text-yellow-500" />
          ) : (
            <XCircleIcon className="w-5 h-5 text-red-500" />
          )}
          <span className="text-sm text-gray-700">
            {supplier.verificationStatus === 'verified'
              ? `Verified on ${supplier.joinDate}`
              : supplier.verificationStatus === 'pending'
                ? 'Pending verification'
                : `Rejected on ${supplier.joinDate}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetails;

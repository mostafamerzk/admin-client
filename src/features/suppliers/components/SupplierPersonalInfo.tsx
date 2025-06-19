/**
 * Supplier Personal Information Component
 *
 * This component displays supplier's basic details using the same design pattern
 * as UserDetails component with DetailSection, DetailList, and DetailItem.
 */

import React from 'react';
import DetailSection from '../../../components/common/DetailSection';
import DetailList from '../../../components/common/DetailList';
import DetailItem from '../../../components/common/DetailItem';
import StatusBadge from '../../../components/common/StatusBadge';
import Avatar from '../../../components/common/Avatar';
import type { Supplier } from '../types';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeAltIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface SupplierPersonalInfoProps {
  supplier: Supplier;
}

const SupplierPersonalInfo: React.FC<SupplierPersonalInfoProps> = ({ supplier }) => {
  const getVerificationIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'rejected':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getVerificationText = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'pending':
        return 'Pending verification';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown status';
    }
  };

  return (
    <div className="space-y-6">
      {/* Supplier Header */}
      <DetailSection
        title="Supplier Overview"
        description="Basic supplier information and verification status"
      >
        <div className="px-6 py-4">
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
                <div className="mt-2 flex items-center space-x-3">
                  <StatusBadge status={supplier.status} type="supplier" />
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    supplier.verificationStatus === 'verified'
                      ? 'bg-green-100 text-green-800'
                      : supplier.verificationStatus === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {supplier.verificationStatus ?
                      supplier.verificationStatus :
                      'Unknown'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DetailSection>

      {/* Contact Information */}
      <DetailSection
        title="Contact Information"
        description="Primary contact details and communication preferences"
      >
        <DetailList>
          <DetailItem 
            label="Contact Person" 
            value={
              <div className="flex items-center">
                <UserIcon className="w-4 h-4 text-gray-400 mr-2" />
                {supplier.contactPerson}
              </div>
            } 
          />
          <DetailItem 
            label="Email Address" 
            value={
              <div className="flex items-center">
                <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-2" />
                <a 
                  href={`mailto:${supplier.email}`}
                  className="text-primary hover:text-primary-dark"
                >
                  {supplier.email}
                </a>
              </div>
            } 
          />
          <DetailItem 
            label="Phone Number" 
            value={
              <div className="flex items-center">
                <PhoneIcon className="w-4 h-4 text-gray-400 mr-2" />
                <a 
                  href={`tel:${supplier.phone}`}
                  className="text-primary hover:text-primary-dark"
                >
                  {supplier.phone}
                </a>
              </div>
            } 
          />
          <DetailItem 
            label="Address" 
            value={
              <div className="flex items-start">
                <MapPinIcon className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                <span>{supplier.address}</span>
              </div>
            } 
          />
          {supplier.website && (
            <DetailItem 
              label="Website" 
              value={
                <div className="flex items-center">
                  <GlobeAltIcon className="w-4 h-4 text-gray-400 mr-2" />
                  <a 
                    href={supplier.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-dark"
                  >
                    {supplier.website}
                  </a>
                </div>
              } 
            />
          )}
        </DetailList>
      </DetailSection>

      {/* Business Information */}
      <DetailSection
        title="Business Information"
        description="Business categories and operational details"
      >
        <DetailList>

          <DetailItem
            label="Business Categories"
            value={
              <div className="flex flex-wrap gap-2">
                {supplier.categories && supplier.categories.length > 0 ? (
                  supplier.categories.map((category, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {category}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No categories assigned</span>
                )}
              </div>
            }
          />
          <DetailItem 
            label="Account Status" 
            value={<StatusBadge status={supplier.status} type="supplier" />} 
          />
        </DetailList>
      </DetailSection>

      {/* Verification Status */}
      <DetailSection
        title="Verification Status"
        description="Current verification status and history"
      >
        <div className="px-6 py-4">
          <div className="flex items-center space-x-3">
            {getVerificationIcon(supplier.verificationStatus || 'pending')}
            <div>
              <div className="text-sm font-medium text-gray-900">
                {supplier.verificationStatus === 'verified' ? 'Verified Supplier' : 
                 supplier.verificationStatus === 'pending' ? 'Verification Pending' : 
                 'Verification Rejected'}
              </div>
              <div className="text-sm text-gray-500">
                {getVerificationText(supplier.verificationStatus || 'pending')}
              </div>
            </div>
          </div>
        </div>
      </DetailSection>
    </div>
  );
};

export default SupplierPersonalInfo;

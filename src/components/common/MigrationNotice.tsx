/**
 * Migration Notice Component
 * 
 * A reusable component for displaying migration notices to users.
 */

import React from 'react';
import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

interface MigrationNoticeProps {
  title: string;
  message: string;
  actionText?: string;
  actionLink?: string;
  onDismiss?: () => void;
  type?: 'info' | 'warning' | 'success';
  className?: string;
}

const MigrationNotice: React.FC<MigrationNoticeProps> = ({
  title,
  message,
  actionText,
  actionLink,
  onDismiss,
  type = 'info',
  className = ''
}) => {
  const typeClasses = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    success: 'bg-green-50 border-green-200 text-green-800'
  };

  const iconClasses = {
    info: 'text-blue-400',
    warning: 'text-yellow-400',
    success: 'text-green-400'
  };

  return (
    <div className={`border rounded-lg p-4 ${typeClasses[type]} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <InformationCircleIcon className={`h-5 w-5 ${iconClasses[type]}`} aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium">{title}</h3>
          <div className="mt-2 text-sm">
            <p>{message}</p>
          </div>
          {actionText && actionLink && (
            <div className="mt-3">
              <Link
                to={actionLink}
                className="text-sm font-medium underline hover:no-underline"
              >
                {actionText}
              </Link>
            </div>
          )}
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  type === 'info' ? 'text-blue-500 hover:bg-blue-100 focus:ring-blue-600' :
                  type === 'warning' ? 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600' :
                  'text-green-500 hover:bg-green-100 focus:ring-green-600'
                }`}
                onClick={onDismiss}
              >
                <span className="sr-only">Dismiss</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MigrationNotice;

import React from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  TruckIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

export type StatusType = 'user' | 'supplier' | 'order' | 'verification' | 'category';

interface StatusBadgeProps {
  status: string;
  type?: StatusType;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = 'user',
  className = ''
}) => {
  const statusKey = status.toLowerCase();
  let colorClass = '';
  let icon = null;
  
  // Common statuses across entity types
  if (statusKey === 'active' || statusKey === 'verified' || statusKey === 'completed') {
    colorClass = 'bg-green-100 text-green-800';
    icon = <CheckCircleIcon className="w-4 h-4 mr-1" />;
  } else if (statusKey === 'pending' || statusKey === 'processing') {
    colorClass = 'bg-blue-100 text-blue-800';
    icon = <ClockIcon className="w-4 h-4 mr-1" />;
  } else if (statusKey === 'banned' || statusKey === 'rejected') {
    colorClass = 'bg-red-100 text-red-800';
    icon = <XCircleIcon className="w-4 h-4 mr-1" />;
  } else if (statusKey === 'shipped') {
    colorClass = 'bg-purple-100 text-purple-800';
    icon = <TruckIcon className="w-4 h-4 mr-1" />;
  } else if (statusKey === 'warning') {
    colorClass = 'bg-yellow-100 text-yellow-800';
    icon = <ExclamationCircleIcon className="w-4 h-4 mr-1" />;
  } else {
    colorClass = 'bg-gray-100 text-gray-800';
  }
  
  // Format the status text (capitalize first letter)
  const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass} ${className}`}>
      {icon}
      {formattedStatus}
    </span>
  );
};

export default StatusBadge;

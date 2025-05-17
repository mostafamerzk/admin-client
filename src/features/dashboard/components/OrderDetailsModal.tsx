/**
 * Order Details Modal Component
 * 
 * This component displays detailed information about an order in a modal.
 */

import React from 'react';
import Modal from '../../../components/common/Modal.tsx';
import Button from '../../../components/common/Button.tsx';
import { RecentOrder } from '../types/index.ts';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  XCircleIcon,
  TruckIcon,
  CalendarIcon,
  UserIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface OrderDetailsModalProps {
  order: RecentOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ 
  order, 
  isOpen, 
  onClose 
}) => {
  if (!order) return null;

  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <CheckCircleIcon className="w-5 h-5 text-blue-500" />;
      case 'completed':
        return <TruckIcon className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  // Helper function to get status color class
  const getStatusColorClass = (status: string) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return '';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Order Details"
      size="md"
      footer={
        <Button
          variant="outline"
          onClick={onClose}
        >
          Close
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Order #{order.id}</h3>
            <div className="mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="ml-1">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Total Amount</div>
            <div className="text-xl font-bold text-primary">${order.amount.toLocaleString()}</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start">
            <UserIcon className="w-5 h-5 text-gray-400 mt-0.5 mr-2" />
            <div>
              <div className="text-sm font-medium text-gray-500">Customer</div>
              <div className="text-sm text-gray-900">{order.customer}</div>
            </div>
          </div>
          
          <div className="flex items-start">
            <CalendarIcon className="w-5 h-5 text-gray-400 mt-0.5 mr-2" />
            <div>
              <div className="text-sm font-medium text-gray-500">Order Date</div>
              <div className="text-sm text-gray-900">{order.date}</div>
            </div>
          </div>
          
          <div className="flex items-start">
            <CurrencyDollarIcon className="w-5 h-5 text-gray-400 mt-0.5 mr-2" />
            <div>
              <div className="text-sm font-medium text-gray-500">Payment</div>
              <div className="text-sm text-gray-900">${order.amount.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            This is a simplified view of the order. To see full details including items, shipping information, and more, please visit the Orders page.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailsModal;

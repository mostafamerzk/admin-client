/**
 * Order Details Component
 * 
 * This component displays detailed information about an order.
 */

import React from 'react';
import { Order, OrderItem } from '../types/index.ts';
import { formatCurrency, formatDate } from '../../../utils/formatters.ts';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  XCircleIcon,
  TruckIcon,
  CalendarIcon,
  UserIcon,
  BuildingOffice2Icon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface OrderDetailsProps {
  order: Order;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'approved':
        return <CheckCircleIcon className="w-5 h-5 text-blue-500" />;
      case 'completed':
        return <TruckIcon className="w-5 h-5 text-green-500" />;
      case 'rejected':
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
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return '';
    }
  };

  return (
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
          <div className="text-xl font-bold text-primary">{formatCurrency(order.totalAmount)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-start">
            <UserIcon className="w-5 h-5 text-gray-400 mt-0.5 mr-2" />
            <div>
              <div className="text-sm font-medium text-gray-500">Customer</div>
              <div className="text-sm text-gray-900">{order.customerName}</div>
            </div>
          </div>
          
          <div className="flex items-start">
            <BuildingOffice2Icon className="w-5 h-5 text-gray-400 mt-0.5 mr-2" />
            <div>
              <div className="text-sm font-medium text-gray-500">Supplier</div>
              <div className="text-sm text-gray-900">{order.supplierName}</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start">
            <CalendarIcon className="w-5 h-5 text-gray-400 mt-0.5 mr-2" />
            <div>
              <div className="text-sm font-medium text-gray-500">Order Date</div>
              <div className="text-sm text-gray-900">{formatDate(order.orderDate)}</div>
            </div>
          </div>
          
          <div className="flex items-start">
            <TruckIcon className="w-5 h-5 text-gray-400 mt-0.5 mr-2" />
            <div>
              <div className="text-sm font-medium text-gray-500">Delivery Date</div>
              <div className="text-sm text-gray-900">{formatDate(order.deliveryDate)}</div>
            </div>
          </div>
        </div>
      </div>

      {order.items && order.items.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-500 mb-3">Order Items</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items.map((item: OrderItem) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                    Total
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary">
                    {formatCurrency(order.totalAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;

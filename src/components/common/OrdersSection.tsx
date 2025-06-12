import React from 'react';
import DetailSection from './DetailSection';
import type { Order } from '../../features/orders/types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import StatusBadge from './StatusBadge';
import Button from './Button';
import { EyeIcon } from '@heroicons/react/24/outline';

interface OrdersSectionProps {
  orders: Order[];
  title?: string;
  description?: string;
  onViewOrder?: (order: Order) => void;
  emptyMessage?: string;
  className?: string;
}

const OrdersSection: React.FC<OrdersSectionProps> = ({
  orders,
  title = 'Orders',
  description = 'Recent orders',
  onViewOrder,
  emptyMessage = 'No orders found',
  className = ''
}) => {
  return (
    <DetailSection
      title={title}
      description={description}
      className={className}
    >
      {orders.length === 0 ? (
        <div className="px-4 py-5 text-center text-sm text-gray-500">
          {emptyMessage}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.orderDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={order.status} type="order" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {onViewOrder && (
                      <Button
                        variant="text"
                        size="sm"
                        onClick={() => onViewOrder(order)}
                        icon={<EyeIcon className="w-4 h-4 text-black" />}
                        className="text-black hover:text-gray-700 hover:bg-gray-100"
                      >
                        View
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DetailSection>
  );
};

export default OrdersSection;
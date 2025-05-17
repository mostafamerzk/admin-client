/**
 * Order List Component
 * 
 * This component displays a list of orders in a data table.
 */

import React from 'react';
import DataTable from '../../../components/common/DataTable.tsx';
import { Order } from '../types/index.ts';
import { formatCurrency } from '../../../utils/formatters.ts';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  XCircleIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

interface OrderListProps {
  orders: Order[];
  onOrderClick: (order: Order) => void;
  title?: string;
}

const OrderList: React.FC<OrderListProps> = ({
  orders,
  onOrderClick,
  title = 'Orders'
}) => {
  const columns = [
    { 
      key: 'id', 
      label: 'Order ID', 
      sortable: true,
      render: (value: string) => (
        <span className="font-medium text-primary">{value}</span>
      )
    },
    { key: 'customerName', label: 'Customer', sortable: true },
    { key: 'supplierName', label: 'Supplier', sortable: true },
    { 
      key: 'totalAmount', 
      label: 'Total Amount', 
      sortable: true,
      render: (value: number) => formatCurrency(value)
    },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (value: string) => {
        let icon;
        let colorClass;
        
        switch(value) {
          case 'pending':
            icon = <ClockIcon className="w-4 h-4 text-yellow-500 mr-1" />;
            colorClass = 'bg-yellow-100 text-yellow-800';
            break;
          case 'approved':
            icon = <CheckCircleIcon className="w-4 h-4 text-blue-500 mr-1" />;
            colorClass = 'bg-blue-100 text-blue-800';
            break;
          case 'completed':
            icon = <TruckIcon className="w-4 h-4 text-green-500 mr-1" />;
            colorClass = 'bg-green-100 text-green-800';
            break;
          case 'rejected':
            icon = <XCircleIcon className="w-4 h-4 text-red-500 mr-1" />;
            colorClass = 'bg-red-100 text-red-800';
            break;
        }
        
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
            {icon}
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        );
      }
    },
    { key: 'orderDate', label: 'Order Date', sortable: true },
    { key: 'deliveryDate', label: 'Delivery Date', sortable: true },
  ];

  return (
    <DataTable
      columns={columns}
      data={orders}
      onRowClick={onOrderClick}
      title={title}
      pagination={true}
    />
  );
};

export default OrderList;

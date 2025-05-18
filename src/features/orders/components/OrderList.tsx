/**
 * Order List Component
 * 
 * This component displays a list of orders in a data table.
 */

import React from 'react';
import BaseEntityList from '../../../components/common/EntityList/BaseEntityList';
import StatusBadge from '../../../components/common/StatusBadge';
import type { Column } from '../../../components/common/DataTable';
import type { Order } from '../types';
import { formatCurrency } from '../../../utils/formatters';

interface OrderListProps {
  orders: Order[];
  onOrderClick: (order: Order) => void;
  title?: string;
  loading?: boolean;
}

const OrderList: React.FC<OrderListProps> = ({
  orders,
  onOrderClick,
  title = 'Orders',
  loading = false
}) => {
  const columns: Column<Order>[] = [
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
      render: (value: string) => (
        <StatusBadge status={value} type="order" />
      )
    },
    { key: 'orderDate', label: 'Order Date', sortable: true },
    { key: 'deliveryDate', label: 'Delivery Date', sortable: true },
  ];

  return (
    <BaseEntityList<Order>
      data={orders}
      columns={columns}
      onRowClick={onOrderClick}
      title={title}
      pagination={true}
      loading={loading}
      emptyMessage="No orders found"
    />
  );
};

export default OrderList;


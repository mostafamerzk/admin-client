/**
 * Order List Component
 * 
 * This component displays a list of orders in a data table.
 */

import React, { useMemo, memo } from 'react';
import BaseEntityList from '../../../components/common/EntityList/BaseEntityList';
import StatusBadge from '../../../components/common/StatusBadge';
import type { Column } from '../../../components/common/DataTable';
import type { Order } from '../types';
import { formatCurrency } from '../../../utils/formatters';
import { formatOrderDate } from '../utils/orderTransformers';

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
  // Memoize columns to prevent unnecessary re-renders
  const columns: Column<Order>[] = useMemo(() => [
    {
      key: 'orderNumber',
      label: 'Order Number',
      sortable: true,
      render: (value: string) => (
        <span className="font-medium text-black">{value}</span>
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
        <StatusBadge status={value || 'pending'} type="order" />
      )
    },
    {
      key: 'orderDate',
      label: 'Order Date',
      sortable: true,
      render: (value: string) => formatOrderDate(value)
    },
    {
      key: 'paymentMethod',
      label: 'Payment Method',
      sortable: true,
      render: (value: string) => (
        <span className="capitalize">{value?.replace('_', ' ') || 'N/A'}</span>
      )
    },
  ], []);

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

export default memo(OrderList);


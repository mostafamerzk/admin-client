import React, { useState } from 'react';
import DataTable from '../components/DataTable.tsx';

interface Order {
  id: string;
  customerName: string;
  supplierName: string;
  totalAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  orderDate: string;
  deliveryDate: string;
}

const OrdersPage: React.FC = () => {
  const [orders] = useState<Order[]>([
    {
      id: '1',
      customerName: 'John Doe',
      supplierName: 'Tech Supplies Inc',
      totalAmount: 1500.00,
      status: 'pending',
      orderDate: '2024-01-15',
      deliveryDate: '2024-01-20',
    },
    {
      id: '2',
      customerName: 'Jane Smith',
      supplierName: 'Office Solutions',
      totalAmount: 750.50,
      status: 'approved',
      orderDate: '2024-01-14',
      deliveryDate: '2024-01-19',
    },
  ]);

  const columns = [
    { key: 'id', label: 'Order ID', sortable: true },
    { key: 'customerName', label: 'Customer', sortable: true },
    { key: 'supplierName', label: 'Supplier', sortable: true },
    { key: 'totalAmount', label: 'Total Amount', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'orderDate', label: 'Order Date', sortable: true },
    { key: 'deliveryDate', label: 'Delivery Date', sortable: true },
  ];

  const handleOrderClick = (order: Order) => {
    // Handle order click - could open a modal with more details
    console.log('Order clicked:', order);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
        <div className="flex space-x-4">
          <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90">
            Export Orders
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex space-x-4 mb-4">
          <button className="px-4 py-2 border rounded-md hover:bg-gray-50">
            All Orders
          </button>
          <button className="px-4 py-2 border rounded-md hover:bg-gray-50">
            Pending
          </button>
          <button className="px-4 py-2 border rounded-md hover:bg-gray-50">
            Approved
          </button>
          <button className="px-4 py-2 border rounded-md hover:bg-gray-50">
            Completed
          </button>
        </div>

        <DataTable
          columns={columns}
          data={orders}
          onRowClick={handleOrderClick}
        />
      </div>
    </div>
  );
};

export default OrdersPage; 
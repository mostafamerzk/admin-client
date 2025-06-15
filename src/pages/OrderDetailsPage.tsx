/**
 * Order Details Page
 * 
 * A comprehensive page for displaying detailed order information.
 * This page can be accessed from multiple locations (User Edit Page, Orders Page, etc.)
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import StatusBadge from '../components/common/StatusBadge';
import DetailSection from '../components/common/DetailSection';
import DetailList from '../components/common/DetailList';
import DetailItem from '../components/common/DetailItem';
import { useOrders } from '../features/orders/index';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  TruckIcon,
  PhotoIcon,
  ArrowLeftIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import type { Order, OrderItem } from '../features/orders/types';

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const orderId = id || '';

  const { getOrderById, deleteOrder } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setIsLoading(false);
      setError('No order ID provided');
      return;
    }

    const fetchOrderData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch order data';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId, getOrderById]);

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

  // Handle delete order
  const handleDeleteOrder = async () => {
    if (!order) return;

    setIsDeleting(true);
    try {
      await deleteOrder(order.id);
      setIsDeleteModalOpen(false);
      navigate('/orders', { replace: true });
    } catch (error) {
      // Error is already handled by the hook with notifications
      console.error('Failed to delete order:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle opening delete confirmation modal
  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  // Handle closing delete confirmation modal
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-red-600 text-lg font-medium">Error Loading Order</div>
        <div className="text-gray-600">{error}</div>
        <Button
          onClick={() => navigate(-1)}
          icon={<ArrowLeftIcon className="w-4 h-4" />}
          variant="outline"
        >
          Go Back
        </Button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-gray-600 text-lg font-medium">Order not found</div>
        <Button
          onClick={() => navigate(-1)}
          icon={<ArrowLeftIcon className="w-4 h-4" />}
          variant="outline"
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Order #${order.id}`}
        description="Complete order information and details"
        breadcrumbs={[
          { label: 'Orders', path: '/orders' },
          { label: `Order #${order.id}` }
        ]}
        actions={
          <div className="flex space-x-3">
            <Button
              onClick={handleOpenDeleteModal}
              icon={<TrashIcon className="w-4 h-4" />}
              variant="danger"
              disabled={isDeleting}
            >
              Delete Order
            </Button>
            <Button
              onClick={() => navigate(-1)}
              icon={<ArrowLeftIcon className="w-4 h-4" />}
              variant="outline"
            >
              Go Back
            </Button>
          </div>
        }
      />

      {/* Order Status and Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            {getStatusIcon(order.status)}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Order #{order.id}</h2>
              <StatusBadge status={order.status} type="order" />
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Total Amount</div>
            <div className="text-2xl font-bold text-primary">{formatCurrency(order.totalAmount)}</div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Information */}
        <DetailSection
          title="Customer Information"
          description="Details about the customer who placed this order"
        >
          <DetailList>
            <DetailItem label="Customer Name" value={order.customerName} />
            <DetailItem label="Order Date" value={formatDate(order.orderDate)} />
            <DetailItem label="Delivery Date" value={formatDate(order.deliveryDate)} />
          </DetailList>
        </DetailSection>

        {/* Supplier Information */}
        <DetailSection
          title="Supplier Information"
          description="Details about the supplier fulfilling this order"
        >
          <DetailList>
            <DetailItem label="Supplier Name" value={order.supplierName} />
            <DetailItem label="Order Status" value={<StatusBadge status={order.status} type="order" />} />
          </DetailList>
        </DetailSection>
      </div>

      {/* Order Items */}
      {order.items && order.items.length > 0 && (
        <DetailSection
          title="Order Items"
          description="Products and services included in this order"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items.map((item: OrderItem) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        {item.description && (
                          <div className="text-sm text-gray-500">{item.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.sku || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg">
                        <PhotoIcon className="w-6 h-6 text-gray-400" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Order Summary */}
          <div className="mt-6 bg-gray-50 rounded-lg p-6">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-900">{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span className="text-gray-900">Included</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="text-gray-900">Free</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-base font-medium">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-primary font-bold">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </DetailSection>
      )}

      {/* Additional Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipping Address */}
        {order.shippingAddress && (
          <DetailSection
            title="Shipping Address"
            description="Where this order will be delivered"
          >
            <div className="px-4 py-5 text-sm text-gray-900 space-y-1">
              <div>{order.shippingAddress.street}</div>
              <div>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</div>
              <div>{order.shippingAddress.country}</div>
            </div>
          </DetailSection>
        )}

        {/* Billing Address */}
        {order.billingAddress && (
          <DetailSection
            title="Billing Address"
            description="Billing information for this order"
          >
            <div className="px-4 py-5 text-sm text-gray-900 space-y-1">
              <div>{order.billingAddress.street}</div>
              <div>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.postalCode}</div>
              <div>{order.billingAddress.country}</div>
            </div>
          </DetailSection>
        )}
      </div>

      {/* Order Notes */}
      {order.notes && (
        <DetailSection
          title="Order Notes"
          description="Additional information and special instructions"
        >
          <div className="px-4 py-5">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-gray-900">{order.notes}</p>
            </div>
          </div>
        </DetailSection>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title={
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Delete Order</h3>
            </div>
          </div>
        }
        size="sm"
        footer={
          <div className="flex space-x-3">
            <Button
              onClick={handleCloseDeleteModal}
              variant="outline"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteOrder}
              variant="danger"
              loading={isDeleting}
              icon={<TrashIcon className="w-4 h-4" />}
            >
              {isDeleting ? 'Deleting...' : 'Delete Order'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete order <strong>#{order?.id}</strong>? This action cannot be undone.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Warning
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>This will permanently delete the order and all associated data</li>
                    <li>Customer and supplier records will remain intact</li>
                    <li>This action cannot be reversed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrderDetailsPage;

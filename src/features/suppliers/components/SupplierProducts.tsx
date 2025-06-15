/**
 * Supplier Products Component
 *
 * This component displays supplier's products in a data table format
 * with action icons for view, edit, and delete operations.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../../components/common/DataTable';
import type { Column } from '../../../components/common/DataTable';
import DetailSection from '../../../components/common/DetailSection';
import Button from '../../../components/common/Button';
import StatusBadge from '../../../components/common/StatusBadge';
import Modal from '../../../components/common/Modal';
import useNotification from '../../../hooks/useNotification';
import type { SupplierProduct } from '../types';
import { ROUTES } from '../../../constants/routes';
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CubeIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../../utils/formatters';

interface SupplierProductsProps {
  products: SupplierProduct[];
  supplierId?: string;
  onProductUpdate?: () => void;
}

const SupplierProducts: React.FC<SupplierProductsProps> = ({
  products,
  supplierId: _supplierId,
  onProductUpdate
}) => {
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useNotification();
  const [selectedProduct, setSelectedProduct] = useState<SupplierProduct | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const getStatusBadgeStatus = (status: string): string => {
    switch (status) {
      case 'active':
        return 'active';
      case 'inactive':
        return 'pending';
      case 'out_of_stock':
        return 'rejected';
      default:
        return 'pending';
    }
  };

  const getStockStatus = (stock: number, minimumStock: number, status: string) => {
    if (status === 'out_of_stock' || stock === 0) {
      return { text: 'Out of Stock', color: 'text-red-600' };
    } else if (stock <= minimumStock) {
      return { text: 'Low Stock', color: 'text-yellow-600' };
    } else {
      return { text: 'In Stock', color: 'text-green-600' };
    }
  };

  const handleViewProduct = (product: SupplierProduct) => {
    navigate(ROUTES.getProductDetailsRoute(product.id));
  };

  const handleEditProduct = (product: SupplierProduct) => {
    // In a real implementation, this would navigate to edit page or open edit modal
    showInfo(`Edit product: ${product.name}`);
    console.log('Edit product:', product);
  };

  const handleDeleteProduct = (product: SupplierProduct) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      // In a real implementation, this would call an API
      showSuccess(`Product "${selectedProduct.name}" deleted successfully`);
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
      onProductUpdate?.();
    } catch (error) {
      showError('Failed to delete product');
    }
  };

  const columns: Column<SupplierProduct>[] = [
    {
      key: 'name',
      label: 'Product Name',
      sortable: true,
      render: (_value: string, product: SupplierProduct) => (
        <div className="flex items-center">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-10 w-10 rounded-lg object-cover mr-3"
            />
          ) : (
            <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
              <CubeIcon className="h-5 w-5 text-gray-400" />
            </div>
          )}
          <div>
            <div className="font-medium text-gray-900">{product.name}</div>
            <div className="text-xs text-gray-500">ID: {product.id}</div>
          </div>
        </div>
      )
    },
    {
      key: 'sku',
      label: 'SKU',
      sortable: true,
      render: (value: string) => (
        <span className="font-mono text-sm text-gray-600">{value}</span>
      )
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (value: string) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value}
        </span>
      )
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (value: number) => (
        <span className="font-medium text-gray-900">{formatCurrency(value)}</span>
      )
    },
    {
      key: 'stock',
      label: 'Stock',
      sortable: true,
      render: (value: number, product: SupplierProduct) => {
        const stockStatus = getStockStatus(value, product.minimumStock || 10, product.status);
        return (
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className={`text-xs ${stockStatus.color}`}>{stockStatus.text}</div>
          </div>
        );
      }
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <StatusBadge status={getStatusBadgeStatus(value)} type="supplier" />
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_value: any, product: SupplierProduct) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="xs"
            onClick={() => handleViewProduct(product)}
            icon={<EyeIcon className="w-4 h-4" />}
            title="View product details"
          >
            View
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={() => handleEditProduct(product)}
            icon={<PencilIcon className="w-4 h-4" />}
            title="Edit product"
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="xs"
            onClick={() => handleDeleteProduct(product)}
            icon={<TrashIcon className="w-4 h-4" />}
            title="Delete product"
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  if (products.length === 0) {
    return (
      <DetailSection
        title="Products"
        description="Products offered by this supplier"
      >
        <div className="px-6 py-8 text-center">
          <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-sm text-gray-500">
            This supplier has not added any products yet.
          </p>
          <div className="mt-6">
            <Button
              variant="primary"
              icon={<PlusIcon className="w-4 h-4" />}
              onClick={() => showInfo('Add product functionality coming soon')}
            >
              Add Product
            </Button>
          </div>
        </div>
      </DetailSection>
    );
  }

  return (
    <div className="space-y-6">
      <DetailSection
        title="Products"
        description={`${products.length} products offered by this supplier`}
      >
        <DataTable<SupplierProduct>
          columns={columns}
          data={products}
          onRowClick={handleViewProduct}
          pagination={true}
          pageSize={10}
          emptyMessage="No products found"
          className="border-0"
        />
      </DetailSection>

      {/* Delete Confirmation Modal */}
      {selectedProduct && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Product"
          size="sm"
          footer={
            <>
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmDeleteProduct}
              >
                Delete Product
              </Button>
            </>
          }
        >
          <div className="text-sm text-gray-500">
            Are you sure you want to delete "{selectedProduct.name}"? This action cannot be undone.
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SupplierProducts;

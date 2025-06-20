/**
 * Product Details Page
 *
 * This page displays comprehensive product information including images,
 * details, attributes, and variants.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/common/Card';
import StatusBadge from '../components/common/StatusBadge';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

import ImageGallery from '../components/common/ImageGallery';

import useNotification from '../hooks/useNotification';

import { useProducts } from '../features/products';
import { formatCurrency } from '../utils/formatters';
import { ROUTES } from '../constants/routes';
import {
  ArrowLeftIcon,
  PencilIcon,
  CubeIcon,
  TagIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import type { Product } from '../features/products';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showError } = useNotification();
  const { getProductById } = useProducts({ initialFetch: false });

  // Product state
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use refs to store stable references to functions
  const showErrorRef = useRef(showError);
  const navigateRef = useRef(navigate);

  // Update refs when functions change
  useEffect(() => {
    showErrorRef.current = showError;
    navigateRef.current = navigate;
  }, [showError, navigate]);

  // Load product data
  useEffect(() => {
    if (!id) {
      showErrorRef.current('No product ID provided');
      navigateRef.current(ROUTES.SUPPLIERS);
      return;
    }

    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const productData = await getProductById(id);
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product:', error);
        showErrorRef.current('Failed to load product details');
        navigateRef.current(ROUTES.SUPPLIERS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, getProductById]);



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



  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Product not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <div className="mt-6">
          <Button
            variant="primary"
            onClick={() => navigateRef.current(ROUTES.SUPPLIERS)}
            icon={<ArrowLeftIcon className="w-4 h-4" />}
          >
            Back to Suppliers
          </Button>
        </div>
      </div>
    );
  }

  const stockStatus = getStockStatus(product.stock, product.minimumStock, product.status || 'active');

  return (
    <div className="space-y-6">
      <PageHeader
        title={product.name}
        description="Complete product information and details"
        breadcrumbs={[
          { label: 'Suppliers', path: ROUTES.SUPPLIERS },
          { label: product.name }
        ]}
        actions={
          <div className="flex space-x-3">
            <Button
              onClick={() => navigateRef.current(ROUTES.getEditProductRoute(product.id))}
              icon={<PencilIcon className="w-4 h-4" />}
              variant="primary"
            >
              Edit Product
            </Button>
            <Button
              onClick={() => navigateRef.current(-1)}
              icon={<ArrowLeftIcon className="w-4 h-4" />}
              variant="outline"
            >
              Go Back
            </Button>
          </div>
        }
      />

      {/* Product Details View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Images */}
        <Card>
          <ImageGallery
            images={product.images || (product.image ? [product.image] : [])}
            productName={product.name}
            className="h-96"
          />
        </Card>

        {/* Product Information */}
        <Card>
          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
            </div>

            {/* Product Price */}
            <div>
              <span className="text-3xl font-bold text-gray-900">{formatCurrency(product.price)}</span>
            </div>

            {/* Product Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{product.description}</p>
              </div>
            )}

            {/* Stock Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Minimum Stock Level</h4>
                <p className="text-lg font-semibold text-gray-900">{product.minimumStock}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">In Stock Now</h4>
                <div>
                  <p className="text-lg font-semibold text-gray-900">{product.stock}</p>
                  <p className={`text-sm ${stockStatus.color}`}>{stockStatus.text}</p>
                </div>
              </div>
            </div>

            {/* Status and Category */}
            <div className="flex items-center space-x-3">
              <StatusBadge status={getStatusBadgeStatus(product.status || 'active')} type="supplier" />
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {product.category}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Product Attributes Section */}
      {product.attributes && product.attributes.length > 0 && (
        <Card>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <TagIcon className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-medium text-gray-900">Product Attributes</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.attributes.map((attribute) => (
                <div key={attribute.id} className="bg-gray-50 rounded-lg p-4">
                  <dt className="text-sm font-medium text-gray-500">{attribute.name}</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {attribute.type === 'boolean'
                      ? (attribute.value === 'true' ? 'Yes' : 'No')
                      : `${attribute.value}${attribute.unit ? ` ${attribute.unit}` : ''}`
                    }
                  </dd>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Product Variants Section */}
      {product.variants && product.variants.length > 0 && (
        <Card>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <ClipboardDocumentListIcon className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-medium text-gray-900">Product Variants</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.variants.map((variant) => (
                <div key={variant.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3">
                    {variant.image ? (
                      <img
                        src={variant.image}
                        alt={variant.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <CubeIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900">{variant.name}</h3>
                      {variant.sku && <p className="text-xs text-gray-500 font-mono">{variant.sku}</p>}
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {formatCurrency(variant.price)}
                      </p>
                      <p className="text-xs text-gray-600">Stock: {variant.stock}</p>

                      {/* Variant Attributes */}
                      {variant.attributes && (
                        <div className="mt-2 space-y-1">
                          {Object.entries(variant.attributes).map(([key, value]) => (
                            <div key={key} className="flex justify-between text-xs">
                              <span className="text-gray-500 capitalize">{key}:</span>
                              <span className="text-gray-900">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProductDetailsPage;

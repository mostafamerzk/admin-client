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
import ProductEditForm from '../components/common/ProductEditForm';
import useNotification from '../hooks/useNotification';

import { useSuppliers } from '../features/suppliers/hooks/useSuppliers';
import { formatCurrency } from '../utils/formatters';
import { validateForm, validationRules } from '../utils/validation';
import { ROUTES } from '../constants/routes';
import {
  ArrowLeftIcon,
  PencilIcon,
  CubeIcon,
  TagIcon,
  ClipboardDocumentListIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import type { SupplierProduct, ProductAttribute, ProductVariant } from '../features/suppliers/types';

// Form data type that allows File objects for images
interface ProductFormData extends Omit<SupplierProduct, 'images'> {
  images: (File | string)[];
}

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showError, showInfo, showSuccess } = useNotification();
  const { updateProduct, uploadProductImages } = useSuppliers();

  // Product state
  const [product, setProduct] = useState<SupplierProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<ProductFormData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Use refs to store stable references to notification functions
  const showErrorRef = useRef(showError);
  const showInfoRef = useRef(showInfo);
  const showSuccessRef = useRef(showSuccess);
  const navigateRef = useRef(navigate);

  // Update refs when functions change
  useEffect(() => {
    showErrorRef.current = showError;
    showInfoRef.current = showInfo;
    showSuccessRef.current = showSuccess;
    navigateRef.current = navigate;
  }, [showError, showInfo, showSuccess, navigate]);

  // Initialize form data when product loads
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        category: product.category,
        price: product.price,
        stock: product.stock,
        minimumStock: product.minimumStock,
        status: product.status,
        description: product.description || '',
        images: product.images || [],
        attributes: product.attributes || [],
        variants: product.variants || []
      });
    }
  }, [product]);

  // Form handling functions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const processedValue = type === 'number' ? parseFloat(value) || 0 : value;

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImagesChange = (images: (File | string)[]) => {
    setFormData(prev => ({
      ...prev,
      images
    }));
  };

  const handleAttributesChange = (attributes: ProductAttribute[]) => {
    setFormData(prev => ({
      ...prev,
      attributes
    }));
  };

  const handleVariantsChange = (variants: ProductVariant[]) => {
    setFormData(prev => ({
      ...prev,
      variants
    }));
  };

  const validateFormData = () => {
    const validationErrors = validateForm(formData, {
      name: [validationRules.required('Product name is required')],
      sku: [validationRules.required('SKU is required'), validationRules.sku()],
      category: [validationRules.required('Category is required')],
      price: [validationRules.required('Price is required'), validationRules.price()],
      stock: [validationRules.required('Stock is required'), validationRules.stock()],
      minimumStock: [
        validationRules.required('Minimum stock is required'),
        validationRules.minimumStock(),
        validationRules.stockConsistency()
      ]
    });

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    // Reset form data to original product data
    if (product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        category: product.category,
        price: product.price,
        stock: product.stock,
        minimumStock: product.minimumStock,
        status: product.status,
        description: product.description || '',
        images: product.images || [],
        attributes: product.attributes || [],
        variants: product.variants || []
      });
    }
  };

  const handleSave = async () => {
    if (!validateFormData() || !product || !id) {
      return;
    }

    setIsSaving(true);
    try {
      // Separate files from URLs in images
      const imageFiles = formData.images?.filter((img): img is File => img instanceof File) || [];
      const imageUrls = formData.images?.filter((img): img is string => typeof img === 'string') || [];

      // Upload new images if any
      let uploadedImageUrls: string[] = [];
      if (imageFiles.length > 0) {
        const uploadResult = await uploadProductImages(id, imageFiles);
        uploadedImageUrls = uploadResult.imageUrls;
      }

      // Combine existing URLs with newly uploaded URLs
      const allImageUrls = [...imageUrls, ...uploadedImageUrls];

      // Prepare update data
      const updateData: Partial<SupplierProduct> = {};
      if (formData.name) updateData.name = formData.name;
      if (formData.sku) updateData.sku = formData.sku;
      if (formData.category) updateData.category = formData.category;
      if (formData.price !== undefined) updateData.price = formData.price;
      if (formData.stock !== undefined) updateData.stock = formData.stock;
      if (formData.minimumStock !== undefined) updateData.minimumStock = formData.minimumStock;
      if (formData.status) updateData.status = formData.status;
      if (formData.description !== undefined) updateData.description = formData.description;
      if (allImageUrls.length > 0) updateData.images = allImageUrls;
      if (formData.attributes) updateData.attributes = formData.attributes;
      if (formData.variants) updateData.variants = formData.variants;

      // Update product
      const updatedProduct = await updateProduct(id, updateData);
      setProduct(updatedProduct);
      setIsEditing(false);
      showSuccessRef.current('Product updated successfully');

    } catch (error) {
      console.error('Error updating product:', error);
      showErrorRef.current('Failed to update product');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!id) {
      showErrorRef.current('No product ID provided');
      navigateRef.current(ROUTES.SUPPLIERS);
      return;
    }

    // Mock data for development - replace with actual API call
    const fetchProduct = async () => {
      try {
        setIsLoading(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock product data with extended fields
        const mockProduct: SupplierProduct = {
          id: id,
          name: 'Wireless Bluetooth Headphones Pro',
          sku: 'WBH-PRO-001',
          category: 'Electronics',
          price: 199.99,
          stock: 85,
          minimumStock: 10,
          status: 'active',
          description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality. Perfect for music lovers and professionals who demand the best audio experience.',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
          images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=400&h=400&fit=crop'
          ],
          attributes: [
            { id: '1', name: 'Brand', value: 'AudioTech', type: 'text' },
            { id: '2', name: 'Weight', value: '250', type: 'number', unit: 'grams' },
            { id: '3', name: 'Battery Life', value: '30', type: 'number', unit: 'hours' },
            { id: '4', name: 'Wireless', value: 'true', type: 'boolean' },
            { id: '5', name: 'Noise Cancellation', value: 'Active', type: 'select' },
            { id: '6', name: 'Frequency Response', value: '20Hz - 20kHz', type: 'text' }
          ],
          variants: [
            {
              id: '1',
              name: 'Black',
              sku: 'WBH-PRO-001-BLK',
              price: 199.99,
              stock: 45,
              attributes: { color: 'Black', size: 'Standard' },
              image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop'
            },
            {
              id: '2',
              name: 'White',
              sku: 'WBH-PRO-001-WHT',
              price: 199.99,
              stock: 25,
              attributes: { color: 'White', size: 'Standard' },
              image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=150&h=150&fit=crop'
            },
            {
              id: '3',
              name: 'Silver',
              sku: 'WBH-PRO-001-SLV',
              price: 219.99,
              stock: 15,
              attributes: { color: 'Silver', size: 'Standard' },
              image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=150&h=150&fit=crop'
            }
          ],
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-20T14:45:00Z'
        };

        setProduct(mockProduct);
      } catch (error) {
        console.error('Error fetching product:', error);
        showErrorRef.current('Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Helper functions for dynamic arrays
  const createEmptyAttribute = (): ProductAttribute => ({
    id: `attr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    name: '',
    value: '',
    type: 'text'
  });

  const createEmptyVariant = (): ProductVariant => ({
    id: `var_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    name: '',
    sku: '',
    price: 0,
    stock: 0,
    attributes: {}
  });

  // Attribute field configurations
  const attributeFieldConfigs = [
    { name: 'name', label: 'Attribute Name', type: 'text' as const, required: true, placeholder: 'e.g., Brand, Weight, Color' },
    { name: 'value', label: 'Value', type: 'text' as const, required: true, placeholder: 'e.g., AudioTech, 250g, Black' },
    { name: 'type', label: 'Type', type: 'select' as const, required: true, options: [
      { value: 'text', label: 'Text' },
      { value: 'number', label: 'Number' },
      { value: 'boolean', label: 'Boolean' },
      { value: 'select', label: 'Select' }
    ]},
    { name: 'unit', label: 'Unit (Optional)', type: 'text' as const, placeholder: 'e.g., grams, hours, cm' }
  ];

  // Variant field configurations
  const variantFieldConfigs = [
    { name: 'name', label: 'Variant Name', type: 'text' as const, required: true, placeholder: 'e.g., Black, Large, Premium' },
    { name: 'sku', label: 'SKU', type: 'text' as const, required: true, placeholder: 'e.g., WBH-PRO-001-BLK' },
    { name: 'price', label: 'Price', type: 'number' as const, required: true, placeholder: '0.00' },
    { name: 'stock', label: 'Stock', type: 'number' as const, required: true, placeholder: '0' }
  ];

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

  const stockStatus = getStockStatus(product.stock, product.minimumStock, product.status);

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
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  icon={<CheckIcon className="w-4 h-4" />}
                  variant="primary"
                  loading={isSaving}
                  disabled={isSaving}
                >
                  Save Changes
                </Button>
                <Button
                  onClick={handleCancel}
                  icon={<XMarkIcon className="w-4 h-4" />}
                  variant="outline"
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleEdit}
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
              </>
            )}
          </div>
        }
      />

      {isEditing ? (
        /* Edit Form */
        <ProductEditForm
          formData={formData}
          errors={errors}
          onInputChange={handleInputChange}
          onImagesChange={handleImagesChange}
          onAttributesChange={handleAttributesChange}
          onVariantsChange={handleVariantsChange}
          createEmptyAttribute={createEmptyAttribute}
          createEmptyVariant={createEmptyVariant}
          attributeFieldConfigs={attributeFieldConfigs}
          variantFieldConfigs={variantFieldConfigs}
          disabled={isSaving}
        />
      ) : (
        /* View Mode */
        <>
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
                  <StatusBadge status={getStatusBadgeStatus(product.status)} type="supplier" />
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {product.category}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}

      {/* Product Attributes Section - Only show in view mode */}
      {!isEditing && product.attributes && product.attributes.length > 0 && (
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

      {/* Product Variants Section - Only show in view mode */}
      {!isEditing && product.variants && product.variants.length > 0 && (
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
                      <p className="text-xs text-gray-500 font-mono">{variant.sku}</p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {formatCurrency(variant.price)}
                      </p>
                      <p className="text-xs text-gray-600">Stock: {variant.stock}</p>

                      {/* Variant Attributes */}
                      <div className="mt-2 space-y-1">
                        {Object.entries(variant.attributes).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-xs">
                            <span className="text-gray-500 capitalize">{key}:</span>
                            <span className="text-gray-900">{value}</span>
                          </div>
                        ))}
                      </div>
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

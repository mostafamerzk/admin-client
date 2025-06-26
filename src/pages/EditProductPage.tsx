/**
 * Edit Product Page
 *
 * This page provides a comprehensive form for editing product details including images,
 * attributes, and variants.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';

import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProductEditForm from '../components/common/ProductEditForm';
import useNotification from '../hooks/useNotification';

import { useProducts } from '../features/products';
import { validateForm, validationRules, validateVariants, validateAttributes } from '../utils/validation';
import { ROUTES } from '../constants/routes';
import {
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon,
  CubeIcon
} from '@heroicons/react/24/outline';
import type {
  Product,
  FrontendProductFormData,
  ProductAttribute,
  ProductVariant
} from '../features/products';

const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotification();
  const { getProductById, updateProductUnified } = useProducts({ initialFetch: false });

  // Product state
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Omit<FrontendProductFormData, 'images'> & { images?: (File | string)[] }>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [removedImageUrls, setRemovedImageUrls] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);

  // Use refs to store stable references to functions
  const showErrorRef = useRef(showError);
  const showSuccessRef = useRef(showSuccess);
  const navigateRef = useRef(navigate);

  // Update refs when functions change
  useEffect(() => {
    showErrorRef.current = showError;
    showSuccessRef.current = showSuccess;
    navigateRef.current = navigate;
  }, [showError, showSuccess, navigate]);

  // Initialize form data when product loads
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        category: product.category,
        price: Number(product.price) || 0,
        stock: Number(product.stock) || 0,
        minimumStock: Number(product.minimumStock) || 0,
        status: product.status || 'active',
        description: product.description || undefined,
        supplierId: product.supplierId,
        images: product.images || [],
        attributes: product.attributes || [],
        variants: product.variants || []
      });
    }
  }, [product]);

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

  // Form handling functions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // Ensure numeric values are properly converted and never NaN
    const processedValue = type === 'number' ? (isNaN(parseFloat(value)) ? 0 : parseFloat(value)) : value;

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
    // Separate new files from existing URLs
    const newFiles = images.filter((img): img is File => img instanceof File);
    const existingUrls = images.filter((img): img is string => typeof img === 'string');

    // Track which existing images were removed
    if (product?.images) {
      const removedUrls = product.images.filter(url => !existingUrls.includes(url));
      setRemovedImageUrls(prev => Array.from(new Set([...prev, ...removedUrls])));
    }

    // Update new images state
    setNewImages(newFiles);

    setFormData(prev => ({
      ...prev,
      images,
      newImages: newFiles,
      imagesToDelete: removedImageUrls
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
      // SKU is auto-generated by backend, so no validation needed
      category: [validationRules.required('Category is required')],
      price: [validationRules.required('Price is required'), validationRules.price()],
      stock: [validationRules.required('Stock is required'), validationRules.stock()],
      minimumStock: [
        validationRules.required('Minimum stock is required'),
        validationRules.minimumStock(),
        validationRules.stockConsistency()
      ],
      supplierId: [validationRules.required('Supplier is required')]
    });

    // Validate variants if they exist
    if (formData.variants && formData.variants.length > 0) {
      const variantErrors = validateVariants(formData.variants);
      if (variantErrors.length > 0) {
        validationErrors.variants = variantErrors.join(', ');
      }
    }

    // Validate attributes if they exist
    if (formData.attributes && formData.attributes.length > 0) {
      const attributeErrors = validateAttributes(formData.attributes);
      if (attributeErrors.length > 0) {
        validationErrors.attributes = attributeErrors.join(', ');
      }
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleCancel = () => {
    navigateRef.current(ROUTES.getProductDetailsRoute(id!));
  };

  const handleSave = async () => {
    // Priority 1: Validate form data first - if invalid, stop everything
    if (!validateFormData() || !product || !id) {
      return;
    }

    setIsSaving(true);
    try {
      // Prepare update data using the unified API pattern
      // Ensure all numeric values are properly validated and converted
      const updateData = {
        name: formData.name!,
        sku: formData.sku || undefined,
        category: formData.category!,
        categoryId: product.categoryId, // Use existing category ID
        price: Number(formData.price) || 0,
        stock: Number(formData.stock) || 0,
        minimumStock: Number(formData.minimumStock) || 0,
        status: formData.status || 'active',
        description: formData.description,
        supplierId: formData.supplierId!,
        attributes: formData.attributes,
        variants: formData.variants,
        // New unified API fields
        newImages: newImages, // New images to upload
        imagesToDelete: removedImageUrls // Images to delete
      };

      // Update product using unified API method
      const updatedProduct = await updateProductUnified(id, updateData, false); // Suppress hook notifications

      // Update local product state
      setProduct(updatedProduct);

      // Clear state
      setRemovedImageUrls([]);
      setNewImages([]);

      // Show single consolidated success message
      showSuccessRef.current('Changes made successfully');

      // Navigate back to product details
      navigateRef.current(ROUTES.getProductDetailsRoute(id));

    } catch (error) {
      console.error('Error updating product:', error);
      // Show consolidated error message for data update failures
      showErrorRef.current('Failed to save changes. Please check your data and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Helper functions for dynamic arrays
  const createEmptyAttribute = (): ProductAttribute => ({
    id: `attr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    name: '',
    value: '',
    type: 'text',
    unit: undefined
  });

  const createEmptyVariant = (): ProductVariant => ({
    id: `var_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    name: '',
    sku: '',
    price: 0.01, // Set minimum price to avoid validation errors
    stock: 0,
    attributes: {},
    image: undefined
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
          The product you're trying to edit doesn't exist or has been removed.
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

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit ${product.name}`}
        description="Update product information, images, attributes, and variants"
        breadcrumbs={[
          { label: 'Suppliers', path: ROUTES.SUPPLIERS },
          { label: product.name, path: ROUTES.getProductDetailsRoute(product.id) },
          { label: 'Edit' }
        ]}
        actions={
          <div className="flex space-x-3">
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
          </div>
        }
      />

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
    </div>
  );
};

export default EditProductPage;

/**
 * Category Details Page
 *
 * This page displays comprehensive category information including details and products.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import DetailSection from '../components/common/DetailSection';
import DataTable from '../components/common/DataTable';
import type { Column } from '../components/common/DataTable';
import {
  PencilIcon,
  TrashIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  EyeIcon,
  TagIcon,
  DocumentTextIcon,
  CubeIcon,
  CalendarIcon,
  NoSymbolIcon
} from '@heroicons/react/24/outline';
import { useCategories, Category, AddCategoryForm, CategoryFormData } from '../features/categories';
import { useProducts, Product } from '../features/products';
import { ROUTES } from '../constants/routes';
import useNotification from '../hooks/useNotification';
import { formatDate, formatCurrency } from '../utils/formatters';

const CategoryDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCategoryById, deleteCategory, updateCategory, updateCategoryStatus } = useCategories();
  const { getProductsByCategory, updateProductStatus } = useProducts({ initialFetch: false });
  const { showNotification } = useNotification();

  const [category, setCategory] = useState<Category | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use refs to store stable references to functions and avoid infinite loops
  const getCategoryByIdRef = useRef(getCategoryById);
  const getProductsByCategoryRef = useRef(getProductsByCategory);
  const showNotificationRef = useRef(showNotification);
  const navigateRef = useRef(navigate);

  // Update refs when functions change
  useEffect(() => {
    getCategoryByIdRef.current = getCategoryById;
    getProductsByCategoryRef.current = getProductsByCategory;
    showNotificationRef.current = showNotification;
    navigateRef.current = navigate;
  });



  // Load category data
  useEffect(() => {
    if (!id) {
      showNotificationRef.current({
        type: 'error',
        title: 'Error',
        message: 'No category ID provided'
      });
      navigateRef.current(ROUTES.CATEGORIES);
      return;
    }

    const fetchCategory = async () => {
      try {
        setIsLoading(true);
        console.log(`[CategoryDetailsPage] Fetching category ${id}`);
        const categoryData = await getCategoryByIdRef.current(id);
        setCategory(categoryData);

        // Fetch products for this category using products API
        console.log('[CategoryDetailsPage] Fetching category products');
        setProductsLoading(true);
        const categoryIdNumber = parseInt(id, 10);
        if (!isNaN(categoryIdNumber)) {
          const products = await getProductsByCategoryRef.current(categoryIdNumber);
          setCategoryProducts(products);
        }
      } catch (error) {
        console.error('Error fetching category:', error);
        showNotificationRef.current({
          type: 'error',
          title: 'Error',
          message: 'Failed to load category details'
        });
        navigateRef.current(ROUTES.CATEGORIES);
      } finally {
        setIsLoading(false);
        setProductsLoading(false);
      }
    };

    fetchCategory();
  }, [id]); // Only depend on id, which is stable

  const handleDeleteCategory = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!category) return;

    try {
      await deleteCategory(category.id);
      setIsDeleteModalOpen(false);
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'Category deleted successfully'
      });
      navigate(ROUTES.CATEGORIES);
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete category'
      });
    }
  }, [category, deleteCategory, showNotification, navigate]);

  const handleEditCategory = useCallback(() => {
    setIsEditModalOpen(true);
  }, []);

  const handleUpdateCategory = useCallback(async (categoryData: CategoryFormData) => {
    if (!category) return;

    setIsSubmitting(true);
    try {
      // Use atomic update operation - single API call handles both data and image
      const updatedCategory = await updateCategory(category.id, categoryData);

      setCategory(updatedCategory);
      setIsEditModalOpen(false);

      // Show appropriate success message based on whether image was included
      const hasImageUpdate = categoryData.image instanceof File;
      showNotification({
        type: 'success',
        title: 'Success',
        message: hasImageUpdate
          ? 'Category updated successfully with new image'
          : 'Category updated successfully'
      });
    } catch (error) {
      console.error('Error updating category:', error);

      // Handle specific error types for better user experience
      const errorMessage = error instanceof Error ? error.message : 'Failed to update category';
      let userMessage = 'Failed to update category. Please try again.';

      if (errorMessage.includes('Failed to upload image')) {
        userMessage = 'Image upload failed. Please try with a different image.';
      } else if (errorMessage.includes('Category name already exists')) {
        userMessage = 'A category with this name already exists.';
      } else if (errorMessage.includes('Category not found')) {
        userMessage = 'Category not found.';
      }

      showNotification({
        type: 'error',
        title: 'Error',
        message: userMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [category, updateCategory, showNotification]);

  const handleToggleStatus = useCallback(async () => {
    if (!category || !category.status) return;

    const newStatus = category.status === 'active' ? 'inactive' : 'active';

    try {
      const updatedCategory = await updateCategoryStatus(category.id, newStatus);
      setCategory(updatedCategory);
      showNotification({
        type: 'success',
        title: 'Success',
        message: `Category ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`
      });
    } catch (error) {
      console.error('Error updating category status:', error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update category status'
      });
    }
  }, [category, updateCategoryStatus, showNotification]);

  const handleViewProduct = useCallback((product: Product) => {
    navigate(ROUTES.getProductDetailsRoute(product.id), {
      state: { fromCategory: true }
    });
  }, [navigate]);

  const handleToggleProductStatus = useCallback(async (product: Product) => {
    if (!product.status || !id) return;

    const newStatus = product.status === 'active' ? 'inactive' : 'active';

    try {
      await updateProductStatus(product.id, newStatus);

      // Refresh category products to reflect the status change
      const categoryIdNumber = parseInt(id, 10);
      if (!isNaN(categoryIdNumber)) {
        setProductsLoading(true);
        const updatedProducts = await getProductsByCategory(categoryIdNumber);
        setCategoryProducts(updatedProducts);
        setProductsLoading(false);
      }

      showNotification({
        type: 'success',
        title: 'Success',
        message: `Product ${newStatus === 'active' ? 'activated' : 'banned'} successfully`
      });
    } catch (error) {
      console.error('Error updating product status:', error);
      setProductsLoading(false);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update product status'
      });
    }
  }, [updateProductStatus, getProductsByCategory, showNotification, id]);

  // Define products DataTable columns
  const productColumns: Column<Product>[] = [
    {
      key: 'name',
      label: 'Product Name',
      sortable: true,
      render: (_value: string, product: Product) => (
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
            <div className="text-xs text-gray-500">SKU: {product.sku}</div>
          </div>
        </div>
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
      render: (value: number) => (
        <span className="font-medium text-gray-900">{value}</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === 'active' ? 'bg-green-100 text-green-800' : 
          value === 'inactive' ? 'bg-red-100 text-red-800' : 
          'bg-yellow-100 text-yellow-800'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_value: any, product: Product) => (
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
            variant={product.status === 'active' ? 'outline' : 'success'}
            size="xs"
            onClick={() => handleToggleProductStatus(product)}
            icon={product.status === 'active' ? <NoSymbolIcon className="w-4 h-4" /> : <NoSymbolIcon className="w-4 h-4" />}
            title={product.status === 'active' ? 'Ban product' : 'Unban product'}
          >
            {product.status === 'active' ? 'Ban' : 'Unban'}
          </Button>
        </div>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-500">Loading category details...</span>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Category not found</h2>
        <p className="mt-2 text-gray-600">The category you're looking for doesn't exist.</p>
        <Button
          className="mt-4"
          onClick={() => navigate(ROUTES.CATEGORIES)}
        >
          Back to Categories
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={category.name}
        description="Category details and products"
        breadcrumbs={[
          { label: 'Categories', path: ROUTES.CATEGORIES },
          { label: category.name }
        ]}
        actions={
          <div className="flex space-x-3">
            <Button
              onClick={handleDeleteCategory}
              icon={<TrashIcon className="w-4 h-4" />}
              variant="danger"
            >
              Delete Category
            </Button>
            <Button
              onClick={handleEditCategory}
              icon={<PencilIcon className="w-4 h-4" />}
              variant="outline"
            >
              Edit Category
            </Button>
            <Button
              onClick={handleToggleStatus}
              icon={(category.status === 'active') ? <ShieldExclamationIcon className="w-4 h-4" /> : <ShieldCheckIcon className="w-4 h-4" />}
              variant={(category.status === 'active') ? 'outline' : 'success'}
              disabled={!category.status}
            >
              {(category.status === 'active') ? 'Ban Category' : 'Unban Category'}
            </Button>
          </div>
        }
      />

      {/* Category Information Section */}
      <DetailSection
        title="Category Information"
        description="Complete category details and metadata"
      >
        <div className="px-6 py-4">
          <div className="flex items-center space-x-6 mb-6">
            <div className="flex-shrink-0">
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-20 w-20 rounded-lg object-cover"
                />
              ) : (
                <div className="h-20 w-20 bg-gray-200 rounded-lg flex items-center justify-center">
                  <TagIcon className="h-10 w-10 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-500 mt-1">ID: {category.id}</p>
              <div className="mt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  category.status === 'active' ? 'bg-green-100 text-green-800' :
                  category.status === 'inactive' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {category.status ? category.status.charAt(0).toUpperCase() + category.status.slice(1) : 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <DocumentTextIcon className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-500">Description</div>
                  <div className="text-sm text-gray-900">{category.description || 'No description provided'}</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <CubeIcon className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-500">Product Count</div>
                  <div className="text-sm text-gray-900">{categoryProducts.length}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <CalendarIcon className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-500">Created Date</div>
                  <div className="text-sm text-gray-900">{formatDate(category.createdAt)}</div>
                </div>
              </div>

              <div className="flex items-start">
                <CalendarIcon className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-500">Last Updated</div>
                  <div className="text-sm text-gray-900">{formatDate(category.updatedAt)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DetailSection>

      {/* Products Section */}
      <DetailSection
        title="Products"
        description={`${categoryProducts.length} products in this category`}
      >
        <DataTable<Product>
          columns={productColumns}
          data={categoryProducts}
          onRowClick={handleViewProduct}
          loading={productsLoading}
          pagination={true}
          pageSize={10}
          emptyMessage="No products found in this category"
          selectable={false}
          className="border-0"
        />
      </DetailSection>

      {/* Edit Category Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Category"
      >
        <AddCategoryForm
          onSubmit={handleUpdateCategory}
          onCancel={() => setIsEditModalOpen(false)}
          isLoading={isSubmitting}
          initialData={{
            name: category.name,
            description: category.description || '',
            status: category.status || 'active'
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Category"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete the category "{category.name}"?
            This action cannot be undone and will affect all products in this category.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CategoryDetailsPage;

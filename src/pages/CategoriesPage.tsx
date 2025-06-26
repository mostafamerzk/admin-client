/**
 * Categories Page
 *
 * This page displays and manages categories in the system.
 */

import React, { useState, useCallback, memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import DataTable from '../components/common/DataTable';
import type { Column } from '../components/common/DataTable';
import {
  PlusIcon,
  EyeIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import {
  AddCategoryForm,
  useCategories,
  Category,
  CategoryFormData,
  CategoryFilter
} from '../features/categories';
import { ROUTES } from '../constants/routes';
import useNotification from '../hooks/useNotification';
import { formatDate } from '../utils/formatters';

const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { categories, isLoading, deleteEntity, createCategory } = useCategories();
  const { showNotification } = useNotification();

  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoize filtered categories to prevent unnecessary recalculations
  const filteredCategories = useMemo(() => {
    if (activeFilter === 'all') return categories;
    return categories.filter(category => category.status === activeFilter);
  }, [categories, activeFilter]);

  // Memoize event handlers to prevent unnecessary re-renders
  const handleCategoryClick = useCallback((category: Category) => {
    navigate(ROUTES.getCategoryDetailsRoute(category.id));
  }, [navigate]);

  const handleViewCategory = useCallback((category: Category) => {
    navigate(ROUTES.getCategoryDetailsRoute(category.id));
  }, [navigate]);

  const handleDeleteCategory = useCallback((category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedCategory) return;

    try {
      await deleteEntity(selectedCategory.id);
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'Category deleted successfully'
      });
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete category'
      });
    }
  }, [selectedCategory, deleteEntity, showNotification]);

  const handleAddCategory = useCallback(async (categoryData: CategoryFormData) => {
    setIsSubmitting(true);
    try {
      console.log('Creating category:', categoryData);

      // Create category with all data including image in one request
      await createCategory(categoryData);

      setIsAddCategoryModalOpen(false);
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'Category added successfully'
      });
    } catch (error) {
      console.error('Error creating category:', error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to add category'
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [createCategory, showNotification]);

  // Define DataTable columns
  const columns: Column<Category>[] = [
    {
      key: 'name',
      label: 'Category Name',
      sortable: true,
      render: (_value: string, category: Category) => (
        <div className="flex items-center">
          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              className="h-10 w-10 rounded-lg object-cover mr-3"
            />
          ) : (
            <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
              <TagIcon className="h-5 w-5 text-gray-400" />
            </div>
          )}
          <div>
            <div className="font-medium text-gray-900">{category.name}</div>
            <div className="text-xs text-gray-500">ID: {category.id}</div>
          </div>
        </div>
      )
    },
    {
      key: 'productCount',
      label: 'Products',
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
        <div className="flex items-center">
          {value === 'active' ? (
            <CheckCircleIcon className="w-4 h-4 text-green-500 mr-1" />
          ) : (
            <XCircleIcon className="w-4 h-4 text-red-500 mr-1" />
          )}
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Created Date',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm text-gray-600">{formatDate(value)}</span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_value: any, category: Category) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="xs"
            onClick={() => handleViewCategory(category)}
            icon={<EyeIcon className="w-4 h-4" />}
            title="View category details"
          >
            View
          </Button>
          <Button
            variant="danger"
            size="xs"
            onClick={() => handleDeleteCategory(category)}
            icon={<TrashIcon className="w-4 h-4" />}
            title="Delete category"
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Manage product categories"
        actions={
          <Button
            icon={<PlusIcon className="h-5 w-5" />}
            onClick={() => setIsAddCategoryModalOpen(true)}
          >
            Add New Category
          </Button>
        }
      />

      <Card>
        <CategoryFilter
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        <DataTable<Category>
          columns={columns}
          data={filteredCategories}
          onRowClick={handleCategoryClick}
          loading={isLoading}
          pagination={true}
          pageSize={10}
          emptyMessage="No categories found"
          selectable={false}
        />
      </Card>

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        title="Add New Category"
      >
        <AddCategoryForm
          onSubmit={handleAddCategory}
          onCancel={() => setIsAddCategoryModalOpen(false)}
          isLoading={isSubmitting}
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
            Are you sure you want to delete the category "{selectedCategory?.name}"?
            This action cannot be undone.
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

export default memo(CategoriesPage);

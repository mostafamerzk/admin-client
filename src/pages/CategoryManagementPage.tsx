/**
 * Category Management Page
 *
 * This page provides a comprehensive interface for managing the three-level hierarchy:
 * Categories → Subcategories → Products
 */

import React, { useState, useCallback, memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { 
  useCategories,
  Category,
  CategoryFormData,
  AddCategoryForm
} from '../features/categories';
import CategoryHierarchyView from '../components/categories/CategoryHierarchyView';
import AddSubcategoryForm from '../components/categories/AddSubcategoryForm';
import { ROUTES } from '../constants/routes';
import useNotification from '../hooks/useNotification';
import type { SubcategoryFormData } from '../features/categories/types';

const CategoryManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { categories, isLoading, fetchCategories } = useCategories();
  const { showNotification } = useNotification();
  
  // Modal states
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isAddSubcategoryModalOpen, setIsAddSubcategoryModalOpen] = useState(false);
  const [selectedCategoryForSubcategory, setSelectedCategoryForSubcategory] = useState<Category | null>(null);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'supplier' | 'customer'>('all');

  // Memoized filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter(category => {
      // Status filter
      if (statusFilter !== 'all' && category.status !== statusFilter) {
        return false;
      }
      
      // Visibility filter
      if (visibilityFilter === 'supplier' && !category.visibleInSupplierApp) {
        return false;
      }
      if (visibilityFilter === 'customer' && !category.visibleInCustomerApp) {
        return false;
      }
      
      return true;
    });
  }, [categories, statusFilter, visibilityFilter]);

  // Event handlers
  const handleAddCategory = useCallback(async (categoryData: CategoryFormData) => {
    try {
      // TODO: Implement actual API call
      console.log('Adding category:', categoryData);
      setIsAddCategoryModalOpen(false);
      await fetchCategories();
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'Category added successfully'
      });
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to add category'
      });
    }
  }, [fetchCategories, showNotification]);

  const handleAddSubcategory = useCallback(async (subcategoryData: SubcategoryFormData) => {
    try {
      // TODO: Implement actual API call
      console.log('Adding subcategory:', subcategoryData);
      setIsAddSubcategoryModalOpen(false);
      setSelectedCategoryForSubcategory(null);
      await fetchCategories();
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'Subcategory added successfully'
      });
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to add subcategory'
      });
    }
  }, [fetchCategories, showNotification]);

  const handleDeleteCategory = useCallback(async (categoryId: string) => {
    try {
      // TODO: Implement actual API call
      console.log('Deleting category:', categoryId);
      await fetchCategories();
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
  }, [fetchCategories, showNotification]);

  const handleDeleteSubcategory = useCallback(async (subcategoryId: string) => {
    try {
      // TODO: Implement actual API call
      console.log('Deleting subcategory:', subcategoryId);
      await fetchCategories();
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'Subcategory deleted successfully'
      });
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete subcategory'
      });
    }
  }, [fetchCategories, showNotification]);

  const handleToggleCategoryVisibility = useCallback(async (categoryId: string, app: 'supplier' | 'customer') => {
    try {
      // TODO: Implement actual API call
      console.log('Toggling category visibility:', categoryId, app);
      await fetchCategories();
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'Category visibility updated'
      });
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update category visibility'
      });
    }
  }, [fetchCategories, showNotification]);

  const handleToggleSubcategoryVisibility = useCallback(async (subcategoryId: string, app: 'supplier' | 'customer') => {
    try {
      // TODO: Implement actual API call
      console.log('Toggling subcategory visibility:', subcategoryId, app);
      await fetchCategories();
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'Subcategory visibility updated'
      });
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update subcategory visibility'
      });
    }
  }, [fetchCategories, showNotification]);

  const handleProductClick = useCallback((productId: string) => {
    navigate(ROUTES.getProductDetailsRoute(productId));
  }, [navigate]);

  const handleRequestAddSubcategory = useCallback((category: Category) => {
    setSelectedCategoryForSubcategory(category);
    setIsAddSubcategoryModalOpen(true);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Category Management"
        description="Manage categories, subcategories, and their visibility in supplier and customer apps"
        actions={
          <div className="flex space-x-3">
            <Button
              variant="outline"
              icon={<FunnelIcon className="h-5 w-5" />}
              onClick={() => {/* TODO: Implement filter modal */}}
            >
              Filters
            </Button>
            <Button
              icon={<PlusIcon className="h-5 w-5" />}
              onClick={() => setIsAddCategoryModalOpen(true)}
            >
              Add Category
            </Button>
          </div>
        }
      />

      {/* Filter Controls */}
      <Card>
        <div className="flex flex-wrap gap-4 p-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value as 'all' | 'supplier' | 'customer')}
              className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            >
              <option value="all">All Apps</option>
              <option value="supplier">Supplier App Only</option>
              <option value="customer">Customer App Only</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Category Hierarchy */}
      <CategoryHierarchyView
        categories={filteredCategories}
        onDeleteCategory={handleDeleteCategory}
        onDeleteSubcategory={handleDeleteSubcategory}
        onToggleCategoryVisibility={handleToggleCategoryVisibility}
        onToggleSubcategoryVisibility={handleToggleSubcategoryVisibility}
        onProductClick={handleProductClick}
        onAddSubcategory={handleRequestAddSubcategory}
      />

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        title="Add Category"
      >
        <AddCategoryForm
          onSubmit={handleAddCategory}
          onCancel={() => setIsAddCategoryModalOpen(false)}
        />
      </Modal>

      {/* Add Subcategory Modal */}
      <Modal
        isOpen={isAddSubcategoryModalOpen}
        onClose={() => {
          setIsAddSubcategoryModalOpen(false);
          setSelectedCategoryForSubcategory(null);
        }}
        title={`Add Subcategory to ${selectedCategoryForSubcategory?.name || ''}`}
      >
        {selectedCategoryForSubcategory && (
          <AddSubcategoryForm
            categoryId={selectedCategoryForSubcategory.id}
            onSubmit={handleAddSubcategory}
            onCancel={() => {
              setIsAddSubcategoryModalOpen(false);
              setSelectedCategoryForSubcategory(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default memo(CategoryManagementPage);

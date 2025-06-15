/**
 * Categories Page
 *
 * This page displays and manages categories in the system.
 */

import React, { useState, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { PlusIcon } from '@heroicons/react/24/outline';
import {
  CategoryList,
  AddCategoryForm,
  useCategories,
  Category
} from '../features/categories';
import { ROUTES } from '../constants/routes';
import useNotification from '../hooks/useNotification';

const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { categories, isLoading, fetchCategories } = useCategories();
  const { showNotification } = useNotification();
  
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  


  // Memoize event handlers to prevent unnecessary re-renders
  const handleCategoryClick = useCallback((category: Category) => {
    navigate(ROUTES.getCategoryDetailsRoute(category.id));
  }, [navigate]);

  const handleAddCategory = useCallback(async (_categoryData: any) => {
    try {
      // Implementation
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
            Add Category
          </Button>
        }
      />
      
      <Card>
        <CategoryList
          categories={categories}
          onCategoryClick={handleCategoryClick}
          loading={isLoading}
        />
      </Card>
      
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
    </div>
  );
};

export default memo(CategoriesPage);

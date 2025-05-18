/**
 * Categories Page
 *
 * This page displays and manages categories in the system.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { PlusIcon } from '@heroicons/react/24/outline';
import { 
  CategoryList, 
  CategoryTree,
  CategoryDetails, 
  AddCategoryForm,
  useCategories,
  Category
} from '../features/categories';
import { ROUTES } from '../constants/routes';
import useNotification from '../hooks/useNotification';

const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { categories, isLoading, fetchCategories, getCategoryHierarchy } = useCategories();
  const { showNotification } = useNotification();
  
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'tree'>('list');
  
  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    navigate(ROUTES.getCategoryDetailsRoute(category.id));
  };
  
  const handleAddCategory = async (categoryData: any) => {
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
  };
  
  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Manage product categories"
        actions={
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setViewMode(viewMode === 'list' ? 'tree' : 'list')}
            >
              {viewMode === 'list' ? 'Tree View' : 'List View'}
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
      
      <Card>
        {viewMode === 'list' ? (
          <CategoryList
            categories={categories}
            onCategoryClick={handleCategoryClick}
            loading={isLoading}
          />
        ) : (
          <CategoryTree
            categories={categories}
            onCategorySelect={handleCategoryClick}
            selectedCategoryId={selectedCategory?.id}
          />
        )}
      </Card>
      
      <Modal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        title="Add Category"
      >
        <AddCategoryForm
          onSubmit={handleAddCategory}
          onCancel={() => setIsAddCategoryModalOpen(false)}
          parentCategories={categories.filter(c => !c.parentId)}
        />
      </Modal>
    </div>
  );
};

export default CategoriesPage;

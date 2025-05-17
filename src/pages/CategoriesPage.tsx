/**
 * Categories Page
 *
 * This page displays and manages categories in the system.
 */

import React, { useState } from 'react';
import Card from '../components/common/Card.tsx';
import Button from '../components/common/Button.tsx';
import Modal from '../components/common/Modal.tsx';
import PageHeader from '../components/layout/PageHeader.tsx';
import { PlusIcon } from '@heroicons/react/24/outline';
import {
  CategoryList,
  CategoryDetails,
  CategoryFilter,
  AddCategoryForm,
  Category,
  CategoryFormData,
  getMockCategories
} from '../features/categories/index.ts';

const CategoriesPage: React.FC = () => {
  // In a real implementation, we would use the useCategories hook
  // const { categories, isLoading, createCategory, updateCategory, deleteCategory } = useCategories();

  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isCategoryDetailsModalOpen, setIsCategoryDetailsModalOpen] = useState(false);

  // Use mock data from the centralized mock data file
  const [categories, setCategories] = useState<Category[]>(getMockCategories());

  const filteredCategories = categories.filter(category => {
    if (activeFilter === 'all') return true;
    return category.status === activeFilter;
  });

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setIsCategoryDetailsModalOpen(true);
  };

  const handleViewCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsCategoryDetailsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    console.log('Edit category:', category);
  };

  const handleDeleteCategory = (category: Category) => {
    if (window.confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
      setCategories(categories.filter(c => c.id !== category.id));
    }
  };

  const handleAddCategory = (categoryData: CategoryFormData) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Create new category with form data
      const newCategory: Category = {
        id: (categories.length + 1).toString(),
        name: categoryData.name,
        description: categoryData.description,
        productCount: 0,
        status: categoryData.status,
        createdAt: new Date().toISOString().split('T')[0]
      };

      // Add to categories array
      setCategories([...categories, newCategory]);

      // Reset state
      setIsLoading(false);
      setIsAddCategoryModalOpen(false);
    }, 1500);
  };

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
        <CategoryFilter
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        <CategoryList
          categories={filteredCategories}
          onCategoryClick={handleCategoryClick}
          onViewCategory={handleViewCategory}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
          title={`${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Categories (${filteredCategories.length})`}
        />
      </Card>

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        title="Add New Category"
        size="md"
      >
        <AddCategoryForm
          onSubmit={handleAddCategory}
          onCancel={() => setIsAddCategoryModalOpen(false)}
          isLoading={isLoading}
        />
      </Modal>

      {/* Category Details Modal */}
      {selectedCategory && (
        <Modal
          isOpen={isCategoryDetailsModalOpen}
          onClose={() => setIsCategoryDetailsModalOpen(false)}
          title="Category Details"
          size="md"
          footer={
            <Button
              variant="outline"
              onClick={() => setIsCategoryDetailsModalOpen(false)}
            >
              Close
            </Button>
          }
        >
          <CategoryDetails category={selectedCategory} />
        </Modal>
      )}
    </div>
  );
};

export default CategoriesPage;
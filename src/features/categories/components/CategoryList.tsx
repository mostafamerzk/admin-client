/**
 * Category List Component
 * 
 * This component displays a list of categories in a data table.
 */

import React from 'react';
import DataTable from '../../../components/common/DataTable';
import type{ Category } from '../types/index';
import { 
  CheckCircleIcon, 
  XCircleIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface CategoryListProps {
  categories: Category[];
  onCategoryClick: (category: Category) => void;
  onViewCategory?: (category: Category) => void;
  onEditCategory?: (category: Category) => void;
  onDeleteCategory?: (category: Category) => void;
  title?: string;
  loading?: boolean;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onCategoryClick,
  onViewCategory,
  onEditCategory,
  onDeleteCategory,
  title = 'Categories',
  loading = false
}) => {
  const columns = [
    { 
      key: 'id', 
      label: 'ID', 
      sortable: true,
      render: (value: string) => (
        <span className="text-xs text-gray-500">{value}</span>
      )
    },
    { 
      key: 'name', 
      label: 'Name', 
      sortable: true,
      render: (value: string) => (
        <span className="font-medium text-gray-900">{value}</span>
      )
    },
    { key: 'description', label: 'Description', sortable: true },
    { 
      key: 'productCount', 
      label: 'Products', 
      sortable: true,
      render: (value: number) => (
        <span className="font-medium">{value}</span>
      )
    },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (value: string) => {
        return (
          <div className="flex items-center">
            {value === 'active' ? (
              <CheckCircleIcon className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <XCircleIcon className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span>{value.charAt(0).toUpperCase() + value.slice(1)}</span>
          </div>
        );
      }
    },
    { key: 'createdAt', label: 'Created At', sortable: true },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, category: Category) => (
        <div className="flex items-center space-x-2">
          {onViewCategory && (
            <button
              className="p-1 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                onViewCategory(category);
              }}
            >
              <EyeIcon className="w-5 h-5" />
            </button>
          )}
          {onEditCategory && (
            <button
              className="p-1 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                onEditCategory(category);
              }}
            >
              <PencilIcon className="w-5 h-5" />
            </button>
          )}
          {onDeleteCategory && (
            <button
              className="p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteCategory(category);
              }}
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={categories}
      onRowClick={onCategoryClick}
      title={title}
      pagination={true}
      loading={loading}
    />
  );
};

export default CategoryList;

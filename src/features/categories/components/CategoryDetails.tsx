/**
 * Category Details Component
 * 
 * This component displays detailed information about a category.
 */

import React from 'react';
import type{ Category } from '../types/index';
import { formatDate } from '../../../utils/formatters';
import { 
  CheckCircleIcon, 
  XCircleIcon,
  CalendarIcon,
  TagIcon,
  DocumentTextIcon,
  CubeIcon
} from '@heroicons/react/24/outline';

interface CategoryDetailsProps {
  category: Category;
}

const CategoryDetails: React.FC<CategoryDetailsProps> = ({ category }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-primary bg-opacity-10 text-primary flex items-center justify-center">
              <TagIcon className="w-8 h-8" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
            <p className="text-sm text-gray-500">ID: {category.id}</p>
            <div className="mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                category.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {category.status === 'active' ? (
                  <CheckCircleIcon className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <XCircleIcon className="w-4 h-4 text-red-500 mr-1" />
                )}
                {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-medium text-gray-500 mb-3">Category Information</h4>
        <div className="space-y-4">
          <div className="flex items-start">
            <DocumentTextIcon className="w-5 h-5 text-gray-400 mt-0.5 mr-2" />
            <div>
              <div className="text-sm font-medium text-gray-500">Description</div>
              <div className="text-sm text-gray-900">{category.description}</div>
            </div>
          </div>
          
          <div className="flex items-start">
            <CubeIcon className="w-5 h-5 text-gray-400 mt-0.5 mr-2" />
            <div>
              <div className="text-sm font-medium text-gray-500">Product Count</div>
              <div className="text-sm text-gray-900">{category.productCount}</div>
            </div>
          </div>
          
          <div className="flex items-start">
            <CalendarIcon className="w-5 h-5 text-gray-400 mt-0.5 mr-2" />
            <div>
              <div className="text-sm font-medium text-gray-500">Created At</div>
              <div className="text-sm text-gray-900">{formatDate(category.createdAt)}</div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default CategoryDetails;

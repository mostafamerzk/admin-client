import React, { useState } from 'react';
import DataTable from '../components/DataTable.tsx';

interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

const CategoriesPage: React.FC = () => {
  const [categories] = useState<Category[]>([
    {
      id: '1',
      name: 'Electronics',
      description: 'Electronic devices and accessories',
      productCount: 150,
      status: 'active',
      createdAt: '2024-01-01',
    },
    {
      id: '2',
      name: 'Office Supplies',
      description: 'Office equipment and supplies',
      productCount: 200,
      status: 'active',
      createdAt: '2024-01-02',
    },
  ]);

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'description', label: 'Description', sortable: true },
    { key: 'productCount', label: 'Products', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'createdAt', label: 'Created At', sortable: true },
  ];

  const handleCategoryClick = (category: Category) => {
    // Handle category click - could open a modal with more details
    console.log('Category clicked:', category);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90">
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex space-x-4 mb-4">
          <button className="px-4 py-2 border rounded-md hover:bg-gray-50">
            All Categories
          </button>
          <button className="px-4 py-2 border rounded-md hover:bg-gray-50">
            Active
          </button>
          <button className="px-4 py-2 border rounded-md hover:bg-gray-50">
            Inactive
          </button>
        </div>

        <DataTable
          columns={columns}
          data={categories}
          onRowClick={handleCategoryClick}
        />
      </div>
    </div>
  );
};

export default CategoriesPage; 
/**
 * Category Filter Component
 * 
 * This component provides filtering options for categories.
 */

import React from 'react';
import Button from '../../../components/common/Button.tsx';

interface CategoryFilterProps {
  activeFilter: 'all' | 'active' | 'inactive';
  onFilterChange: (filter: 'all' | 'active' | 'inactive') => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeFilter,
  onFilterChange
}) => {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <Button
        variant={activeFilter === 'all' ? 'primary' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('all')}
      >
        All Categories
      </Button>
      <Button
        variant={activeFilter === 'active' ? 'primary' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('active')}
      >
        Active
      </Button>
      <Button
        variant={activeFilter === 'inactive' ? 'primary' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('inactive')}
      >
        Inactive
      </Button>
    </div>
  );
};

export default CategoryFilter;

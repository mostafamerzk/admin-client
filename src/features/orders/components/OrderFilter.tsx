/**
 * Order Filter Component
 * 
 * This component provides filtering options for orders.
 */

import React from 'react';
import Button from '../../../components/common/Button';

interface OrderFilterProps {
  activeFilter: 'all' | 'pending' | 'approved' | 'completed' | 'rejected';
  onFilterChange: (filter: 'all' | 'pending' | 'approved' | 'completed' | 'rejected') => void;
}

const OrderFilter: React.FC<OrderFilterProps> = ({
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
        All Orders
      </Button>
      <Button
        variant={activeFilter === 'pending' ? 'primary' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('pending')}
      >
        Pending
      </Button>
      <Button
        variant={activeFilter === 'approved' ? 'primary' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('approved')}
      >
        Approved
      </Button>
      <Button
        variant={activeFilter === 'completed' ? 'primary' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('completed')}
      >
        Completed
      </Button>
      <Button
        variant={activeFilter === 'rejected' ? 'primary' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('rejected')}
      >
        Rejected
      </Button>
    </div>
  );
};

export default OrderFilter;

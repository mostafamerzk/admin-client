/**
 * BaseEntityList Component
 *
 * A reusable list component for displaying entities in a data table.
 * This component is generic and can be used for any entity type.
 */

import DataTable from '../DataTable';
import type { Column } from '../DataTable';

export interface BaseEntityListProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (entity: T) => void;
  title?: string;
  pagination?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export const BaseEntityList = <T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  title,
  pagination = true,
  loading = false,
  emptyMessage = 'No data available',
  className = ''
}: BaseEntityListProps<T>) => {
  return (
    <DataTable<T>
      columns={columns}
      data={data}
      onRowClick={onRowClick}
      title={title}
      pagination={pagination}
      loading={loading}
      emptyMessage={emptyMessage}
      className={className}
    />
  );
};

export default BaseEntityList;
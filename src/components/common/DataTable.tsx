/**
 * DataTable Component
 *
 * A reusable data table component with sorting, filtering, pagination, and row selection.
 */

import React, { useState, useMemo, memo } from 'react';
import { MagnifyingGlassIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from './LoadingSpinner';
import { CONFIG } from '../../constants/config';

export interface Column<T = Record<string, any>> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export interface DataTableProps<T = Record<string, any>> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: ((row: T) => void) | undefined;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  loading?: boolean;
  pagination?: boolean;
  pageSize?: number;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  actions?: React.ReactNode;
  emptyMessage?: string;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  rowClassName?: (row: T, index: number) => string;
  initialSortKey?: string;
  initialSortDirection?: 'asc' | 'desc';
  testId?: string;
}

function DataTable<T extends Record<string, any>>({
  columns,
  data,
  onRowClick,
  title,
  description,
  loading = false,
  pagination = true,
  pageSize = CONFIG.DEFAULT_PAGE_SIZE,
  selectable = true,
  onSelectionChange,
  actions,
  emptyMessage = 'No results found',
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  rowClassName,
  initialSortKey,
  initialSortDirection = 'asc',
  testId,
}: DataTableProps<T>) {
  // State
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(initialSortKey ? { key: initialSortKey, direction: initialSortDirection } : null);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  // Sorting
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle null or undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortConfig.direction === 'asc' ? -1 : 1;
      if (bValue == null) return sortConfig.direction === 'asc' ? 1 : -1;

      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  // Filtering
  const filteredData = useMemo(() => {
    if (!searchTerm) return sortedData;

    return sortedData.filter((row) =>
      Object.entries(row).some(([_key, value]) => {
        // Skip filtering on complex objects
        if (value === null || value === undefined) return false;
        if (typeof value === 'object') return false;

        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [sortedData, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Row selection
  const handleRowSelect = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();

    const newSelectedRows = [...selectedRows];

    if (selectedRows.includes(index)) {
      const idx = newSelectedRows.indexOf(index);
      newSelectedRows.splice(idx, 1);
    } else {
      newSelectedRows.push(index);
    }

    setSelectedRows(newSelectedRows);

    if (onSelectionChange) {
      const selectedItems = newSelectedRows
        .map(idx => paginatedData[idx])
        .filter((item): item is T => item !== undefined);
      onSelectionChange(selectedItems);
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSelectedRows = event.target.checked
      ? Array.from({ length: paginatedData.length }, (_, i) => i)
      : [];

    setSelectedRows(newSelectedRows);

    if (onSelectionChange) {
      const selectedItems = newSelectedRows
        .map(idx => paginatedData[idx])
        .filter((item): item is T => item !== undefined);
      onSelectionChange(selectedItems);
    }
  };

  // Status badge renderer
  const renderStatusBadge = (status: string) => {
    let bgColor = 'bg-gray-100 text-gray-800';

    if (typeof status === 'string') {
      const statusLower = status.toLowerCase();

      if (statusLower.includes('active') || statusLower.includes('approved') ||
          statusLower.includes('verified') || statusLower.includes('completed') ||
          statusLower.includes('success')) {
        bgColor = 'bg-green-100 text-green-800';
      } else if (statusLower.includes('pending') || statusLower.includes('processing')) {
        bgColor = 'bg-yellow-100 text-yellow-800';
      } else if (statusLower.includes('rejected') || statusLower.includes('banned') ||
                statusLower.includes('failed') || statusLower.includes('error')) {
        bgColor = 'bg-red-100 text-red-800';
      } else if (statusLower.includes('inactive')) {
        bgColor = 'bg-gray-100 text-gray-800';
      }
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}>
        {status}
      </span>
    );
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md ${className}`}
      data-testid={testId}
    >
      {/* Header */}
      {(title || description) && (
        <div className={`px-6 py-4 border-b border-gray-100 ${headerClassName}`}>
          {typeof title === 'string' ? (
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          ) : (
            title
          )}
          {typeof description === 'string' ? (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          ) : (
            description
          )}
        </div>
      )}

      {/* Search and Actions */}
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            data-testid={`${testId}-search`}
          />
        </div>

        <div className="flex items-center space-x-2">
          {selectedRows.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{selectedRows.length} selected</span>
              <button
                className="px-3 py-1.5 bg-red-50 text-red-600 rounded-md text-sm font-medium hover:bg-red-100 transition-colors"
                onClick={() => {
                  setSelectedRows([]);
                  if (onSelectionChange) onSelectionChange([]);
                }}
                data-testid={`${testId}-clear-selection`}
              >
                Clear
              </button>
            </div>
          )}
          {actions}
        </div>
      </div>

      {/* Table */}
      <div className={`overflow-x-auto ${bodyClassName}`}>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" variant="spinner" />
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                {selectable && (
                  <th className="w-12 px-6 py-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                      onChange={handleSelectAll}
                      checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                      data-testid={`${testId}-select-all`}
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-6 py-3 text-${column.align || 'left'} text-xs font-medium text-gray-500 uppercase tracking-wider ${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''} transition-colors duration-200 ${column.width ? column.width : ''} ${column.className || ''}`}
                    onClick={() => column.sortable && handleSort(column.key)}
                    data-testid={`${testId}-column-${column.key}`}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.label}</span>
                      {column.sortable && (
                        <span className={`transition-colors duration-200 ${
                          sortConfig?.key === column.key ? 'text-primary' : 'text-gray-400'
                        }`}>
                          {sortConfig?.key === column.key && sortConfig.direction === 'asc'
                            ? <ChevronUpIcon className="h-4 w-4" />
                            : sortConfig?.key === column.key && sortConfig.direction === 'desc'
                              ? <ChevronDownIcon className="h-4 w-4" />
                              : <span className="text-gray-300">↕</span>}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <tr
                    key={index}
                    className={`group transition-all duration-200 ${
                      onRowClick ? 'cursor-pointer' : ''
                    } ${selectedRows.includes(index) ? 'bg-primary bg-opacity-5' : ''}
                    ${hoveredRow === index ? 'bg-gray-50' : ''}
                    ${rowClassName ? rowClassName(row, index) : ''}`}
                    onClick={() => onRowClick && onRowClick(row)}
                    onMouseEnter={() => setHoveredRow(index)}
                    onMouseLeave={() => setHoveredRow(null)}
                    data-testid={`${testId}-row-${index}`}
                  >
                    {selectable && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                          checked={selectedRows.includes(index)}
                          onChange={() => {}} // Empty handler to avoid React warning about controlled component
                          onClick={(e) => handleRowSelect(index, e)}
                          data-testid={`${testId}-row-${index}-checkbox`}
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-6 py-4 whitespace-nowrap text-sm text-gray-600 group-hover:text-gray-900 text-${column.align || 'left'} ${column.className || ''}`}
                        data-testid={`${testId}-row-${index}-cell-${column.key}`}
                      >
                        {column.render
                          ? column.render(row[column.key], row)
                          : column.key.toLowerCase().includes('status')
                            ? renderStatusBadge(row[column.key])
                            : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className="px-6 py-10 text-center text-gray-500"
                    data-testid={`${testId}-empty-message`}
                  >
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className={`px-6 py-4 border-t border-gray-100 flex items-center justify-between ${footerClassName}`}>
          <div className="text-sm text-gray-500">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} entries
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md text-sm ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              data-testid={`${testId}-pagination-prev`}
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show pages around current page
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    currentPage === pageNum
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  data-testid={`${testId}-pagination-${pageNum}`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md text-sm ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              data-testid={`${testId}-pagination-next`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(DataTable) as typeof DataTable;





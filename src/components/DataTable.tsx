import React, { useState } from 'react';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
  title?: string;
  description?: string;
  loading?: boolean;
  pagination?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  onRowClick,
  title,
  description,
  loading = false,
  pagination = true
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const itemsPerPage = 10;

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const filteredData = React.useMemo(() => {
    if (!searchTerm) return sortedData;

    return sortedData.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [sortedData, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowSelect = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();

    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter(i => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedRows(paginatedData.map((_, index) => index));
    } else {
      setSelectedRows([]);
    }
  };

  const renderStatusBadge = (status: string) => {
    let bgColor = 'bg-gray-100 text-gray-800';

    if (typeof status === 'string') {
      if (status.toLowerCase().includes('active') || status.toLowerCase().includes('approved') || status.toLowerCase().includes('verified') || status.toLowerCase().includes('completed')) {
        bgColor = 'bg-green-100 text-green-800';
      } else if (status.toLowerCase().includes('pending')) {
        bgColor = 'bg-yellow-100 text-yellow-800';
      } else if (status.toLowerCase().includes('rejected') || status.toLowerCase().includes('banned')) {
        bgColor = 'bg-red-100 text-red-800';
      }
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
      {(title || description) && (
        <div className="px-6 py-4 border-b border-gray-100">
          {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
      )}

      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
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
          />
        </div>

        {selectedRows.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">{selectedRows.length} selected</span>
            <button
              className="px-3 py-1.5 bg-red-50 text-red-600 rounded-md text-sm font-medium hover:bg-red-100 transition-colors"
              onClick={() => setSelectedRows([])}
            >
              Clear
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 px-6 py-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                    onChange={handleSelectAll}
                    checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                  />
                </th>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.label}</span>
                      {column.sortable && (
                        <span className={`transition-colors duration-200 ${
                          sortConfig?.key === column.key ? 'text-primary' : 'text-gray-400'
                        }`}>
                          {sortConfig?.key === column.key && sortConfig.direction === 'asc'
                            ? '↑'
                            : sortConfig?.key === column.key && sortConfig.direction === 'desc'
                              ? '↓'
                              : '↕'}
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
                    ${hoveredRow === index ? 'bg-gray-50' : ''}`}
                    onClick={() => onRowClick && onRowClick(row)}
                    onMouseEnter={() => setHoveredRow(index)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                        checked={selectedRows.includes(index)}
                        onChange={() => {}} // Empty handler to avoid React warning about controlled component
                        onClick={(e) => handleRowSelect(index, e)}
                      />
                    </td>
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 group-hover:text-gray-900"
                      >
                        {column.render
                          ? column.render(row[column.key], row)
                          : column.key.toLowerCase().includes('status')
                            ? renderStatusBadge(row[column.key])
                            : row[column.key]
                        }
                      </td>
                    ))}

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-10 text-center text-gray-500">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {pagination && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
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
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
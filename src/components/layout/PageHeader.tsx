/**
 * PageHeader Component
 * 
 * A consistent header component for pages with title, description, and actions.
 */

import React, { memo } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface PageHeaderProps {
  title: string;
  description?: string | ReactNode;
  actions?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
  testId?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions,
  breadcrumbs,
  className = '',
  testId,
}) => {
  return (
    <div 
      className={`mb-6 ${className}`}
      data-testid={testId}
    >
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-1 text-sm text-gray-500">
            <li>
              <Link 
                to="/" 
                className="flex items-center hover:text-primary"
                aria-label="Home"
              >
                <HomeIcon className="h-4 w-4" />
              </Link>
            </li>
            
            {breadcrumbs.map((item, index) => (
              <li key={index} className="flex items-center">
                <ChevronRightIcon className="h-4 w-4 mx-1 text-gray-400" />
                {item.path && index < breadcrumbs.length - 1 ? (
                  <Link 
                    to={item.path} 
                    className="hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="font-medium text-gray-700">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      
      {/* Header Content */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          {description && typeof description === 'string' ? (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          ) : (
            description
          )}
        </div>
        
        {actions && (
          <div className="flex flex-wrap gap-3 mt-2 sm:mt-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(PageHeader);

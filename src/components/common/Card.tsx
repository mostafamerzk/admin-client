/**
 * Card Component
 *
 * A reusable card component for displaying content in a contained box.
 */

import React, { memo } from 'react';
import type { ReactNode } from 'react';

export interface CardProps {
  title?: string | ReactNode;
  subtitle?: string | ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  icon?: ReactNode;
  footer?: ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
  noPadding?: boolean;
  bordered?: boolean;
  loading?: boolean;
  testId?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  className = '',
  bodyClassName = '',
  headerClassName = '',
  footerClassName = '',
  icon,
  footer,
  onClick,
  hoverable = false,
  noPadding = false,
  bordered = true,
  loading = false,
  testId,
}) => {
  // Base classes
  const cardClasses = `
    bg-white rounded-xl ${bordered ? 'border border-gray-100' : ''} overflow-hidden transition-all duration-300
    ${hoverable ? 'hover:shadow-md hover:border-gray-200 transform hover:-translate-y-1' : 'shadow-sm'}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;

  // Header classes
  const headerClasses = `
    px-6 py-4 border-b border-gray-100 flex items-center justify-between
    ${headerClassName}
  `;

  // Body classes
  const bodyClasses = `
    ${noPadding ? '' : 'p-6'}
    ${bodyClassName}
  `;

  // Footer classes
  const footerClasses = `
    px-6 py-4 bg-gray-50 border-t border-gray-100
    ${footerClassName}
  `;

  // Loading skeleton
  if (loading) {
    return (
      <div className={cardClasses} data-testid={testId}>
        {(title || subtitle || icon) && (
          <div className={headerClasses}>
            <div className="w-full">
              {title && <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>}
              {subtitle && <div className="h-4 mt-2 bg-gray-200 rounded w-1/2 animate-pulse"></div>}
            </div>
            {icon && <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>}
          </div>
        )}

        <div className={bodyClasses}>
          <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {footer && (
          <div className={footerClasses}>
            <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      data-testid={testId}
    >
      {(title || subtitle || icon) && (
        <div className={headerClasses}>
          <div>
            {typeof title === 'string' ? (
              <h3 className="text-lg font-semibold text-primary">{title}</h3>
            ) : (
              title
            )}
            {typeof subtitle === 'string' ? (
              <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            ) : (
              subtitle
            )}
          </div>
          {icon && <div className="text-primary">{icon}</div>}
        </div>
      )}

      <div className={bodyClasses}>{children}</div>

      {footer && (
        <div className={footerClasses}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default memo(Card);

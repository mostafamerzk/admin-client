/**
 * Badge Component
 * 
 * A reusable badge component for displaying status indicators.
 */

import React, { memo } from 'react';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'gray';
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
  className?: string;
  dot?: boolean;
  outline?: boolean;
  testId?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'sm',
  rounded = true,
  className = '',
  dot = false,
  outline = false,
  testId,
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center font-medium';
  
  // Variant classes
  const variantClasses = {
    primary: outline 
      ? 'bg-primary bg-opacity-10 text-primary border border-primary' 
      : 'bg-primary text-white',
    secondary: outline 
      ? 'bg-secondary bg-opacity-10 text-secondary border border-secondary' 
      : 'bg-secondary text-white',
    success: outline 
      ? 'bg-success bg-opacity-10 text-success border border-success' 
      : 'bg-success text-white',
    danger: outline 
      ? 'bg-danger bg-opacity-10 text-danger border border-danger' 
      : 'bg-danger text-white',
    warning: outline 
      ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
      : 'bg-yellow-500 text-white',
    info: outline 
      ? 'bg-blue-100 text-blue-800 border border-blue-300' 
      : 'bg-blue-500 text-white',
    gray: outline 
      ? 'bg-gray-100 text-gray-800 border border-gray-300' 
      : 'bg-gray-500 text-white',
  };
  
  // Size classes
  const sizeClasses = {
    xs: dot ? 'text-xs px-1.5' : 'text-xs px-1.5 py-0.5',
    sm: dot ? 'text-xs px-2' : 'text-xs px-2.5 py-0.5',
    md: dot ? 'text-sm px-2.5' : 'text-sm px-3 py-1',
    lg: dot ? 'text-base px-3' : 'text-base px-3.5 py-1.5',
  };
  
  // Rounded classes
  const roundedClasses = rounded ? 'rounded-full' : 'rounded';
  
  // Dot indicator
  const dotElement = dot && (
    <span 
      className={`inline-block h-2 w-2 rounded-full mr-1.5 bg-current`}
      aria-hidden="true"
    />
  );
  
  return (
    <span
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${roundedClasses}
        ${className}
      `}
      data-testid={testId}
    >
      {dotElement}
      {children}
    </span>
  );
};

// Status badge helper
export const StatusBadge: React.FC<{ status: string; className?: string }> = ({ status, className = '' }) => {
  let variant: BadgeVariant = 'gray';
  
  if (typeof status === 'string') {
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('active') || 
        statusLower.includes('approved') || 
        statusLower.includes('verified') || 
        statusLower.includes('completed') || 
        statusLower.includes('success')) {
      variant = 'success';
    } else if (statusLower.includes('pending') || 
               statusLower.includes('processing') || 
               statusLower.includes('waiting')) {
      variant = 'warning';
    } else if (statusLower.includes('rejected') || 
               statusLower.includes('banned') || 
               statusLower.includes('failed') || 
               statusLower.includes('error')) {
      variant = 'danger';
    } else if (statusLower.includes('inactive') || 
               statusLower.includes('disabled')) {
      variant = 'gray';
    }
  }
  
  return (
    <Badge variant={variant} className={className} dot>
      {status}
    </Badge>
  );
};

export default memo(Badge);

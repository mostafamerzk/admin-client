/**
 * Enhanced Page Loader Component
 * 
 * A sophisticated loading component that provides visual feedback during page transitions
 * and component loading. Includes accessibility features and animation options.
 */

import React from 'react';

interface PageLoaderProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'accent';
  showText?: boolean;
  text?: string;
}

const PageLoader: React.FC<PageLoaderProps> = ({
  size = 'medium',
  variant = 'primary',
  showText = true,
  text = 'Loading...',
}) => {
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-16 w-16',
  };

  const variantClasses = {
    primary: 'border-primary',
    secondary: 'border-secondary',
    accent: 'border-accent',
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-[50vh]"
      role="status"
      aria-label="Loading content"
    >
      <div 
        className={`
          animate-spin rounded-full border-4 border-t-transparent
          ${sizeClasses[size]}
          ${variantClasses[variant]}
        `}
      />
      {showText && (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          {text}
        </p>
      )}
    </div>
  );
};

export default PageLoader; 
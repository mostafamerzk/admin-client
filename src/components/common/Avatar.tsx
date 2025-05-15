/**
 * Avatar Component
 * 
 * A reusable avatar component for displaying user profile images.
 */

import React, { useState, memo } from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type AvatarStatus = 'online' | 'offline' | 'away' | 'busy';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  rounded?: boolean;
  status?: AvatarStatus;
  className?: string;
  onClick?: () => void;
  testId?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  rounded = true,
  status,
  className = '',
  onClick,
  testId,
}) => {
  const [imageError, setImageError] = useState(false);
  
  // Size classes
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
    '2xl': 'h-20 w-20 text-2xl',
  };
  
  // Status classes
  const statusClasses = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  };
  
  // Status indicator size
  const statusSizeClasses = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
    xl: 'h-3.5 w-3.5',
    '2xl': 'h-4 w-4',
  };
  
  // Generate initials from name
  const getInitials = () => {
    if (!name) return '';
    
    const nameParts = name.split(' ').filter(Boolean);
    
    if (nameParts.length === 0) return '';
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };
  
  // Generate background color based on name
  const getBackgroundColor = () => {
    if (!name) return 'bg-primary';
    
    const colors = [
      'bg-primary',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
    ];
    
    // Simple hash function to get consistent color for the same name
    const hash = name.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    return colors[hash % colors.length];
  };
  
  // Base classes
  const baseClasses = `
    inline-flex items-center justify-center flex-shrink-0
    ${sizeClasses[size]}
    ${rounded ? 'rounded-full' : 'rounded-md'}
    ${onClick ? 'cursor-pointer hover:opacity-90' : ''}
    ${className}
  `;
  
  // If image is available and no error loading it
  if (src && !imageError) {
    return (
      <div className="relative inline-block">
        <img
          src={src}
          alt={alt}
          className={baseClasses}
          onError={() => setImageError(true)}
          onClick={onClick}
          data-testid={testId}
        />
        {status && (
          <span 
            className={`absolute bottom-0 right-0 block ${statusSizeClasses[size]} ${statusClasses[status]} rounded-full ring-2 ring-white`}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    );
  }
  
  // Fallback to initials avatar
  return (
    <div className="relative inline-block">
      <div 
        className={`${baseClasses} ${getBackgroundColor()} text-white font-medium`}
        onClick={onClick}
        data-testid={testId}
      >
        {getInitials()}
      </div>
      {status && (
        <span 
          className={`absolute bottom-0 right-0 block ${statusSizeClasses[size]} ${statusClasses[status]} rounded-full ring-2 ring-white`}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
};

export default memo(Avatar);

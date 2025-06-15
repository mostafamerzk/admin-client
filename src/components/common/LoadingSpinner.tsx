// src/components/common/LoadingSpinner.tsx
import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'spinner' | 'dots' | 'pulse' | 'ripple';
  color?: string;
  useCurrentColor?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  variant = 'spinner',
  color = '#F28B22', // Primary color
  useCurrentColor = false
}) => {
  const sizeMap = {
    sm: { spinner: 'w-5 h-5', dots: 'w-1 h-1', pulse: 'w-4 h-4', ripple: 'w-6 h-6' },
    md: { spinner: 'w-8 h-8', dots: 'w-1.5 h-1.5', pulse: 'w-6 h-6', ripple: 'w-10 h-10' },
    lg: { spinner: 'w-12 h-12', dots: 'w-2 h-2', pulse: 'w-8 h-8', ripple: 'w-16 h-16' }
  };

  const currentColor = useCurrentColor ? 'currentColor' : color;

  // Simple rotating ring spinner
  if (variant === 'spinner') {
    return (
      <div
        className={`flex justify-center items-center ${className}`}
        role="status"
        aria-label="Loading"
      >
        <div
          className={`spinner-smooth rounded-full border-2 border-gray-200 ${sizeMap[size].spinner}`}
          style={{
            borderTopColor: currentColor,
            borderRightColor: currentColor,
          }}
        />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  // Three bouncing dots
  if (variant === 'dots') {
    return (
      <div
        className={`flex justify-center items-center space-x-1 dots-bounce ${className}`}
        role="status"
        aria-label="Loading"
      >
        <div
          className={`${sizeMap[size].dots} rounded-full dot`}
          style={{ backgroundColor: currentColor }}
        />
        <div
          className={`${sizeMap[size].dots} rounded-full dot`}
          style={{ backgroundColor: currentColor }}
        />
        <div
          className={`${sizeMap[size].dots} rounded-full dot`}
          style={{ backgroundColor: currentColor }}
        />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  // Pulsing circle
  if (variant === 'pulse') {
    return (
      <div
        className={`flex justify-center items-center ${className}`}
        role="status"
        aria-label="Loading"
      >
        <div
          className={`${sizeMap[size].pulse} rounded-full pulse-smooth`}
          style={{ backgroundColor: currentColor }}
        />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  // Ripple effect
  if (variant === 'ripple') {
    return (
      <div
        className={`flex justify-center items-center ${className}`}
        role="status"
        aria-label="Loading"
      >
        <div
          className={`${sizeMap[size].ripple} rounded-full ripple-effect`}
          style={{ color: currentColor }}
        >
          <div
            className={`${sizeMap[size].pulse} rounded-full pulse-smooth mx-auto`}
            style={{ backgroundColor: currentColor }}
          />
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return null;
};

export default LoadingSpinner;
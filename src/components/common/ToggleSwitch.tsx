/**
 * Toggle Switch Component
 * 
 * A reusable toggle switch component.
 */

import React from 'react';

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: () => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  enabled,
  onChange,
  size = 'md',
  disabled = false,
  className = ''
}) => {
  // Size classes
  const sizeClasses = {
    sm: {
      container: 'h-5 w-9',
      toggle: 'h-3 w-3',
      translate: enabled ? 'translate-x-4' : 'translate-x-1'
    },
    md: {
      container: 'h-6 w-11',
      toggle: 'h-4 w-4',
      translate: enabled ? 'translate-x-6' : 'translate-x-1'
    },
    lg: {
      container: 'h-7 w-14',
      toggle: 'h-5 w-5',
      translate: enabled ? 'translate-x-8' : 'translate-x-1'
    }
  };

  return (
    <button
      type="button"
      className={`relative inline-flex ${sizeClasses[size].container} items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
        enabled ? 'bg-primary' : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      onClick={disabled ? undefined : onChange}
      disabled={disabled}
      role="switch"
      aria-checked={enabled}
    >
      <span 
        className={`inline-block ${sizeClasses[size].toggle} transform rounded-full bg-white transition-transform ${
          sizeClasses[size].translate
        }`} 
      />
    </button>
  );
};

export default ToggleSwitch;

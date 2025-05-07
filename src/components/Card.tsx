import React, { ReactNode } from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  footer?: ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  className = '',
  icon,
  footer,
  onClick,
  hoverable = false,
}) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 
        ${hoverable ? 'hover:shadow-md hover:border-gray-200 transform hover:-translate-y-1' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}`}
      onClick={onClick}
    >
      {(title || subtitle || icon) && (
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          </div>
          {icon && <div className="text-primary">{icon}</div>}
        </div>
      )}
      
      <div className="p-6">{children}</div>
      
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;

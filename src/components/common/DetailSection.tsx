import React from 'react';
import type { ReactNode } from 'react';

interface DetailSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

const DetailSection: React.FC<DetailSectionProps> = ({
  title,
  description,
  children,
  className = ''
}) => {
  return (
    <div className={`bg-white shadow overflow-hidden sm:rounded-lg ${className}`}>
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
        {description && (
          <p className="mt-1 max-w-2xl text-sm text-gray-500">{description}</p>
        )}
      </div>
      <div className="border-t border-gray-200">
        {children}
      </div>
    </div>
  );
};

export default DetailSection;
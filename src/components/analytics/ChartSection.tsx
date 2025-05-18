import React from 'react';
import type { ReactNode } from 'react';
import Card from '../common/Card';

interface ChartSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

const ChartSection: React.FC<ChartSectionProps> = ({
  title,
  description,
  children,
  className = ''
}) => {
  return (
    <Card className={className}>
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
        {description && (
          <p className="mt-1 max-w-2xl text-sm text-gray-500">{description}</p>
        )}
      </div>
      <div className="px-4 py-5 sm:p-6">
        {children}
      </div>
    </Card>
  );
};

export default ChartSection;
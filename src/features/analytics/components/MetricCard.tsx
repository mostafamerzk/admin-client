/**
 * Metric Card Component
 *
 * This component displays a metric card with an icon, title, value, and growth indicator.
 */

import React from 'react';
import Card from '../../../components/common/Card';
import type { MetricData } from '../types/index';

// Helper function to get appropriate background class for icon
const getIconBackgroundClass = (icon: React.ReactNode): string => {
  if (!React.isValidElement(icon)) return 'bg-primary bg-opacity-10';

  // Get the className from the icon props
  const className = icon.props.className || '';

  // Extract color from text-{color} class with more specific matching
  if (className.includes('text-primary')) return 'bg-primary bg-opacity-10';
  if (className.includes('text-blue')) return 'bg-blue-500 bg-opacity-10';
  if (className.includes('text-green')) return 'bg-green-500 bg-opacity-10';
  if (className.includes('text-yellow')) return 'bg-yellow-500 bg-opacity-10';
  if (className.includes('text-red')) return 'bg-red-500 bg-opacity-10';
  if (className.includes('text-purple')) return 'bg-purple-500 bg-opacity-10';
  if (className.includes('text-indigo')) return 'bg-indigo-500 bg-opacity-10';
  if (className.includes('text-pink')) return 'bg-pink-500 bg-opacity-10';
  if (className.includes('text-gray')) return 'bg-gray-500 bg-opacity-10';

  // Default fallback - use primary color
  return 'bg-primary bg-opacity-10';
};

interface MetricCardProps {
  title: string;
  data: MetricData;
  icon: React.ReactNode;
  formatValue?: (value: number) => string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  data,
  icon,
  formatValue = (value) => value.toString()
}) => {
  return (
    <Card>
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${getIconBackgroundClass(icon)}`}>
          {/* Ensure consistent icon styling while preserving color */}
          {React.isValidElement(icon) ? (
            (() => {
              const iconElement = icon as React.ReactElement;
              const existingClassName = iconElement.props.className || '';
              const colorMatch = existingClassName.match(/text-[a-z0-9-]+/);
              const colorClass = colorMatch ? colorMatch[0] : 'text-primary';

              return React.cloneElement(iconElement, {
                className: `w-6 h-6 ${colorClass}`
              });
            })()
          ) : (
            icon
          )}
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
          <div className="flex items-center">
            <p className="text-2xl font-bold text-gray-900">{formatValue(data.total)}</p>
            <span className={`ml-2 text-sm font-medium ${data.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.growth >= 0 ? '+' : ''}{data.growth.toFixed(1)}%
            </span>
          </div>
          <p className="text-sm text-gray-500">vs previous period</p>
        </div>
      </div>
    </Card>
  );
};

export default MetricCard;

/**
 * Metric Card Component
 *
 * A simple metric card component for displaying key metrics with icons.
 * This is a replacement for the analytics MetricCard to avoid dependencies.
 */

import React from 'react';
import Card from './Card';

interface MetricData {
  total: number;
  growth?: number;
}

interface MetricCardProps {
  title: string;
  data: MetricData;
  icon?: React.ReactNode;
  formatValue?: (value: number) => string;
}

// Helper function to get appropriate background class for icon
const getIconBackgroundClass = (icon: React.ReactNode): string => {
  if (!React.isValidElement(icon)) return 'bg-primary bg-opacity-10';

  // Get the className from the icon props
  const className = icon.props.className || '';
  
  // Extract color from className (e.g., "text-blue-500" -> "blue")
  const colorMatch = className.match(/text-([a-z]+)-/);
  if (colorMatch) {
    const color = colorMatch[1];
    return `bg-${color}-50`;
  }
  
  return 'bg-primary bg-opacity-10';
};

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
              const colorClass = colorMatch ? colorMatch[0] : 'text-gray-600';
              const sizeClass = 'h-6 w-6';
              
              return React.cloneElement(iconElement, {
                className: `${sizeClass} ${colorClass}`
              });
            })()
          ) : (
            icon
          )}
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">
              {formatValue(data.total)}
            </p>
            {data.growth !== undefined && (
              <p className={`ml-2 flex items-baseline text-sm font-semibold ${
                data.growth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {data.growth >= 0 ? '+' : ''}{data.growth.toFixed(1)}%
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MetricCard;

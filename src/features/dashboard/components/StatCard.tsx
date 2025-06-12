import React from 'react';
import Card from '../../../components/common/Card';

// Helper function to get appropriate background class for icon
const getIconBackgroundClass = (icon: React.ReactNode): string => {
  if (!React.isValidElement(icon)) return 'bg-primary bg-opacity-10';

  // Get the className from the icon props
  const className = icon.props.className || '';

  // Debug the className to see what we're working with
  console.log('Icon className:', className);

  // Extract color from text-{color} class with more specific matching
  if (className.includes('text-primary')) return 'bg-primary-500 bg-opacity-10';
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

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
  onClick?: () => void;
  hoverable?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  isLoading = false,
  onClick,
  hoverable = true,
}) => {
  return (
    <Card
      className="transition-transform duration-300 hover:scale-105"
      {...(onClick && { onClick })}
      hoverable={hoverable}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>

          {isLoading ? (
            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded mt-1"></div>
          ) : (
            <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
          )}

          {change && !isLoading && (
            <div className="flex items-center mt-1">
              <span
                className={`text-sm font-medium ${
                  change.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {change.isPositive ? '↑' : '↓'} {change.value}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last period</span>
            </div>
          )}
        </div>

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
      </div>
    </Card>
  );
};

export default StatCard;

/**
 * Metrics Section Component
 *
 * A simple metrics section component for displaying multiple metrics.
 * This is a replacement for the analytics MetricsSection to avoid dependencies.
 */

import React from 'react';
import MetricCard from './MetricCard';

export interface Metric {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
}

interface MetricsSectionProps {
  metrics: Metric[];
  className?: string;
}

const MetricsSection: React.FC<MetricsSectionProps> = ({
  metrics,
  className = ''
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
      {metrics.map((metric, index) => (
        <MetricCard
          key={index}
          title={metric.title}
          data={{ 
            total: typeof metric.value === 'string' ? parseFloat(metric.value) || 0 : metric.value, 
            growth: metric.change || 0 
          }}
          icon={metric.icon}
        />
      ))}
    </div>
  );
};

export default MetricsSection;

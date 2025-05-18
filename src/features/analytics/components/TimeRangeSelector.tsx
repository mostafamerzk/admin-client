/**
 * Time Range Selector Component
 * 
 * This component displays buttons for selecting the time range for analytics data.
 */

import React from 'react';
import Button from '../../../components/common/Button.tsx';
import type{ TimeRange } from '../types/index.ts';

interface TimeRangeSelectorProps {
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  timeRange,
  onTimeRangeChange
}) => {
  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'quarter', label: 'Quarter' },
    { value: 'year', label: 'Year' }
  ];

  return (
    <div className="flex space-x-2">
      {timeRanges.map((range) => (
        <Button
          key={range.value}
          variant={timeRange === range.value ? 'primary' : 'outline'}
          onClick={() => onTimeRangeChange(range.value)}
        >
          {range.label}
        </Button>
      ))}
    </div>
  );
};

export default TimeRangeSelector;

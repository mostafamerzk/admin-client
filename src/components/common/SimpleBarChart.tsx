/**
 * Simple Bar Chart Component
 *
 * A simple bar chart component using CSS for basic data visualization.
 * This is a replacement for the analytics BarChart to avoid dependencies.
 */

import React from 'react';
import Card from './Card';

interface SimpleBarChartProps {
  title: string;
  labels: string[];
  data: number[];
  color?: string;
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({
  title,
  labels,
  data,
  color = '#F28B22' // Primary color
}) => {
  const maxValue = Math.max(...data);

  return (
    <Card title={title}>
      <div className="h-80 flex items-center justify-center">
        <div className="w-full h-full">
          <div className="w-full h-full flex flex-col">
            <div className="flex justify-between mb-4">
              {labels.map((label, index) => (
                <div key={index} className="text-xs text-gray-500">{label}</div>
              ))}
            </div>
            <div className="flex-1 flex items-end">
              {data.map((value, index) => {
                const height = maxValue > 0 ? `${(value / maxValue) * 100}%` : '0%';
                return (
                  <div key={index} className="flex-1 mx-1">
                    <div
                      className="rounded-t-md w-full transition-all duration-500"
                      style={{ 
                        height,
                        backgroundColor: color
                      }}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SimpleBarChart;

/**
 * Bar Chart Component
 * 
 * This component displays a simple bar chart.
 */

import React from 'react';
import Card from '../../../components/common/Card.tsx';

interface BarChartProps {
  title: string;
  labels: string[];
  data: number[];
  color?: string;
}

const BarChart: React.FC<BarChartProps> = ({
  title,
  labels,
  data,
  color = 'bg-primary'
}) => {
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
                const height = `${(value / Math.max(...data)) * 100}%`;
                return (
                  <div key={index} className="flex-1 mx-1">
                    <div
                      className={`${color} rounded-t-md w-full transition-all duration-500`}
                      style={{ height }}
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

export default BarChart;

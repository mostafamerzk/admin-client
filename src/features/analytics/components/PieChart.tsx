/**
 * Pie Chart Component
 * 
 * This component displays a simple pie chart.
 */

import React from 'react';
import Card from '../../../components/common/Card.tsx';
import type { CategoryDistribution } from '../types/index.ts';

interface PieChartProps {
  title: string;
  data: CategoryDistribution;
}

const PieChart: React.FC<PieChartProps> = ({
  title,
  data
}) => {
  return (
    <Card title={title} className="mb-6">
      <div className="h-80 flex items-center justify-center">
        <div className="w-full h-full">
          <div className="flex justify-center items-center h-full">
            <div className="w-64 h-64 rounded-full border-8 border-gray-200 relative">
              {data.datasets[0]?.data.map((value, index) => {
                const color = data.datasets[0]?.backgroundColor[index];
                const total = data.datasets[0]?.data.reduce((a, b) => a + b, 0) || 1  ;
                const percentage = (value / total) * 100;

                return (
                  <div
                    key={index}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      clipPath: `polygon(50% 50%, 50% 0, ${50 + 50 * Math.cos(Math.PI * 2 * (percentage / 100))}% ${50 - 50 * Math.sin(Math.PI * 2 * (percentage / 100))}%, 50% 50%)`,
                      transform: `rotate(${index * 72}deg)`,
                      backgroundColor: color
                    }}
                  >
                  </div>
                );
              })}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-700">Categories</p>
                    <p className="text-sm text-gray-500">Distribution</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
          {data.labels.map((label, index) => (
            <div key={index} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: data.datasets[0]?.backgroundColor[index] }}
              ></div>
              <span className="text-sm text-gray-700">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default PieChart;

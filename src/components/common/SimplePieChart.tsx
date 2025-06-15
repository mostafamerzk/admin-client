/**
 * Simple Pie Chart Component
 *
 * A simple pie chart component using CSS for basic data visualization.
 * This is a replacement for the analytics PieChart to avoid dependencies.
 */

import React from 'react';
import Card from './Card';

interface PieChartData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
  }[];
}

interface SimplePieChartProps {
  title: string;
  data: PieChartData;
}

const SimplePieChart: React.FC<SimplePieChartProps> = ({
  title,
  data
}) => {
  const dataset = data.datasets[0];

  // Handle case where dataset might be undefined
  if (!dataset || !dataset.data || dataset.data.length === 0) {
    return (
      <Card title={title}>
        <div className="h-80 flex items-center justify-center">
          <div className="text-center text-gray-500">
            No data available
          </div>
        </div>
      </Card>
    );
  }

  const total = dataset.data.reduce((sum, value) => sum + value, 0);

  return (
    <Card title={title}>
      <div className="h-80 flex items-center justify-center">
        <div className="w-full h-full flex flex-col">
          {/* Simple legend */}
          <div className="mb-4">
            {data.labels.map((label, index) => (
              <div key={index} className="flex items-center mb-2">
                <div
                  className="w-4 h-4 rounded mr-2"
                  style={{ backgroundColor: dataset.backgroundColor?.[index] || '#ccc' }}
                ></div>
                <span className="text-sm text-gray-600">
                  {label}: {dataset.data[index] || 0} ({((dataset.data[index] || 0) / total * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>

          {/* Simple visual representation */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-2">Total: {total}</div>
              <div className="text-sm text-gray-500">Data Distribution</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SimplePieChart;

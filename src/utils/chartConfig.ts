/**
 * Chart.js Configuration
 *
 * This file configures Chart.js and registers all necessary components.
 */

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale,
  type ChartOptions
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement, // Required for Pie and Doughnut charts
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Default chart options
export const defaultLineChartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: '#F28B22',
      titleColor: '#FFFFFF',
      bodyColor: '#FFFFFF',
      padding: 12,
      displayColors: false
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        display: true,
        color: '#E5E7EB'
      }
    }
  }
};

export const defaultPieChartOptions: ChartOptions<'pie'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    },
    tooltip: {
      backgroundColor: '#F28B22',
      titleColor: '#FFFFFF',
      bodyColor: '#FFFFFF',
      padding: 12
    }
  }
};

// Helper function to destroy chart instances
export const destroyChart = (chartInstance: ChartJS | null) => {
  if (chartInstance) {
    chartInstance.destroy();
  }
};

export default ChartJS;

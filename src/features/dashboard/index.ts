/**
 * Dashboard Feature
 *
 * This file exports all components, hooks, and types for the dashboard feature.
 */

// Components
export { default as StatCard } from './components/StatCard';
export { default as SalesChart } from './components/SalesChart';
export { default as UserGrowthChart } from './components/UserGrowthChart';
export { default as CategoryDistributionChart } from './components/CategoryDistributionChart';
export { default as RecentOrders } from './components/RecentOrders';

// Container Components (with data fetching)
export { default as SalesChartContainer } from './components/SalesChartContainer';
export { default as UserGrowthChartContainer } from './components/UserGrowthChartContainer';
export { default as CategoryDistributionChartContainer } from './components/CategoryDistributionChartContainer';

// Hooks
export { default as useDashboard } from './hooks/useDashboard';

// API
export { default as dashboardApi } from './api/dashboardApi';

// Types
export * from './types/index';

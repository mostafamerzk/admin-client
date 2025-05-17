/**
 * Dashboard Feature
 *
 * This file exports all components, hooks, and types for the dashboard feature.
 */

// Components
export { default as StatCard } from './components/StatCard.tsx';
export { default as SalesChart } from './components/SalesChart.tsx';
export { default as UserGrowthChart } from './components/UserGrowthChart.tsx';
export { default as RecentOrders } from './components/RecentOrders.tsx';

// Hooks
export { default as useDashboard } from './hooks/useDashboard.ts';

// API
export { default as dashboardApi } from './api/dashboardApi.ts';

// Types
export * from './types/index.ts';

/**
 * Orders Feature
 *
 * This file exports all components, hooks, and types for the orders feature.
 */

// Components
export { default as OrderList } from './components/OrderList.tsx';
export { default as OrderDetails } from './components/OrderDetails.tsx';
export { default as OrderFilter } from './components/OrderFilter.tsx';

// Hooks
export { default as useOrders } from './hooks/useOrders.ts';

// API
export { default as ordersApi } from './api/ordersApi.ts';

// Utils
export { default as orderMappers } from './utils/orderMappers.ts';
export { getMockOrders } from './utils/orderMappers.ts';

// Types
export * from './types/index.ts';

/**
 * Suppliers Feature
 *
 * This file exports all components, hooks, and types for the suppliers feature.
 */

// Components
export { default as SupplierList } from './components/SupplierList';
export { default as SupplierDetails } from './components/SupplierDetails';
export { default as AddSupplierForm } from './components/AddSupplierForm';
// Note: New components are imported directly to avoid circular dependencies
// export { default as SupplierPersonalInfo } from './components/SupplierPersonalInfo';
// export { default as SupplierDocuments } from './components/SupplierDocuments';
// export { default as SupplierProducts } from './components/SupplierProducts';
// export { default as SupplierAnalytics } from './components/SupplierAnalytics';

// Hooks
export { default as useSuppliers } from './hooks/useSuppliers';

// API
export { default as suppliersApi } from './api/suppliersApi';

// Utils
export { default as supplierMappers } from './utils/supplierMappers';
export { getMockSuppliers } from './utils/supplierMappers';

// Types
export * from './types/index';

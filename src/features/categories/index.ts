/**
 * Categories Feature
 *
 * This file exports all components, hooks, and types for the categories feature.
 */

// Components
export { default as CategoryList } from './components/CategoryList';
export { default as CategoryDetails } from './components/CategoryDetails';
export { default as CategoryFilter } from './components/CategoryFilter';
export { default as AddCategoryForm } from './components/AddCategoryForm';
export { default as CategoryTree } from './components/CategoryTree';

// Hooks
export { default as useCategories } from './hooks/useCategories';

// API
export { default as categoriesApi } from './api/categoriesApi';

// Utils
export { default as categoryMappers } from './utils/categoryMappers';
export { getMockCategories } from './utils/categoryMappers';

// Types
export * from './types/index';

/**
 * Categories Feature
 *
 * This file exports all components, hooks, and types for the categories feature.
 */

// Components
export { default as CategoryList } from './components/CategoryList.tsx';
export { default as CategoryDetails } from './components/CategoryDetails.tsx';
export { default as CategoryFilter } from './components/CategoryFilter.tsx';
export { default as AddCategoryForm } from './components/AddCategoryForm.tsx';

// Hooks
export { default as useCategories } from './hooks/useCategories.ts';

// API
export { default as categoriesApi } from './api/categoriesApi.ts';

// Utils
export { default as categoryMappers } from './utils/categoryMappers.ts';
export { getMockCategories } from './utils/categoryMappers.ts';

// Types
export * from './types/index.ts';

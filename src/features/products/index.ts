/**
 * Products Feature Exports
 *
 * This file exports all public APIs from the products feature.
 */

// Hooks
export { default as useProducts } from './hooks/useProducts';

// API
export { default as productsApi } from './api/productsApi';

// Utils
export { default as productTransformers } from './utils/productTransformers';

// Types
export * from './types/index';

// Individual API methods for convenience
export {
  getProducts,
  getProductById,
  createProduct,
  createProductFromFrontend,
  updateProduct,
  updateProductFromFrontend,
  deleteProduct,
  updateProductStatus,
  searchProducts,
  getProductsBySupplier,
  getProductsByCategory,
  uploadProductImages
} from './api/productsApi';

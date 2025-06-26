/**
 * Product Data Transformers
 *
 * This file provides utilities for transforming data between backend and frontend formats.
 */

import type {
  Product,
  BackendProduct,
  ProductFormData,
  FrontendProductFormData,
  ProductQueryParams,
  ProductAttribute,
  ProductVariant,
  BackendProductAttribute,
  BackendProductVariant,
  ApiResponseWrapper,
  PaginationInfo,
  AttributeWithAction,
  VariantWithAction
} from '../types';

/**
 * Transform backend product attribute to frontend format
 */
export const transformAttributeFromBackend = (backendAttr: BackendProductAttribute): ProductAttribute => ({
  id: backendAttr.id.toString(),
  name: backendAttr.key, // Map 'key' to 'name' for frontend
  value: backendAttr.value
});

/**
 * Transform frontend product attribute to backend format
 */
export const transformAttributeToBackend = (frontendAttr: ProductAttribute): AttributeWithAction => ({
  _action: 'create', // Default action for simple transformation
  Key: frontendAttr.name, // Use 'name' from frontend
  Value: frontendAttr.value
});

/**
 * Transform backend product variant to frontend format
 */
export const transformVariantFromBackend = (backendVariant: BackendProductVariant): ProductVariant => ({
  id: backendVariant.id.toString(),
  name: backendVariant.name,
  type: backendVariant.type,
  price: backendVariant.customPrice, // Updated to use customPrice from backend
  stock: backendVariant.stock
});

/**
 * Transform frontend product variant to backend format
 */
export const transformVariantToBackend = (frontendVariant: ProductVariant): VariantWithAction => ({
  _action: 'create', // Default action for simple transformation
  Name: frontendVariant.name,
  Type: frontendVariant.type || 'Standard',
  CustomPrice: frontendVariant.price > 0 ? frontendVariant.price : 0.01, // Ensure price is positive
  Stock: frontendVariant.stock >= 0 ? frontendVariant.stock : 0 // Ensure stock is non-negative
});

/**
 * Transform backend product to frontend format
 */
export const transformProductFromBackend = (backendProduct: BackendProduct): Product => ({
  id: backendProduct.id.toString(), // Convert number to string for frontend
  name: backendProduct.name,
  sku: backendProduct.sku,
  category: backendProduct.category.name, // Extract category name
  categoryId: backendProduct.categoryId,
  price: backendProduct.price,
  stock: backendProduct.stock,
  minimumStock: backendProduct.minimumStock,
  status: backendProduct.stock > 0 ? 'active' : 'out_of_stock', // Derive status from stock
  description: backendProduct.description,
  image: backendProduct.image,
  images: backendProduct.images,
  supplierId: backendProduct.supplierId,
  customerId: backendProduct.customerId,
  attributes: backendProduct.attributes?.map(transformAttributeFromBackend),
  variants: backendProduct.variants?.map(transformVariantFromBackend),
  reviews: backendProduct.reviews,
  createdAt: backendProduct.createdAt,
  updatedAt: backendProduct.updatedAt
});


/**
 * Transform partial frontend form data to backend format for updates
 * Only includes fields that are defined in the input
 */
export const transformPartialFrontendFormToBackend = (formData: Partial<FrontendProductFormData>): Partial<ProductFormData> => {
  const result: Partial<ProductFormData> = {};

  // Only include defined fields with proper type conversion and validation
  if (formData.name !== undefined) result.Name = formData.name;
  if (formData.description !== undefined) result.Description = formData.description;

  // Ensure numeric fields are properly converted and validated
  if (formData.price !== undefined) {
    const price = Number(formData.price);
    if (!isNaN(price) && price >= 0) {
      result.Price = price;
    }
  }

  if (formData.stock !== undefined) {
    const stock = Number(formData.stock);
    if (!isNaN(stock) && Number.isInteger(stock) && stock >= 0) {
      result.Stock = stock;
    }
  }

  if (formData.minimumStock !== undefined) {
    const minimumStock = Number(formData.minimumStock);
    if (!isNaN(minimumStock) && Number.isInteger(minimumStock) && minimumStock >= 0) {
      result.MinimumStock = minimumStock;
    }
  }

  if (formData.categoryId !== undefined) {
    const categoryId = Number(formData.categoryId);
    if (!isNaN(categoryId) && Number.isInteger(categoryId) && categoryId > 0) {
      result.CategoryId = categoryId;
    }
  }

  if (formData.supplierId !== undefined) result.SupplierId = formData.supplierId;
  if (formData.customerId !== undefined) result.CustomerId = formData.customerId;

  // Handle attributes if provided
  if (formData.attributes !== undefined) {
    result.Attributes = formData.attributes.filter(attr => attr.name && attr.value).map(transformAttributeToBackend);
  }

  // Handle variants if provided
  if (formData.variants !== undefined) {
    result.Variants = formData.variants.filter(variant => variant.name && variant.price > 0).map(transformVariantToBackend);
  }

  return result;
};



/**
 * Transform frontend attributes to action-based format for unified API
 */
export const transformAttributesToActions = (
  currentAttributes: ProductAttribute[] = [],
  newAttributes: ProductAttribute[] = []
): AttributeWithAction[] => {
  const actions: AttributeWithAction[] = [];

  // Create actions for new attributes
  newAttributes.forEach(attr => {
    const existingAttr = currentAttributes.find(current => current.id === attr.id);

    if (!existingAttr) {
      // New attribute - create action
      actions.push({
        _action: 'create',
        Key: attr.name,
        Value: attr.value
      });
    } else if (existingAttr.name !== attr.name || existingAttr.value !== attr.value) {
      // Modified attribute - update action
      actions.push({
        _action: 'update',
        ID: parseInt(attr.id),
        Key: attr.name,
        Value: attr.value
      });
    }
  });

  // Create delete actions for removed attributes
  currentAttributes.forEach(current => {
    const stillExists = newAttributes.find(attr => attr.id === current.id);
    if (!stillExists) {
      actions.push({
        _action: 'delete',
        ID: parseInt(current.id)
      });
    }
  });

  return actions;
};

/**
 * Transform frontend variants to action-based format for unified API
 */
export const transformVariantsToActions = (
  currentVariants: ProductVariant[] = [],
  newVariants: ProductVariant[] = []
): VariantWithAction[] => {
  const actions: VariantWithAction[] = [];

  // Create actions for new variants
  newVariants.forEach(variant => {
    const existingVariant = currentVariants.find(current => current.id === variant.id);

    if (!existingVariant) {
      // New variant - create action
      actions.push({
        _action: 'create',
        Name: variant.name,
        Type: variant.type || 'Standard',
        CustomPrice: variant.price,
        Stock: variant.stock
      });
    } else if (
      existingVariant.name !== variant.name ||
      existingVariant.type !== variant.type ||
      existingVariant.price !== variant.price ||
      existingVariant.stock !== variant.stock
    ) {
      // Modified variant - update action
      actions.push({
        _action: 'update',
        ID: parseInt(variant.id),
        Name: variant.name,
        Type: variant.type || 'Standard',
        CustomPrice: variant.price,
        Stock: variant.stock
      });
    }
  });

  // Create delete actions for removed variants
  currentVariants.forEach(current => {
    const stillExists = newVariants.find(variant => variant.id === current.id);
    if (!stillExists) {
      actions.push({
        _action: 'delete',
        ID: parseInt(current.id)
      });
    }
  });

  return actions;
};





/**
 * Transform frontend query parameters to backend format
 */
export const transformQueryParamsToBackend = (params: ProductQueryParams): Record<string, any> => {
  const backendParams: Record<string, any> = {};

  if (params.page !== undefined) backendParams.page = params.page;
  if (params.limit !== undefined) backendParams.limit = params.limit;
  if (params.search !== undefined) backendParams.search = params.search;
  if (params.category !== undefined) backendParams.category = params.category; // Now expects number
  if (params.supplierId !== undefined) backendParams.supplierId = params.supplierId;
  if (params.inStock !== undefined) backendParams.inStock = params.inStock;
  if (params.sort !== undefined) backendParams.sort = params.sort;
  if (params.order !== undefined) backendParams.order = params.order;

  return backendParams;
};

/**
 * Transform backend products list response to frontend format
 */
export const transformProductsListResponse = (response: any): ApiResponseWrapper<Product[]> & { pagination?: PaginationInfo } => {
  // Handle direct array response (fallback)
  if (Array.isArray(response)) {
    return {
      success: true,
      message: 'Products retrieved successfully',
      data: response.map(transformProductFromBackend)
    };
  }

  // Handle wrapped response with pagination
  if (response.success !== undefined && response.data) {
    return {
      success: response.success,
      message: response.message || 'Products retrieved successfully',
      data: Array.isArray(response.data)
        ? response.data.map(transformProductFromBackend)
        : [],
      pagination: response.pagination // Include pagination info
    };
  }

  // Handle unexpected format
  throw new Error('Invalid response format from products API');
};

/**
 * Transform backend product response to frontend format
 * Handles both regular and unified API responses
 */
export const transformProductResponse = (response: any): Product => {
  // Handle direct product response
  if (response.id || response.Id) {
    return transformProductFromBackend(response);
  }

  // Handle wrapped response
  if (response.success && response.data) {
    return transformProductFromBackend(response.data);
  }

  // Handle unified API response (with imageUpload/imagesDeletion info)
  if (response.imageUpload || response.imagesDeletion) {
    // Extract the base product data and transform it
    const productData = { ...response };
    delete productData.imageUpload;
    delete productData.imagesDeletion;
    return transformProductFromBackend(productData);
  }

  throw new Error('Invalid product response format');
};

/**
 * Validate backend response structure
 */
export const validateBackendResponse = <T>(response: any): ApiResponseWrapper<T> => {
  if (!response) {
    throw new Error('No response received from server');
  }

  if (response.success === false) {
    throw new Error(response.message || 'Request failed');
  }

  if (response.success === undefined) {
    // Handle direct data response (legacy)
    return {
      success: true,
      message: 'Request successful',
      data: response
    };
  }

  return response;
};

/**
 * Extract error message from backend response
 */
export const extractErrorMessage = (errorResponse: any): string => {
  if (typeof errorResponse === 'string') {
    return errorResponse;
  }

  if (errorResponse?.message) {
    return errorResponse.message;
  }

  if (errorResponse?.error) {
    return errorResponse.error;
  }

  if (errorResponse?.errors && Array.isArray(errorResponse.errors)) {
    return errorResponse.errors.join(', ');
  }

  return 'An unexpected error occurred';
};





// Export all transformers
export default {
  transformProductFromBackend,
  transformPartialFrontendFormToBackend,
  transformQueryParamsToBackend,
  transformProductsListResponse,
  transformProductResponse,
  validateBackendResponse,
  extractErrorMessage,
  transformAttributeFromBackend,
  transformAttributeToBackend,
  transformVariantFromBackend,
  transformVariantToBackend,
  transformAttributesToActions,
  transformVariantsToActions
};

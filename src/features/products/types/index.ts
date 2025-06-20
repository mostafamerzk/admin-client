/**
 * Products Types
 *
 * This file defines the TypeScript interfaces for the products feature.
 */

// Backend API response wrapper
export interface ApiResponseWrapper<T> {
  success: boolean;
  message: string;
  data: T;
}

// Backend pagination response (matches actual API response)
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Product attribute types (frontend) - keeping original structure for UI compatibility
export interface ProductAttribute {
  id: string;                      // Keep as string for UI compatibility
  name: string;                    // Use 'name' instead of 'key' for UI
  value: string;
  type?: 'text' | 'number' | 'boolean' | 'select';
  unit?: string | undefined;
}

// Product variant types (frontend) - keeping original structure for UI compatibility
export interface ProductVariant {
  id: string;                      // Keep as string for UI compatibility
  name: string;
  sku?: string;                    // Optional since backend may not provide
  type?: string;                   // Optional type field
  price: number;
  stock: number;
  attributes?: Record<string, string>;
  image?: string | undefined;
}

// Backend category interface
export interface BackendCategory {
  id: number;
  name: string;
  description: string;
}

// Backend supplier interface
export interface BackendSupplier {
  id: string;
  name: string;
  email: string;
  phone: string;
}

// Backend customer interface
export interface BackendCustomer {
  id: string;
  name: string;
  email: string;
}

// Backend review interface
export interface BackendReview {
  id: number;
  rating: number;
  comment: string;
  customerName: string;
  createdAt: string;
}

// Backend attribute interface (matches actual API response)
export interface BackendProductAttribute {
  id: number;
  key: string;
  value: string;
}

// Backend variant interface (matches actual API response)
export interface BackendProductVariant {
  id: number;
  name: string;
  type: string;
  price: number;
  stock: number;
}

// Backend product interface matching actual API specification
export interface BackendProduct {
  id: number;                      // Backend uses number IDs
  name: string;                    // Backend uses lowercase
  description: string;             // Backend uses lowercase
  price: number;                   // Backend uses lowercase
  stock: number;                   // Backend uses lowercase
  minimumStock: number;            // Backend uses camelCase
  sku: string;                     // Backend uses lowercase (auto-generated)
  categoryId: number;              // Backend uses categoryId (number)
  supplierId: string;              // Backend uses supplierId (GUID)
  customerId: string | null;       // Backend includes customerId
  image: string;                   // Backend uses single image URL
  images: string[];                // Backend uses array of image URLs
  category: BackendCategory;       // Backend includes full category object
  supplier: BackendSupplier;       // Backend includes full supplier object
  customer: BackendCustomer | null; // Backend includes full customer object
  attributes: BackendProductAttribute[]; // Backend includes attributes array
  variants: BackendProductVariant[]; // Backend includes variants array
  reviews: BackendReview[];        // Backend includes reviews array
  createdAt: string;               // Backend uses camelCase
  updatedAt: string | null;        // Backend uses camelCase, nullable
}

// Frontend product interface (for UI compatibility)
export interface Product {
  id: string;                      // Convert number to string for frontend
  name: string;
  sku: string;
  category: string;                // Category name for display
  categoryId: number;              // Category ID for API calls
  price: number;
  stock: number;
  minimumStock: number;
  status?: 'active' | 'inactive' | 'out_of_stock'; // Add status field for UI compatibility
  description?: string | undefined;
  image?: string | undefined;      // Primary image
  images?: string[] | undefined;   // All images
  supplierId: string;
  customerId?: string | null;      // Include customer ID
  attributes?: ProductAttribute[] | undefined;
  variants?: ProductVariant[] | undefined;
  reviews?: BackendReview[] | undefined; // Include reviews
  createdAt: string;
  updatedAt: string | null;
}

// Form data interface for creating/updating products (matches backend expectations)
export interface ProductFormData {
  Name: string;                    // Backend expects capital N
  Description?: string | undefined; // Backend expects capital D (optional)
  Price: number;                   // Backend expects capital P
  Stock: number;                   // Backend expects capital S
  MinimumStock: number;            // Backend expects capital M and S
  CategoryId: number;              // Backend expects CategoryId (number)
  SupplierId: string;              // Backend expects SupplierId (GUID)
  CustomerId?: string | undefined; // Backend accepts CustomerId (optional)
  Attributes?: {                   // Backend expects this structure
    Key: string;
    Value: string;
  }[] | undefined;
  Variants?: {                     // Backend expects this structure
    Name: string;
    Type: string;
    CustomPrice: number;
    Stock: number;
  }[] | undefined;
  // Images handled separately through upload endpoint
}

// Frontend form data for UI components (matches current form structure)
export interface FrontendProductFormData {
  name: string;
  sku?: string | undefined;        // Optional since backend auto-generates
  category: string;                // Category name for display
  categoryId?: number;             // Category ID for API calls
  price: number;
  stock: number;
  minimumStock: number;
  status?: 'active' | 'inactive' | 'out_of_stock'; // Add status field for UI compatibility
  description?: string | undefined;
  supplierId: string;
  customerId?: string | undefined;
  attributes?: ProductAttribute[] | undefined;
  variants?: ProductVariant[] | undefined;
  images?: string[] | undefined;   // Final image URLs for product update
}

// Frontend form data that allows File objects for images
export interface ProductFormDataWithImages extends Omit<FrontendProductFormData, 'images'> {
  images?: (File | string)[];
}

// Backend API query parameters for products (matches actual API)
export interface ProductQueryParams {
  page?: number;                   // Page number (default: 1)
  limit?: number;                  // Items per page (default: 20, max: 100)
  search?: string;                 // Search in product name and SKU
  category?: number;               // Filter by category ID (number)
  supplierId?: string;             // Filter by supplier ID (GUID format)
  inStock?: boolean;               // Filter products in stock (true/false)
  sort?: 'Name' | 'SKU' | 'Price' | 'Stock' | 'CreatedDate' | 'UpdatedDate';  // Sort field
  order?: 'asc' | 'desc';          // Sort order
}

// Backend products list response
export interface ProductsListResponse extends ApiResponseWrapper<BackendProduct[]> {
  pagination?: PaginationInfo;
}

// Image upload data (the actual data part)
export interface ImageUploadData {
  imageUrls: string[];
  uploadDetails: Array<{
    url: string;
    publicId: string;
    originalName: string;
  }>;
}

// Image upload response (the full API response)
export interface ImageUploadResponse {
  success: boolean;
  message: string;
  data: ImageUploadData;
}

// Image deletion response
export interface ImageDeletionData {
  imageId: number;
  productId: number;
  imageUrl: string;
  cloudinaryDeleted: boolean;
  cloudinaryPublicId: string;
}

export interface ImageDeletionResponse {
  success: boolean;
  message: string;
  data: ImageDeletionData;
}

// Product status update
export interface ProductStatusUpdate {
  status: 'active' | 'inactive' | 'out_of_stock';
}

// Product analytics data
export interface ProductAnalyticsData {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
  averagePrice: number;
  totalValue: number;
  topCategories: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  recentProducts: Product[];
}

// Note: All types are already exported above with their declarations

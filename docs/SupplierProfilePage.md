# Supplier Profile Page

## Overview

The Supplier Profile Page is a comprehensive supplier management interface that follows the exact design patterns and styling used in the UserDetails component and UsersPage layout. It provides a tabbed interface for viewing and managing all aspects of a supplier's profile.

## Features

### Page Structure
- **Tabbed Interface**: Uses the same tabbed design as UserEditPage
- **Consistent Styling**: Applies the same visual patterns from UserDetails
- **Responsive Design**: Works seamlessly on mobile and desktop
- **Error Handling**: Comprehensive error boundaries and loading states

### Required Tabs/Sections

#### 1. Personal Information Tab
- Displays supplier's basic details (name, contact info, address, etc.)
- Uses DetailSection, DetailList, and DetailItem components
- Includes supplier logo/avatar display
- Shows verification status with appropriate icons and badges

#### 2. Verification Documents Tab
- Shows documents submitted for supplier verification
- Displays document names, types, upload dates, and verification status
- Includes document preview/download functionality
- Provides approve/reject actions for pending documents

#### 3. Products Tab
- Displays supplier's products in a data table format
- Includes columns: Product Name, SKU, Category, Price, Stock, Status
- Action icons for each product row:
  - Eye icon (view product details)
  - Edit icon (edit product)
  - Delete icon (delete product)
- Uses the same DataTable component styling as other pages

#### 4. Analytics Tab
- Displays supplier performance metrics and charts
- Includes sales analytics, product performance, order trends
- Uses the same analytics components and styling as other analytics pages
- Shows key metrics: Total Orders, Revenue, Products, Average Order Value

## Technical Implementation

### File Structure
```
src/
├── pages/
│   └── SupplierProfilePage.tsx          # Main page component
├── features/suppliers/
│   ├── components/
│   │   ├── SupplierPersonalInfo.tsx     # Personal information tab
│   │   ├── SupplierDocuments.tsx        # Verification documents tab
│   │   ├── SupplierProducts.tsx         # Products tab
│   │   └── SupplierAnalytics.tsx        # Analytics tab (updated)
│   ├── types/
│   │   └── index.ts                     # Updated with new types
│   └── index.ts                         # Updated exports
├── constants/
│   └── routes.ts                        # Added new route
└── App.tsx                              # Added route configuration
```

### New Types Added

```typescript
// Product types for supplier products
export interface SupplierProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

// Document types for verification documents
export interface SupplierDocument {
  id: string;
  name: string;
  type: 'business_license' | 'tax_certificate' | 'insurance' | 'certification' | 'other';
  fileName: string;
  fileSize: number;
  uploadDate: string;
  status: 'pending' | 'approved' | 'rejected';
  url: string;
  notes?: string;
}

// Analytics types for supplier performance
export interface SupplierAnalyticsData {
  totalOrders: number;
  totalRevenue: number;
  productCount: number;
  averageOrderValue: number;
  revenueHistory: { date: string; amount: number; }[];
  salesByProduct: { productName: string; amount: number; quantity: number; }[];
  orderTrends: { date: string; orders: number; }[];
  topCategories: { category: string; revenue: number; percentage: number; }[];
}
```

### Routes

- **Route Path**: `/suppliers/:id/profile`
- **Helper Function**: `getSupplierProfileRoute(id: string)`
- **Navigation**: Accessible from supplier list or supplier details

## Usage

### Accessing the Page
```typescript
import { ROUTES } from '../constants/routes';

// Navigate to supplier profile
navigate(ROUTES.getSupplierProfileRoute(supplierId));
```

### Component Usage
```typescript
import { SupplierProfilePage } from '../pages/SupplierProfilePage';

// The page automatically handles:
// - Loading supplier data
// - Tab navigation
// - Error states
// - Responsive design
```

## Design Consistency

### Visual Elements
- **Colors**: Uses the same color scheme as UserDetails
- **Typography**: Consistent font sizes and weights
- **Spacing**: Matches existing component spacing patterns
- **Icons**: Uses Heroicons for consistency

### Component Patterns
- **DetailSection**: For structured information display
- **DetailList/DetailItem**: For key-value pair information
- **DataTable**: For tabular data with sorting and pagination
- **StatusBadge**: For status indicators
- **Modal**: For detailed views and confirmations

### Accessibility
- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Proper focus handling in modals
- **Color Contrast**: Meets WCAG guidelines

## Error Handling

### Loading States
- Centered loading spinner during data fetch
- Skeleton loading for individual components
- Progressive loading for different tabs

### Error States
- Comprehensive error messages
- Fallback UI for missing data
- Retry mechanisms for failed requests
- User-friendly error notifications

## Testing

### Recommended Tests
1. **Component Rendering**: Verify all tabs render correctly
2. **Data Loading**: Test loading states and error handling
3. **User Interactions**: Test tab switching and modal interactions
4. **Responsive Design**: Test on different screen sizes
5. **Accessibility**: Test keyboard navigation and screen readers

### Mock Data
The implementation includes comprehensive mock data for development and testing purposes, covering all data types and edge cases.

## Future Enhancements

### Potential Improvements
1. **Real-time Updates**: WebSocket integration for live data
2. **Advanced Filtering**: Enhanced filtering options for products
3. **Bulk Operations**: Bulk actions for products and documents
4. **Export Functionality**: Export supplier data to various formats
5. **Audit Trail**: Track changes and user actions

### Integration Points
- **API Integration**: Ready for backend API integration
- **State Management**: Compatible with Redux or other state managers
- **Caching**: Supports data caching strategies
- **Internationalization**: Ready for i18n implementation

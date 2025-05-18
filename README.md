# ConnectChain Admin Panel

A modern, feature-rich admin panel for the ConnectChain platform, built with React, TypeScript, and Tailwind CSS.

## Features

- **User Management**: View, search, and manage user accounts
- **Supplier Management**: Manage suppliers and their verification process
- **Category Management**: Create and manage product categories
- **Order Management**: View and process customer orders
- **Dashboard**: Real-time analytics and statistics
- **Settings**: Configure platform settings and preferences
- **Enhanced Performance**: Route preloading and code splitting
- **Robust Error Handling**: Comprehensive error boundaries
- **Advanced API Layer**: Caching, retry logic, and error handling

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router
- **Charts**: Chart.js with React-Chartjs-2
- **UI Components**: Custom component library, Headless UI
- **Icons**: Heroicons
- **HTTP Client**: Axios with enhanced features

## Project Structure

The project follows a feature-based architecture:

```
src/
├── api/                        # Enhanced API client architecture
│   └── client/                 # API client implementation
│       ├── cache.ts            # API response caching
│       ├── index.ts            # Main ApiClient class
│       ├── interceptors.ts     # Request/response interceptors
│       ├── middlewares.ts      # API middleware system
│       └── types.ts            # API type definitions
├── assets/                     # Images, fonts, static resources
├── components/                 # Reusable UI components
│   ├── common/                 # Generic components (Button, Table, Modal)
│   │   ├── PageLoader.tsx      # Enhanced loading component
│   │   ├── ErrorBoundary.tsx   # Error handling component
│   │   └── NotificationsContainer.tsx # Global notification system
│   ├── layout/                 # Sidebar, Navbar, structural components
├── features/                   # Feature-specific modules
│   ├── dashboard/              # Dashboard components, hooks, API
│   ├── users/                  # User management
│   ├── suppliers/              # Supplier management
│   ├── verifications/          # Supplier verifications
│   ├── categories/             # Category management
│   ├── orders/                 # Order management
│   ├── analytics/              # Analytics components and hooks
│   │   ├── api/                # Analytics API services
│   │   ├── components/         # Analytics-specific components
│   │   ├── hooks/              # Analytics custom hooks
│   │   └── types/              # Analytics type definitions
│   ├── settings/               # Platform settings
├── hooks/                      # Custom hooks (useAuth, useFetch, useApi, etc.)
├── pages/                      # Top-level page components
├── services/                   # API and authentication logic
│   ├── api.ts                  # Enhanced API service
│   └── mockApi.ts              # Mock API implementation
├── utils/                      # Utility functions and helpers
│   ├── routePreloader.ts       # Route preloading utilities
│   ├── formatters.ts           # Data formatting utilities
│   ├── errorHandling.ts        # Error handling utilities
│   └── chartConfig.ts          # Chart.js configuration
├── context/                    # React Context providers for global state
├── styles/                     # Tailwind configuration and global CSS
├── constants/                  # Routes, API endpoints, config values
├── mockData/                   # Mock data for development
├── App.tsx                     # Main application component
├── index.tsx                   # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-organization/connectchain-admin.git
   cd connectchain-admin
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

### Development Mode

The application uses mock data in development mode. You can find and modify the mock data in the `src/mockData` directory.

### Authentication

For development, you can use the following credentials:
- Email: admin@connectchain.com
- Password: password123

## Key Components

### Common Components

- **Button**: Customizable button component with various styles and states
- **Card**: Container component for displaying content in a box
- **DataTable**: Table component with sorting, filtering, and pagination
- **Modal**: Dialog component for displaying content in a modal
- **Badge**: Component for displaying status indicators
- **Avatar**: Component for displaying user avatars
- **PageLoader**: Enhanced loading component with accessibility features
- **ErrorBoundary**: Component for graceful error handling
- **NotificationsContainer**: Global notification system for displaying alerts and messages

### Layout Components

- **MainLayout**: Main layout component that includes the sidebar, header, and content area
- **Sidebar**: Navigation sidebar component
- **Header**: Top header component with user profile and notifications
- **PageHeader**: Page header component with title, description, and actions

### Analytics Components

- **TimeRangeSelector**: Component for selecting time ranges for analytics data
- **MetricCard**: Card component for displaying key metrics with growth indicators
- **BarChart**: Component for displaying bar charts using Chart.js
- **PieChart**: Component for displaying pie charts using Chart.js
- **SupplierTable**: Table component for displaying supplier performance data

### Context Providers

- **AuthContext**: Authentication state and methods
- **UIContext**: UI state like sidebar open/closed
- **NotificationContext**: Global notification system

### Custom Hooks

- **useAuth**: Hook for authentication state and methods
- **useFetch**: Hook for data fetching with loading and error states
- **useNotification**: Hook for displaying notifications
- **useUI**: Hook for UI state and methods
- **useApi**: Enhanced hook for API interactions with TypeScript support
- **useAnalytics**: Hook for working with analytics data

### Enhanced API Service

The application includes an enhanced API client architecture with the following features:

```typescript
import { defaultApiClient } from '@/api/client';

// GET request with caching
const data = await defaultApiClient.get('/endpoint');

// POST request with retry logic
const response = await defaultApiClient.post('/endpoint', data);

// Configure cache settings
defaultApiClient.setCacheConfig({ ttl: 10 * 60 * 1000 }); // 10 minutes

// Configure retry settings
defaultApiClient.setRetryConfig({ maxRetries: 5 });

// Create custom API client with specific middleware
const customClient = createApiClient(baseURL, [
  customMiddleware,
  loggingMiddleware
]);
```

The API client architecture includes:

- **Middleware System**: Extensible middleware for request/response processing
- **Caching**: Automatic caching of GET requests with configurable TTL
- **Retry Logic**: Automatic retry for failed requests with exponential backoff
- **Error Handling**: Comprehensive error handling and transformation
- **Interceptors**: Request and response interceptors for global processing

### Route Preloading

The application implements route preloading for better performance:

```typescript
import { preloadRoute, preloadOnHover } from '@/utils/routePreloader';

// Preload a specific route
preloadRoute(() => import('./pages/DashboardPage'), 'dashboard');

// Preload on hover
preloadOnHover(() => import('./pages/DashboardPage'), 'dashboard');
```

## Performance Optimizations

- **Code Splitting**: Lazy loading of page components
- **Route Preloading**: Preloading routes for faster navigation
- **API Caching**: Caching API responses to reduce server load
- **Retry Logic**: Automatic retry for failed API requests
- **Memoization**: React.memo, useMemo, and useCallback for preventing unnecessary renders
- **Pagination**: Efficient data loading for large datasets
- **Debouncing**: Preventing excessive API calls for search inputs

## Error Handling

The application implements comprehensive error handling:

```typescript
<ErrorBoundary
  fallback={<CustomErrorComponent />}
  onError={(error, errorInfo) => {
    // Log to error tracking service
    console.error(error, errorInfo);
  }}
>
  <YourComponent />
</ErrorBoundary>
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Route Protection**: Preventing unauthorized access to protected routes
- **Input Sanitization**: Preventing XSS attacks
- **HTTPS**: Secure API communication
- **CSRF Protection**: Preventing cross-site request forgery
- **API Error Handling**: Comprehensive error handling for API requests

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

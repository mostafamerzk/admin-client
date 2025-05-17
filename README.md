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
- **UI Components**: Custom component library
- **Icons**: Heroicons
- **HTTP Client**: Axios with enhanced features

## Project Structure

The project follows a feature-based architecture:

```
src/
├── assets/                     # Images, fonts, static resources
├── components/                 # Reusable UI components
│   ├── common/                 # Generic components (Button, Table, Modal)
│   │   ├── PageLoader.tsx      # Enhanced loading component
│   │   ├── ErrorBoundary.tsx   # Error handling component
│   │   └── NotificationsContainer.tsx
│   ├── layout/                 # Sidebar, Navbar, structural components
├── features/                   # Feature-specific modules
│   ├── dashboard/              # Dashboard components, hooks, API
│   ├── users/                  # User management
│   ├── suppliers/              # Supplier management
│   ├── verifications/          # Supplier verifications
│   ├── categories/             # Category management
│   ├── orders/                 # Order management
│   ├── settings/               # Platform settings
├── hooks/                      # Custom hooks (useAuth, useFetch, etc.)
├── pages/                      # Top-level page components
├── services/                   # API and authentication logic
│   ├── api.ts                  # Enhanced API service
│   └── mockApi.ts              # Mock API implementation
├── utils/                      # Utility functions and helpers
│   └── routePreloader.ts       # Route preloading utilities
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

### Layout Components

- **MainLayout**: Main layout component that includes the sidebar, header, and content area
- **Sidebar**: Navigation sidebar component
- **Header**: Top header component with user profile and notifications
- **PageHeader**: Page header component with title, description, and actions

### Context Providers

- **AuthContext**: Authentication state and methods
- **UIContext**: UI state like sidebar open/closed
- **NotificationContext**: Global notification system

### Custom Hooks

- **useAuth**: Hook for authentication state and methods
- **useFetch**: Hook for data fetching with loading and error states
- **useNotification**: Hook for displaying notifications
- **useUI**: Hook for UI state and methods

### Enhanced API Service

The application includes an enhanced API service with the following features:

```typescript
import api from '@/services/api';

// GET request with caching
const data = await api.get('/endpoint');

// POST request with retry logic
const response = await api.post('/endpoint', data);

// Configure cache settings
api.setCacheConfig({ ttl: 10 * 60 * 1000 }); // 10 minutes

// Configure retry settings
api.setRetryConfig({ maxRetries: 5 });
```

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
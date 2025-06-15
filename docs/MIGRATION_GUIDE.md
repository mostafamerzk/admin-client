# API Refactoring Migration Guide

This document provides guidance for migrating from deprecated API patterns to the new standardized approach.

## Overview

As part of our API code duplication refactoring, several patterns have been deprecated in favor of more robust, feature-specific solutions.

## Deprecated: useEntityApi Hook

### Status: ⚠️ DEPRECATED

The `useEntityApi` hook has been deprecated and will be removed in a future version.

### Why was it deprecated?

1. **Limited functionality**: Basic CRUD operations without advanced features
2. **No error handling**: Lacks proper error categorization and user notifications
3. **No caching**: Missing performance optimizations
4. **Generic approach**: Doesn't leverage feature-specific business logic
5. **Maintenance overhead**: Duplicate functionality with better alternatives

### Migration Options

#### Option 1: Use Feature-Specific Hooks (Recommended)

**Before (Deprecated):**
```typescript
import { useEntityApi } from '../hooks/useApi';

function MyComponent() {
  const { create, read, update, remove, data, loading, error } = useEntityApi('/users');
  
  const handleCreate = () => {
    create({ name: 'John', email: 'john@example.com' });
  };
  
  const handleFetch = () => {
    read(); // Fetch all users
  };
  
  const handleUpdate = (id: string) => {
    update(id, { name: 'Jane' });
  };
  
  const handleDelete = (id: string) => {
    remove(id);
  };
  
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {/* Render data */}
    </div>
  );
}
```

**After (Recommended):**
```typescript
import { useUsers } from '../features/users/hooks/useUsers';

function MyComponent() {
  const { 
    entities: users, 
    isLoading, 
    error, 
    createEntity, 
    fetchEntities, 
    updateEntity, 
    deleteEntity 
  } = useUsers();
  
  const handleCreate = async () => {
    try {
      await createEntity({ name: 'John', email: 'john@example.com' });
      // Success notification is handled automatically
    } catch (error) {
      // Error notification is handled automatically
    }
  };
  
  const handleUpdate = async (id: string) => {
    try {
      await updateEntity(id, { name: 'Jane' });
    } catch (error) {
      // Error handling is automatic
    }
  };
  
  const handleDelete = async (id: string) => {
    try {
      await deleteEntity(id);
    } catch (error) {
      // Error handling is automatic
    }
  };
  
  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {/* Render users */}
    </div>
  );
}
```

#### Option 2: Use useEntityData with API Service

**For custom entities or when feature-specific hooks don't exist:**

```typescript
import { useEntityData } from '../hooks/useEntityData';
import { myCustomApi } from '../api/myCustomApi';

function MyComponent() {
  const { 
    entities, 
    isLoading, 
    error, 
    createEntity, 
    fetchEntities, 
    updateEntity, 
    deleteEntity 
  } = useEntityData(myCustomApi, { 
    entityName: 'custom-entities',
    initialFetch: true 
  });
  
  // Same usage pattern as feature-specific hooks
}
```

### Benefits of Migration

#### ✅ Feature-Specific Hooks Benefits:
- **Automatic error handling** with user-friendly notifications
- **Built-in caching** for better performance
- **Type safety** with proper TypeScript interfaces
- **Business logic integration** specific to each feature
- **Consistent UX** across the application
- **Automatic state management** with optimistic updates

#### ✅ useEntityData Benefits:
- **Standardized error handling** across all entities
- **Notification system integration** for success/error messages
- **Flexible API service integration** for custom entities
- **Performance optimizations** with refs and memoization
- **Consistent loading states** and error management

### Available Feature-Specific Hooks

| Feature | Hook | Import Path |
|---------|------|-------------|
| Users | `useUsers()` | `../features/users/hooks/useUsers` |
| Categories | `useCategories()` | `../features/categories/hooks/useCategories` |
| Suppliers | `useSuppliers()` | `../features/suppliers/hooks/useSuppliers` |
| Orders | `useOrders()` | `../features/orders/hooks/useOrders` |
| Authentication | `useAuth()` | `../features/auth/hooks/useAuth` |
| Profile | `useProfile()` | `../features/profile/hooks/useProfile` |

### Migration Checklist

- [ ] Identify all usages of `useEntityApi` in your codebase
- [ ] Determine if a feature-specific hook exists for your use case
- [ ] Replace `useEntityApi` with the appropriate alternative
- [ ] Update error handling (remove manual error handling if using feature hooks)
- [ ] Update loading state management
- [ ] Test the migrated functionality
- [ ] Remove any unused imports

### Timeline

- **Phase 1** (Current): `useEntityApi` is deprecated with warnings
- **Phase 2** (Next release): `useEntityApi` will be marked for removal
- **Phase 3** (Future release): `useEntityApi` will be completely removed

### Need Help?

If you encounter issues during migration or need assistance:

1. Check if a feature-specific hook exists for your use case
2. Review the examples in this migration guide
3. Look at existing components that use the new patterns
4. Consider using `useEntityData` for custom entities

### Related Documentation

- [API Response Helpers](../src/utils/apiHelpers.ts) - Standardized response validation
- [Error Handling](../src/utils/errorHandling.ts) - Centralized error management
- [useEntityData Hook](../src/hooks/useEntityData.ts) - Generic entity management
- [Feature-Specific Hooks](../src/features/) - Individual feature hooks

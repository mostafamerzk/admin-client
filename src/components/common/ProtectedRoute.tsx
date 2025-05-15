/**
 * ProtectedRoute Component
 * 
 * A route component that protects routes from unauthorized access.
 */

import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.ts';
import { ROUTES } from '../../constants/routes.ts';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: ('admin' | 'customer' | 'supplier')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }
  
  // Check role-based access if requiredRoles is provided
  if (requiredRoles && requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.includes(user.type as any);
    
    if (!hasRequiredRole) {
      // Redirect to dashboard with unauthorized message
      return <Navigate to={ROUTES.DASHBOARD} replace />;
    }
  }
  
  // Render children if authenticated and authorized
  return <>{children}</>;
};

export default ProtectedRoute;

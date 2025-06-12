/**
 * Higher-Order Component for Error Boundary
 * 
 * This HOC wraps components with an error boundary to catch and handle errors gracefully.
 */

import React, { ComponentType, forwardRef } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { reportError } from '../../utils/errorHandling';

interface ErrorBoundaryConfig {
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  enableReporting?: boolean;
  context?: string;
}

/**
 * Default error fallback component
 */
const DefaultErrorFallback: React.FC<{ error: Error; resetError: () => void }> = ({ 
  error, 
  resetError 
}) => (
  <div className="flex flex-col items-center justify-center min-h-[200px] p-4 border border-red-200 rounded-lg bg-red-50">
    <div className="text-red-500 text-2xl mb-2">⚠️</div>
    <h3 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h3>
    <p className="text-red-600 text-sm mb-4 text-center max-w-md">
      {error.message || 'An unexpected error occurred'}
    </p>
    <button
      onClick={resetError}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
    >
      Try Again
    </button>
  </div>
);

/**
 * Higher-order component that wraps a component with an error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: ComponentType<P>,
  config: ErrorBoundaryConfig = {}
) {
  const {
    fallback: FallbackComponent = DefaultErrorFallback,
    onError,
    enableReporting = true,
    context
  } = config;

  const WrappedComponent = forwardRef<any, P>((props, ref) => {
    const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
      // Report error if enabled
      if (enableReporting) {
        reportError(error, context || Component.displayName || Component.name, {
          componentStack: errorInfo.componentStack,
          errorBoundary: true
        });
      }

      // Call custom error handler if provided
      if (onError) {
        onError(error, errorInfo);
      }
    };

    return (
      <ErrorBoundary
        fallback={<FallbackComponent error={new Error()} resetError={() => window.location.reload()} />}
        onError={handleError}
      >
        <Component {...(props as any)} ref={ref} />
      </ErrorBoundary>
    );
  });

  // Set display name for debugging
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

/**
 * Hook for creating error boundary configuration
 */
export const useErrorBoundaryConfig = (
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void,
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>,
  context?: string
): ErrorBoundaryConfig => {
  return {
    ...(onError && { onError }),
    ...(fallback && { fallback }),
    ...(context && { context }),
    enableReporting: true
  };
};

/**
 * Decorator for class components
 */
export const errorBoundary = (config: ErrorBoundaryConfig = {}) => {
  return <P extends object>(Component: ComponentType<P>) => {
    return withErrorBoundary(Component, config);
  };
};

export default withErrorBoundary;

/**
 * Route Preloader Utility
 * 
 * This utility provides functions for preloading routes and managing route loading states.
 * It helps improve perceived performance by loading routes before they're needed.
 */

// Map to store preloaded components
const preloadedComponents = new Map<string, Promise<any>>();

/**
 * Preloads a route component
 * @param importFn The dynamic import function for the route component
 * @param routeName The name of the route for caching
 */
export const preloadRoute = (importFn: () => Promise<any>, routeName: string): void => {
  if (!preloadedComponents.has(routeName)) {
    preloadedComponents.set(routeName, importFn());
  }
};

/**
 * Gets a preloaded component
 * @param routeName The name of the route
 * @returns The preloaded component or undefined if not preloaded
 */
export const getPreloadedComponent = (routeName: string): Promise<any> | undefined => {
  return preloadedComponents.get(routeName);
};

/**
 * Preloads a route when the user hovers over a link
 * @param importFn The dynamic import function for the route component
 * @param routeName The name of the route
 */
export const preloadOnHover = (importFn: () => Promise<any>, routeName: string): void => {
  const preload = () => {
    preloadRoute(importFn, routeName);
    // Remove event listeners after preloading
    document.removeEventListener('mouseover', preload);
    document.removeEventListener('touchstart', preload);
  };

  document.addEventListener('mouseover', preload);
  document.addEventListener('touchstart', preload);
};

/**
 * Preloads multiple routes
 * @param routes Array of route configurations
 */
export const preloadRoutes = (routes: Array<{ importFn: () => Promise<any>; name: string }>): void => {
  routes.forEach(({ importFn, name }) => {
    preloadRoute(importFn, name);
  });
};

/**
 * Clears all preloaded components
 */
export const clearPreloadedComponents = (): void => {
  preloadedComponents.clear();
}; 
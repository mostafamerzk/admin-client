/**
 * UI Context
 * 
 * This context provides UI state and methods to the entire application.
 * It handles sidebar state, notifications, and other UI-related state.
 */

import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface UIContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
  isMobile: boolean;
}

// Create the context with a default value
export const UIContext = createContext<UIContextType>({
  isSidebarOpen: true,
  toggleSidebar: () => {},
  closeSidebar: () => {},
  openSidebar: () => {},
  isMobile: false,
});

interface UIProviderProps {
  children: ReactNode;
}

export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(!isMobile);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);
      
      // If transitioning from mobile to desktop, open the sidebar
      if (isMobile && !newIsMobile) {
        setIsSidebarOpen(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Close sidebar
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  
  // Open sidebar
  const openSidebar = () => {
    setIsSidebarOpen(true);
  };
  
  // Context value
  const value = {
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
    openSidebar,
    isMobile,
  };
  
  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};

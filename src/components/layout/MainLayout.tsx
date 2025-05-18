/**
 * MainLayout Component
 * 
 * The main layout component that wraps all pages.
 * It includes the sidebar, header, and main content area.
 */

import React, { memo } from 'react';
import type { ReactNode } from 'react';
import Sidebar from './Sidebar.tsx';
import Header from './Header.tsx';
import useUI from '../../hooks/useUI.ts';

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
  testId?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  className = '',
  testId,
}) => {
  const { isSidebarOpen, isMobile } = useUI();
  
  return (
    <div 
      className="min-h-screen bg-background flex"
      data-testid={testId}
    >
      <Sidebar />
      
      <div 
        className={`flex-1 transition-all duration-300 ${
          isMobile ? '' : isSidebarOpen ? 'md:ml-64' : 'md:ml-20'
        } ${className}`}
      >
        <Header />
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default memo(MainLayout);

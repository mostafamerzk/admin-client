/**
 * useUI Hook
 * 
 * This hook provides easy access to the UI context.
 */

import { useContext } from 'react';
import { UIContext } from '../context/UIContext.tsx';

const useUI = () => {
  const context = useContext(UIContext);
  
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  
  return context;
};

export default useUI;

/**
 * useNotification Hook
 * 
 * This hook provides easy access to the notification context.
 */

import { useContext } from 'react';
import { NotificationContext, NotificationType } from '../context/NotificationContext.tsx';

const useNotification = () => {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  
  // Helper methods for common notification types
  const showSuccess = (message: string, title?: string, duration?: number) => {
    context.addNotification({
      type: 'success',
      message,
      title,
      duration,
    });
  };
  
  const showError = (message: string, title?: string, duration?: number) => {
    context.addNotification({
      type: 'error',
      message,
      title,
      duration,
    });
  };
  
  const showWarning = (message: string, title?: string, duration?: number) => {
    context.addNotification({
      type: 'warning',
      message,
      title,
      duration,
    });
  };
  
  const showInfo = (message: string, title?: string, duration?: number) => {
    context.addNotification({
      type: 'info',
      message,
      title,
      duration,
    });
  };
  
  return {
    ...context,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

export default useNotification;

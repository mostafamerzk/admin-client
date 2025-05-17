/**
 * useNotification Hook
 *
 * This hook provides easy access to the notification context.
 */

import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext.tsx';

export interface NotificationOptions {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

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

  // Generic notification method
  const showNotification = (options: NotificationOptions) => {
    context.addNotification({
      type: options.type,
      title: options.title,
      message: options.message,
      duration: options.duration,
    });
  };

  return {
    ...context,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showNotification,
  };
};

export default useNotification;

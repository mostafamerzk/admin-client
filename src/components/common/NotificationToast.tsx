/**
 * NotificationToast Component
 * 
 * A toast notification component for displaying messages to the user.
 */

import React, { useEffect, useState, memo } from 'react';
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  InformationCircleIcon, 
  XMarkIcon 
} from '@heroicons/react/24/outline';
import type { Notification, NotificationType } from '../../context/NotificationContext.tsx';

interface NotificationToastProps {
  notification: Notification;
  onClose: (id: string) => void;
  className?: string;
  testId?: string;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose,
  className = '',
  testId,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  
  // Auto-close notification after duration
  useEffect(() => {
    if (notification.duration === Infinity) return;
    
    const startTime = Date.now();
    const endTime = startTime + (notification.duration || 0);
    
    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = endTime - now;
      const newProgress = (remaining / (notification.duration || 0)) * 100;
      
      setProgress(Math.max(0, newProgress));
      
      if (now >= endTime) {
        clearInterval(timer);
        setIsVisible(false);
        setTimeout(() => onClose(notification.id), 300); // Allow time for exit animation
      }
    }, 16); // ~60fps
    
    return () => clearInterval(timer);
  }, [notification.id, notification.duration, onClose]);
  
  // Handle close button click
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(notification.id), 300); // Allow time for exit animation
  };
  
  // Icon based on notification type
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'error':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />;
      case 'info':
      default:
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
    }
  };
  
  // Background color based on notification type
  const getBgColor = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };
  
  // Progress bar color based on notification type
  const getProgressColor = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
      default:
        return 'bg-blue-500';
    }
  };
  
  return (
    <div 
      className={`
        max-w-sm w-full shadow-lg rounded-lg pointer-events-auto border overflow-hidden
        transition-all duration-300 transform
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
        ${getBgColor(notification.type)}
        ${className}
      `}
      role="alert"
      aria-live="assertive"
      data-testid={testId}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon(notification.type)}
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            {notification.title && (
              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">{notification.message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="bg-transparent rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              onClick={handleClose}
              aria-label="Close notification"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      {notification.duration !== Infinity && (
        <div className="h-1 w-full bg-gray-200">
          <div 
            className={`h-full ${getProgressColor(notification.type)} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default memo(NotificationToast);

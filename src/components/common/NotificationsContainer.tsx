/**
 * NotificationsContainer Component
 * 
 * A container for displaying toast notifications.
 */

import React, { memo } from 'react';
import { createPortal } from 'react-dom';
import NotificationToast from './NotificationToast';
import useNotification from '../../hooks/useNotification';

interface NotificationsContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  className?: string;
  testId?: string;
}

const NotificationsContainer: React.FC<NotificationsContainerProps> = ({
  position = 'top-right',
  className = '',
  testId,
}) => {
  const { notifications, removeNotification } = useNotification();
  
  if (notifications.length === 0) return null;
  
  // Position classes
  const positionClasses = {
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'top-center': 'top-0 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-0 left-1/2 transform -translate-x-1/2',
  };
  
  const containerClasses = `
    fixed z-50 p-4 max-h-screen overflow-hidden pointer-events-none
    ${positionClasses[position]}
    ${className}
  `;
  
  // Render notifications in a portal
  return createPortal(
    <div 
      className={containerClasses}
      aria-live="polite"
      data-testid={testId}
    >
      <div className="flex flex-col space-y-2 pointer-events-none">
        {notifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <NotificationToast
              notification={notification}
              onClose={removeNotification}
              testId={`${testId}-notification-${notification.id}`}
            />
          </div>
        ))}
      </div>
    </div>,
    document.body
  );
};

export default memo(NotificationsContainer);

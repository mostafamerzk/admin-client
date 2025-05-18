/**
 * Modal Component
 * 
 * A reusable modal dialog component.
 */

import React, { Fragment, useEffect, useRef, memo } from 'react';
import type { ReactNode } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { createPortal } from 'react-dom';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string | ReactNode;
  children: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  footer?: ReactNode;
  closeOnEsc?: boolean;
  closeOnBackdropClick?: boolean;
  showCloseButton?: boolean;
  centered?: boolean;
  className?: string;
  bodyClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  backdropClassName?: string;
  testId?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  footer,
  closeOnEsc = true,
  closeOnBackdropClick = true,
  showCloseButton = true,
  centered = true,
  className = '',
  bodyClassName = '',
  headerClassName = '',
  footerClassName = '',
  backdropClassName = '',
  testId,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Handle Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent scrolling on the body when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, closeOnEsc]);
  
  // Focus trap inside modal
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    
    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };
    
    document.addEventListener('keydown', handleTabKey);
    firstElement.focus();
    
    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen]);

  if (!isOpen) return null;
  
  // Size classes
  const sizeClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };
  
  // Modal content
  const modalContent = (
    <Fragment>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${backdropClassName}`}
        onClick={closeOnBackdropClick ? onClose : undefined}
        data-testid={`${testId}-backdrop`}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className={`flex min-h-full items-${centered ? 'center' : 'start'} justify-center p-4 text-center`}>
          <div 
            ref={modalRef}
            className={`${sizeClasses[size]} w-full transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all ${className}`}
            onClick={(e) => e.stopPropagation()}
            data-testid={testId}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b border-gray-100 ${headerClassName}`}>
              {typeof title === 'string' ? (
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              ) : (
                title
              )}
              {showCloseButton && (
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1"
                  onClick={onClose}
                  aria-label="Close modal"
                  data-testid={`${testId}-close-button`}
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              )}
            </div>

            {/* Content */}
            <div className={`px-6 py-4 ${bodyClassName}`}>
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className={`px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3 ${footerClassName}`}>
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
  
  // Use portal to render modal at the end of the document body
  return createPortal(modalContent, document.body);
};

export default memo(Modal);

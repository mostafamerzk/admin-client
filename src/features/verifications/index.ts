/**
 * Verifications Feature
 *
 * This file exports all components, hooks, and types for the verifications feature.
 */

// Components
export { default as VerificationList } from './components/VerificationList.tsx';
export { default as VerificationDetails } from './components/VerificationDetails.tsx';
export { default as ApproveVerificationModal } from './components/ApproveVerificationModal.tsx';
export { default as RejectVerificationModal } from './components/RejectVerificationModal.tsx';

// Hooks
export { default as useVerifications } from './hooks/useVerifications.ts';

// API
export { default as verificationsApi } from './api/verificationsApi.ts';

// Types
export * from './types/index.ts';

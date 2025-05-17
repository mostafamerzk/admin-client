/**
 * Profile Feature
 *
 * This file exports all components, hooks, and types for the profile feature.
 */

// Components
export { default as ProfileTabs } from './components/ProfileTabs.tsx';
export { default as ProfileInfo } from './components/ProfileInfo.tsx';
export { default as SecuritySettings } from './components/SecuritySettings.tsx';
export { default as NotificationSettings } from './components/NotificationSettings.tsx';
export { default as ActivityLog } from './components/ActivityLog.tsx';

// Hooks
export { default as useProfile } from './hooks/useProfile.ts';

// API
export { default as profileApi } from './api/profileApi.ts';

// Types
export * from './types/index.ts';

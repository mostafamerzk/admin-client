/**
 * Profile Types
 *
 * This file defines the TypeScript interfaces for the profile feature.
 */

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
  joinDate: string;
  twoFactorEnabled: boolean;
  notificationsEnabled: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  adminNotifications?: {
    newUsers: boolean;
    newOrders: boolean;
    supplierVerifications: boolean;
  };
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
  };
  lastLogin: string;
  lastIp: string;
}

export interface ProfileUpdateRequest {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface SecurityUpdateRequest {
  twoFactorEnabled?: boolean;
}

export interface NotificationUpdateRequest {
  email?: boolean;
  push?: boolean;
  sms?: boolean;
  adminNotifications?: {
    newUsers?: boolean;
    newOrders?: boolean;
    supplierVerifications?: boolean;
  };
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ActivityLogItem {
  id: number;
  content: string;
  date: string;
  type: 'login' | 'password' | 'security' | 'profile' | 'account';
  icon?: React.ReactNode;
}

export type ProfileTab = 'profile' | 'security' | 'notifications' | 'activity';

// Type aliases for backward compatibility and consistency
export type Profile = UserProfile;
export type ProfileUpdateData = ProfileUpdateRequest;
export type PasswordChangeData = PasswordChangeRequest;

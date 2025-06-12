/**
 * Settings Types
 *
 * This file defines the TypeScript interfaces for the settings feature.
 */

export interface Settings {
  general: GeneralSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
  appearance: AppearanceSettings;
  api: ApiSettings;
  billing: BillingSettings;
}

export interface GeneralSettings {
  platformName: string;
  contactEmail: string;
  defaultLanguage: string;
  timezone: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface NotificationSettings {
  newUsers: boolean;
  newOrders: boolean;
  supplierVerifications: boolean;
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  primaryColor: string;
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
}

export interface ApiSettings {
  keys: ApiKey[];
  usage: ApiUsage;
}

export interface ApiKey {
  name: string;
  key: string;
  type: 'production' | 'test';
}

export interface ApiUsage {
  current: number;
  limit: number;
  percentage: number;
}

export interface BillingSettings {
  plan: BillingPlan;
  paymentMethod: PaymentMethod;
  invoices: BillingInvoice[];
}

export interface BillingPlan {
  name: string;
  price: number;
  features: string[];
}

export interface PaymentMethod {
  type: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
}

export interface BillingInvoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  downloadUrl: string;
}

export type SettingsTab = 'general' | 'security' | 'api' | 'billing';

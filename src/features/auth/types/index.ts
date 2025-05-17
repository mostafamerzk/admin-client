/**
 * Auth Types
 * 
 * This file defines the TypeScript interfaces for the auth feature.
 */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  type: 'customer' | 'supplier' | 'admin';
  avatar?: string;
  role?: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  type: 'customer' | 'supplier';
  acceptTerms: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

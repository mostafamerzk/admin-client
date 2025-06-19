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

// Backend API user response structure
export interface BackendUser {
  Id: string;
  Name: string;
  Email: string;
  UserName: string;
  Address: string;
  BusinessType: string;
  PhoneNumber: string;
  PhoneNumberConfirmed: boolean;
  EmailConfirmed: boolean;
  TwoFactorEnabled: boolean;
  LockoutEnabled?: boolean;
  LockoutEnd?: string | null;
  AccessFailedCount?: number;
  ImageUrl: string;
  userType: string;
  roles: string[];
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
  expiresIn: number;
}

// Backend API response structure
export interface BackendLoginResponse {
  success: boolean;
  message: string;
  data: {
    user: BackendUser;
    token: string;
  };
}

// Backend API error response structure
export interface BackendErrorResponse {
  success: boolean;
  message: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Backend API login request structure
export interface BackendLoginRequest {
  Email: string;  // Capital E as required by backend
  password: string;
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

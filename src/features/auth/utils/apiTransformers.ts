/**
 * API Data Transformers
 * 
 * This file provides utilities to transform data between frontend and backend formats.
 * This is necessary because the backend API uses different field names and structures
 * than what the frontend expects.
 */

import type { 
  AuthUser, 
  BackendUser, 
  LoginCredentials, 
  BackendLoginRequest,
  LoginResponse,
  BackendLoginResponse,
  BackendErrorResponse
} from '../types';

/**
 * Transform frontend login credentials to backend format
 */
export const transformLoginRequest = (credentials: LoginCredentials): BackendLoginRequest => {
  return {
    Email: credentials.email,  // Backend expects capital E
    password: credentials.password
    // Note: rememberMe is not used by backend
  };
};

/**
 * Transform backend user object to frontend format
 */
export const transformBackendUser = (backendUser: BackendUser): AuthUser => {
  return {
    id: backendUser.Id,
    name: backendUser.Name,
    email: backendUser.Email,
    type: mapUserType(backendUser.userType),
    avatar: backendUser.ImageUrl,
    role: backendUser.roles?.[0] || 'user' // Take first role as primary role
  };
};

/**
 * Map backend user type to frontend user type
 */
const mapUserType = (backendUserType: string): 'customer' | 'supplier' | 'admin' => {
  switch (backendUserType?.toLowerCase()) {
    case 'admin':
      return 'admin';
    case 'supplier':
      return 'supplier';
    case 'customer':
      return 'customer';
    default:
      console.warn(`Unknown user type: ${backendUserType}, defaulting to 'customer'`);
      return 'customer';
  }
};

/**
 * Transform backend login response to frontend format
 */
export const transformLoginResponse = (backendResponse: BackendLoginResponse): LoginResponse => {
  if (!backendResponse.success) {
    throw new Error(backendResponse.message || 'Login failed');
  }

  if (!backendResponse.data) {
    throw new Error('Invalid response: missing data');
  }

  const { user: backendUser, token } = backendResponse.data;

  if (!backendUser || !token) {
    throw new Error('Invalid response: missing user or token');
  }

  return {
    user: transformBackendUser(backendUser),
    token,
    expiresIn: 3600 // Default to 1 hour, backend doesn't provide this
  };
};

/**
 * Check if response is a backend error response
 */
export const isBackendErrorResponse = (response: any): response is BackendErrorResponse => {
  return response && 
         typeof response === 'object' && 
         'success' in response && 
         response.success === false &&
         'message' in response;
};

/**
 * Extract error message from backend response
 */
export const extractErrorMessage = (response: any): string => {
  if (isBackendErrorResponse(response)) {
    return response.message;
  }
  
  // Fallback for other error formats
  if (response?.error) {
    return response.error;
  }
  
  if (response?.message) {
    return response.message;
  }
  
  return 'An unexpected error occurred';
};

/**
 * Transform backend user profile response (for /auth/me endpoint)
 */
export const transformUserProfileResponse = (response: any): AuthUser => {
  // Backend /auth/me returns: { success: true, message: "...", data: { user: BackendUser } }
  if (!response.success) {
    throw new Error(response.message || 'Failed to get user profile');
  }

  if (!response.data?.user) {
    throw new Error('Invalid response: missing user data');
  }

  return transformBackendUser(response.data.user);
};

/**
 * Validate backend response structure
 */
export const validateBackendResponse = (response: any, expectedDataFields: string[] = []): void => {
  if (!response) {
    throw new Error('Empty response received');
  }

  if (typeof response !== 'object') {
    throw new Error('Invalid response format');
  }

  if (!('success' in response)) {
    throw new Error('Response missing success field');
  }

  if (response.success === false) {
    throw new Error(response.message || 'Request failed');
  }

  if (expectedDataFields.length > 0) {
    if (!response.data) {
      throw new Error('Response missing data field');
    }

    for (const field of expectedDataFields) {
      if (!(field in response.data)) {
        throw new Error(`Response missing required field: ${field}`);
      }
    }
  }
};

/**
 * User API Data Transformers
 * 
 * This file provides utilities to transform data between frontend and backend formats
 * for the users API, handling field name differences and data structure variations.
 */

import type { 
  User, 
  BackendUser, 
  UserFormData, 
  UserFormDataFrontend,
  ApiResponseWrapper,
  UserQueryParams
} from '../types';

/**
 * Transform frontend user form data to backend format
 */
export const transformUserFormToBackend = (frontendData: UserFormDataFrontend): UserFormData => {
  const result: UserFormData = {
    Name: frontendData.name,
    Email: frontendData.email,
    verificationStatus: frontendData.verificationStatus || 'pending'
  };

  if (frontendData.password !== undefined) {
    result.password = frontendData.password;
  }
  if (frontendData.phone !== undefined) {
    result.PhoneNumber = frontendData.phone;
  }
  if (frontendData.address !== undefined) {
    result.Address = frontendData.address;
  }
  if (frontendData.businessType !== undefined) {
    result.BusinessType = frontendData.businessType;
  }

  return result;
};

/**
 * Transform backend user data to frontend format
 */
export const transformBackendUserToFrontend = (backendUser: BackendUser): User => {
  const result: User = {
    id: backendUser.id,
    name: backendUser.name,
    email: backendUser.email,
    type: backendUser.type,
    status: backendUser.status,
    verificationStatus: backendUser.verificationStatus || 'pending'
  };

  if (backendUser.avatar !== undefined) {
    result.avatar = backendUser.avatar;
  }
  if (backendUser.phone !== undefined) {
    result.phone = backendUser.phone;
  }
  if (backendUser.address !== undefined) {
    result.address = backendUser.address;
  }
  if (backendUser.businessType !== undefined) {
    result.businessType = backendUser.businessType;
  }
  if (backendUser.lastLogin !== undefined) {
    result.lastLogin = backendUser.lastLogin;
  }

  return result;
};

/**
 * Transform frontend query parameters to backend format
 */
export const transformQueryParamsToBackend = (params: UserQueryParams): Record<string, any> => {
  const backendParams: Record<string, any> = {};
  
  if (params.page !== undefined) backendParams.page = params.page;
  if (params.limit !== undefined) backendParams.limit = params.limit;
  if (params.search !== undefined) backendParams.search = params.search;
  if (params.status !== undefined) backendParams.status = params.status;
  if (params.sort !== undefined) backendParams.sort = params.sort;
  if (params.order !== undefined) backendParams.order = params.order;
  
  return backendParams;
};

/**
 * Validate backend API response structure
 */
export const validateBackendResponse = <T>(response: any): ApiResponseWrapper<T> => {
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

  if (!('data' in response)) {
    throw new Error('Response missing data field');
  }

  return response as ApiResponseWrapper<T>;
};

/**
 * Transform backend user list response to frontend format
 */
export const transformUserListResponse = (backendResponse: any): ApiResponseWrapper<User[]> => {
  const validatedResponse = validateBackendResponse<BackendUser[]>(backendResponse);

  const transformedUsers = validatedResponse.data.map(transformBackendUserToFrontend);

  const result: ApiResponseWrapper<User[]> = {
    success: validatedResponse.success,
    message: validatedResponse.message,
    data: transformedUsers
  };

  if (validatedResponse.pagination !== undefined) {
    result.pagination = validatedResponse.pagination;
  }

  return result;
};

/**
 * Transform backend single user response to frontend format
 */
export const transformUserResponse = (backendResponse: any): ApiResponseWrapper<User> => {
  const validatedResponse = validateBackendResponse<BackendUser>(backendResponse);
  
  const transformedUser = transformBackendUserToFrontend(validatedResponse.data);
  
  return {
    success: validatedResponse.success,
    message: validatedResponse.message,
    data: transformedUser
  };
};

/**
 * Extract error message from backend response
 */
export const extractErrorMessage = (errorResponse: any): string => {
  if (typeof errorResponse === 'string') {
    return errorResponse;
  }
  
  if (errorResponse?.message) {
    return errorResponse.message;
  }
  
  if (errorResponse?.error) {
    return errorResponse.error;
  }
  
  return 'An unexpected error occurred';
};

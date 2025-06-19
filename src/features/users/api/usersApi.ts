/**
 * Users API Service
 *
 * This file provides methods for interacting with the users API endpoints.
 */

import apiClient from '../../../api';
import { handleApiError } from '../../../utils/errorHandling';
import { ENDPOINTS } from '../../../constants/endpoints';
import type {
  User,
  UserFormDataFrontend,
  UserQueryParams,
  UserStatusUpdate,
  ImageUploadResponse,
  ApiResponseWrapper
} from '../types';
import {
  transformUserFormToBackend,
  transformUserListResponse,
  transformUserResponse,
  transformQueryParamsToBackend,
  validateBackendResponse,
  extractErrorMessage
} from '../utils/apiTransformers';

/**
 * Users API service with methods for managing user data
 */
export const usersApi = {
  /**
   * Get all users with optional filtering and pagination
   * @param params - Optional query parameters for filtering users
   * @returns Promise resolving to paginated user data
   */
  getUsers: async (params?: UserQueryParams): Promise<ApiResponseWrapper<User[]>> => {
    try {
      const backendParams = params ? transformQueryParamsToBackend(params) : {};
      const response = await apiClient.get(ENDPOINTS.USERS.BASE, { params: backendParams });

      // Handle API client error wrapper
      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error('No response data received');
      }

      // Transform backend response to frontend format
      return transformUserListResponse(response.data);
    } catch (error: any) {
      // Enhanced error handling for backend-specific errors
      if (error.response?.data) {
        const errorMessage = extractErrorMessage(error.response.data);
        throw new Error(errorMessage);
      }
      throw handleApiError(error);
    }
  },

  /**
   * Get a user by their ID
   * @param id - The user's unique identifier
   * @returns Promise resolving to a single user
   */
  getUserById: async (id: string): Promise<User> => {
    try {
      const response = await apiClient.get(ENDPOINTS.USERS.DETAILS(id));

      // Handle API client error wrapper
      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error('No response data received');
      }

      // Transform backend response to frontend format
      const transformedResponse = transformUserResponse(response.data);
      return transformedResponse.data;
    } catch (error: any) {
      // Enhanced error handling for backend-specific errors
      if (error.response?.data) {
        const errorMessage = extractErrorMessage(error.response.data);
        throw new Error(errorMessage);
      }
      throw handleApiError(error);
    }
  },

  /**
   * Create a new user
   * @param userData - The user data to create
   * @returns Promise resolving to the created user
   */
  createUser: async (userData: UserFormDataFrontend): Promise<User> => {
    try {
      // Transform frontend data to backend format
      const backendData = transformUserFormToBackend(userData);
      const response = await apiClient.post(ENDPOINTS.USERS.BASE, backendData);

      // Handle API client error wrapper
      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error('No response data received');
      }

      // Transform backend response to frontend format
      const transformedResponse = transformUserResponse(response.data);
      return transformedResponse.data;
    } catch (error: any) {
      // Enhanced error handling for backend-specific errors
      if (error.response?.data) {
        const errorMessage = extractErrorMessage(error.response.data);
        throw new Error(errorMessage);
      }
      throw handleApiError(error);
    }
  },

  /**
   * Update an existing user
   * @param id - The user's unique identifier
   * @param userData - The user data to update
   * @returns Promise resolving to the updated user
   */
  updateUser: async (id: string, userData: UserFormDataFrontend): Promise<User> => {
    try {
      // Transform frontend data to backend format
      const backendData = transformUserFormToBackend(userData);
      const response = await apiClient.put(ENDPOINTS.USERS.DETAILS(id), backendData);

      // Handle API client error wrapper
      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error('No response data received');
      }

      // Transform backend response to frontend format
      const transformedResponse = transformUserResponse(response.data);
      return transformedResponse.data;
    } catch (error: any) {
      // Enhanced error handling for backend-specific errors
      if (error.response?.data) {
        const errorMessage = extractErrorMessage(error.response.data);
        throw new Error(errorMessage);
      }
      throw handleApiError(error);
    }
  },

  /**
   * Delete a user
   * @param id - The user's unique identifier
   * @returns Promise resolving to a success indicator
   */
  deleteUser: async (id: string): Promise<void> => {
    try {
      const response = await apiClient.delete(ENDPOINTS.USERS.DETAILS(id));

      // Handle API client error wrapper
      if (response.error) {
        throw new Error(response.error);
      }

      // For delete operations, we just need to check success
      if (response.data && typeof response.data === 'object' && 'success' in response.data && !response.data.success) {
        const errorMessage = 'message' in response.data ? response.data.message : 'Delete operation failed';
        throw new Error(errorMessage as string);
      }
    } catch (error: any) {
      // Enhanced error handling for backend-specific errors
      if (error.response?.data) {
        const errorMessage = extractErrorMessage(error.response.data);
        throw new Error(errorMessage);
      }
      throw handleApiError(error);
    }
  },
  
  /**
   * Update a user's status
   * @param id - The user's unique identifier
   * @param status - The new status to set
   * @returns Promise resolving to void
   */
  updateUserStatus: async (id: string, status: 'active' | 'banned'): Promise<void> => {
    try {
      const statusData: UserStatusUpdate = { status };
      const response = await apiClient.put(ENDPOINTS.USERS.STATUS(id), statusData);

      // Handle API client error wrapper
      if (response.error) {
        throw new Error(response.error);
      }

      // For status update operations, we just need to check success
      if (response.data && typeof response.data === 'object' && 'success' in response.data && !response.data.success) {
        const errorMessage = 'message' in response.data ? response.data.message : 'Status update failed';
        throw new Error(errorMessage as string);
      }
    } catch (error: any) {
      // Enhanced error handling for backend-specific errors
      if (error.response?.data) {
        const errorMessage = extractErrorMessage(error.response.data);
        throw new Error(errorMessage);
      }
      throw handleApiError(error);
    }
  },

  /**
   * Search for users by name or email
   * @param query - The search query string
   * @param params - Additional query parameters
   * @returns Promise resolving to paginated user data
   */
  searchUsers: async (query: string, params?: Omit<UserQueryParams, 'search'>): Promise<ApiResponseWrapper<User[]>> => {
    try {
      const searchParams: UserQueryParams = { ...params, search: query };
      return await usersApi.getUsers(searchParams);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get users filtered by type
   * @param type - The user type to filter by
   * @param params - Additional query parameters
   * @returns Promise resolving to paginated user data
   */
  getUsersByType: async (_type: 'customer' | 'supplier', params?: Omit<UserQueryParams, 'type'>): Promise<ApiResponseWrapper<User[]>> => {
    try {
      // Note: Removed 'admin' type as it's not part of the regular user interface
      const typeParams: UserQueryParams = { ...params };
      // Add type filtering logic here if the backend supports it
      // For now, we'll get all users and filter on the frontend if needed
      return await usersApi.getUsers(typeParams);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Upload user image
   * @param file - The image file to upload
   * @returns Promise resolving to the uploaded image URL
   */
  uploadUserImage: async (file: File): Promise<ImageUploadResponse> => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await apiClient.post(ENDPOINTS.USERS.UPLOAD_IMAGE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Handle API client error wrapper
      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error('No response data received');
      }

      // Validate backend response
      const validatedResponse = validateBackendResponse<ImageUploadResponse>(response.data);
      return validatedResponse.data;
    } catch (error: any) {
      // Enhanced error handling for backend-specific errors
      if (error.response?.data) {
        const errorMessage = extractErrorMessage(error.response.data);
        throw new Error(errorMessage);
      }
      throw handleApiError(error);
    }
  }
};

// Export individual methods for more flexible importing
export const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  searchUsers,
  getUsersByType,
  uploadUserImage
} = usersApi;

export default usersApi;



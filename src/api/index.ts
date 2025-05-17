import { ApiClient } from './client/index';
import { API_URL } from '../constants/config';

// Create a singleton instance of the API client
const apiClient = new ApiClient(API_URL);

// Export the API client instance
export default apiClient;

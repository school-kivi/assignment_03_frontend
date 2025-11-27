import { apiClient } from './axios';
import { AxiosResponse, AxiosProgressEvent } from 'axios';

// Define types for your API responses
export interface SecureData {
  message: string;
  data: Array<{
    id: number;
    title: string;
    content: string;
  }>;
  user: {
    uid: string;
    email: string;
    name?: string;
  };
  timestamp: string;
}

// API service functions
export const apiService = {
  // Get secure data from backend
  async getSecureData(): Promise<SecureData> {
    const response: AxiosResponse<SecureData> = await apiClient.get('/api/secure-data');
    return response.data;
  },

  // Example: User profile operations
  async getUserProfile(): Promise<unknown> {
    const response = await apiClient.get('/api/user/profile');
    return response.data;
  },

  async updateUserProfile(profileData: Record<string, unknown>): Promise<unknown> {
    const response = await apiClient.put('/api/user/profile', profileData);
    return response.data;
  },

  // Example: Generic CRUD operations
  async get<T>(endpoint: string): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.get(endpoint);
    return response.data;
  },

  async post<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.post(endpoint, data);
    return response.data;
  },

  async put<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.put(endpoint, data);
    return response.data;
  },

  async delete<T>(endpoint: string): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.delete(endpoint);
    return response.data;
  },

  // Example: File upload with progress
  async uploadFile(file: File, onUploadProgress?: (progressEvent: AxiosProgressEvent) => void): Promise<unknown> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return response.data;
  },
};

export default apiService;
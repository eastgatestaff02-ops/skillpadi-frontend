import { apiClient } from './client';

export const trainerApi = {
  getProfile: () => apiClient.get('/api/training/trainer/me'),
  updateProfile: (data) => apiClient.put('/api/training/trainer/me', data),
};
import { apiClient } from './client';

export const trainerApi = {
  getProfile: () => apiClient.get('/api/trainers/profile/me'),
  updateProfile: (data) => apiClient.put('/api/trainers/profile/me', data),
};
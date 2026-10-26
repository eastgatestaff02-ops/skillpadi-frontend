import { apiClient } from './client';

export const trainerApi = {
  getProfile: () => apiClient.get('/trainers/profile/me'),
  updateProfile: (data) => apiClient.put('/trainers/profile/me', data),
};
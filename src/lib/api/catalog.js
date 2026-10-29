import { apiClient } from './client';

export const catalogApi = {
  getTrades: () => apiClient.get('/api/trades'),
  getStates: () => apiClient.get('/api/states'),
  getSkills: () => apiClient.get('/api/skills'),
};
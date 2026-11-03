import { apiClient } from './client';

const params = { pageSize: 100 };

export const catalogApi = {
  getTrades: () => apiClient.get('/api/catalog/trades', { params }),
  getStates: () => apiClient.get('/api/catalog/states', { params }),
  getSkills: () => apiClient.get('/api/catalog/skills', { params }),
};
import { apiClient } from './client';

export const reportsApi = {
  reportProfile: (data) => apiClient.post('/api/reports', data),
};
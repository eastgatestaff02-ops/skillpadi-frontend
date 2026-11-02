import { apiClient } from './client';

export const employerApi = {
  getMyJobs: () => apiClient.get('/api/employer/jobs'),
};
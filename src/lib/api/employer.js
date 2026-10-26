import { apiClient } from './client';

export const employerApi = {
  getMyJobs: () => apiClient.get('/employer/jobs'),
};
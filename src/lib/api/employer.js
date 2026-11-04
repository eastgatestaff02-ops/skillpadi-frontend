import { apiClient } from './client';

export const employerApi = {
  getMyJobs: () => apiClient.get('/api/jobs/mine'),
  getMyProfile: () => apiClient.get('/api/profiles/employer/me'),
  updateMyProfile: (data) => apiClient.put('/api/profiles/employer/me', data),
};
import { apiClient } from './client';

export const employerApi = {
  getMyJobs: () => apiClient.get('/api/employer/jobs'),
  getMyProfile: () => apiClient.get('/api/profiles/employers/me'),
  updateMyProfile: (data) => apiClient.put('/api/profiles/employers/me', data),
};
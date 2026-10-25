import { apiClient } from './client';

export const jobsApi = {
  createJob: (data) => apiClient.post('/jobs', data),
  getJobs: (params) => apiClient.get('/jobs', { params }),
  getJobDetails: (id) => apiClient.get(`/jobs/${id}`),
  updateJobStatus: (id, status) => apiClient.patch(`/jobs/${id}/status`, { status }),
};
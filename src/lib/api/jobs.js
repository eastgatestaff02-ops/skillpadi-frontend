import { apiClient } from './client';

export const jobsApi = {
  createJob: (data) => apiClient.post('/api/jobs', data),
  getOpenJobs: (params) => apiClient.get('/api/jobs', { params }),
  getJobDetails: (id) => apiClient.get(`/api/jobs/${id}`),
  applyForJob: (jobId, data) => apiClient.post(`/api/jobs/${jobId}/apply`, data),
  getMyApplications: () => apiClient.get('/api/workers/applications'),
};
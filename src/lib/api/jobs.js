import { apiClient } from './client';

export const jobsApi = {
  createJob: (data) => apiClient.post('/api/jobs', data),
  getOpenJobs: (params) => apiClient.get('/api/jobs', { params }),
  getJobDetails: (id) => apiClient.get(`/api/jobs/${id}`),
  applyForJob: (jobId, data) => apiClient.post(`/api/jobs/${jobId}/applications`, data),
  getMyApplications: () => apiClient.get('/api/jobs/applications/mine'),
  updateJobStatus: (id, status, data = {}) =>
    apiClient.patch(`/api/jobs/${id}`, { status, ...data }),
};
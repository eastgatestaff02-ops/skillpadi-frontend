import { apiClient } from './client';

export const applicationsApi = {
  apply: (data) => apiClient.post('/applications', data),
  getMyApplications: () => apiClient.get('/applications/mine'),
  getReceivedApplications: () => apiClient.get('/trainer/applications'),
  updateStatus: (id, status) => apiClient.patch(`/applications/${id}/status`, { status }),
};
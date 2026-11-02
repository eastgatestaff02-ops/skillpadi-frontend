import { apiClient } from './client';

export const applicationsApi = {
  apply: (data) => apiClient.post('/api/applications', data),
  getMyApplications: () => apiClient.get('/api/applications/mine'),
  getReceivedApplications: () => apiClient.get('/api/trainer/applications'),
  updateStatus: (id, status) => apiClient.patch(`/api/applications/${id}/status`, { status }),
};
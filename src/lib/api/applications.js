import { apiClient } from './client';

export const applicationsApi = {
  getMyApplications: () => apiClient.get('/api/training/applications/mine'),
  getMyApplications: () => apiClient.get('/api/applications/mine'),
  getReceivedApplications: () => apiClient.get('/api/trainer/applications'),
  updateStatus: (id, status) => apiClient.patch(`/api/applications/${id}/status`, { status }),
};
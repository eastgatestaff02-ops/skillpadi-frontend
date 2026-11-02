import { apiClient } from './client';

export const workerApi = {
  searchWorkers: (params) => apiClient.get('/api/profiles/workers', { params }),
  getPublicProfile: (id) => apiClient.get(`/api/profiles/workers/${id}`),
  contactWorker: (id) => apiClient.post(`/api/profiles/workers/${id}/contact`),
  getMyProfile: () => apiClient.get('/api/profiles/workers/me'),
  updateMyProfile: (data) => apiClient.put('/api/profiles/workers/me', data),
  uploadPortfolio: (formData) =>
    apiClient.post('/api/profiles/workers/me/portfolio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
import { apiClient } from './client';

export const workerApi = {
  searchWorkers: (params) => apiClient.get('/api/profiles/workers', { params }),
  getPublicProfile: (id) => apiClient.get(`/api/profiles/workers/${id}`),
  contactWorker: (id) => apiClient.post(`/api/workers/${id}/contact`),
  getMyProfile: () => apiClient.get('/api/profiles/worker/me'),
  updateMyProfile: (data) => apiClient.put('/api/profiles/worker/me', data),
  
  // NEW SIGNED UPLOAD ENDPOINTS
  getPortfolioUploadUrl: (data) => apiClient.post('/api/portfolio/images/upload-url', data),
  finalizePortfolioUpload: (data) => apiClient.post('/api/portfolio/images/finalize', data),
  
  getAvatarUploadUrl: (data) => apiClient.post('/api/profiles/worker/me/avatar/upload-url', data),
  finalizeAvatarUpload: (data) => apiClient.post('/api/profiles/worker/me/avatar/finalize', data),

  getWhatsAppContact: (id) => apiClient.get(`/api/profiles/workers/${id}/contact`),
};
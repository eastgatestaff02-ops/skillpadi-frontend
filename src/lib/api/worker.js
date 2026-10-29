import { apiClient } from './client';

export const workerApi = {
  
  searchWorkers: (params) => apiClient.get('/api/profiles/workers', { params }),
  
  getPublicProfile: (id) => apiClient.get(`/api/profiles/workers/${id}`), 
};
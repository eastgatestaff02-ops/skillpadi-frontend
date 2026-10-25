import { apiClient } from './client';

export const workerApi = {
  // Profile
  getProfile: () => apiClient.get('/workers/profile/me'),
  updateProfile: (data) => apiClient.put('/workers/profile/me', data), // { trade, yearsOfExperience, location }
  
  // Portfolio & Skills
  uploadPortfolio: (formData) => apiClient.post('/workers/portfolio', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  addSkill: (skill) => apiClient.post('/workers/skills', { skill }),
  addCertificate: (data) => apiClient.post('/workers/certificates', data),
  
  // Public & Search
  searchWorkers: (params) => apiClient.get('/workers/search', { params }), // { trade, location }
  getPublicProfile: (id) => apiClient.get(`/workers/public/${id}`),
};
import { apiClient } from './client';

const params = { pageSize: 100 };

export const catalogApi = {
  getTrades: () => apiClient.get('/api/catalog/trades', { params }).then(res => res.data.data || res.data),
  getStates: () => apiClient.get('/api/catalog/states', { params }).then(res => res.data.data || res.data),
  getSkills: () => apiClient.get('/api/catalog/skills', { params }).then(res => res.data.data || res.data),
  
  getLgas: (stateCode) => apiClient.get('/api/catalog/lgas', { 
    params: { stateCode, pageSize: 100 } 
  }).then(res => res.data.data || res.data),
};
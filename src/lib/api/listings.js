import { apiClient } from './client';

export const listingsApi = {
  getListings: (params) => apiClient.get('/api/listings', { params }),
  getListing: (id) => apiClient.get(`/api/listings/${id}`),
  createListing: (data) => apiClient.post('/api/listings', data),
  getMyListings: () => apiClient.get('/api/trainer/listings'),
};
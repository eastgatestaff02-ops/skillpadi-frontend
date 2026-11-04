import { apiClient } from './client';

export const listingsApi = {
  getListings: (params) => apiClient.get('/api/training/listings', { params }),
  getListing: (id) => apiClient.get(`/api/listings/${id}`),
  createListing: (data) => apiClient.post('/api/training/listings', data),
  getMyListings: () => apiClient.get('/api/training/listings/mine'),
};
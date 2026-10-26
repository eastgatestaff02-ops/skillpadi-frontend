import { apiClient } from './client';

export const listingsApi = {
  getListings: (params) => apiClient.get('/listings', { params }),
  getListing: (id) => apiClient.get(`/listings/${id}`),
  createListing: (data) => apiClient.post('/listings', data),
  getMyListings: () => apiClient.get('/trainer/listings'),
};
import { apiClient } from './client';

export const trainingApi = {
  // Trainer Profile
  getTrainerProfile: () => apiClient.get('/api/training/trainer/me'),
  createOrUpdateTrainerProfile: (data) => apiClient.put('/api/training/trainer/me', data),

  // Listings (Corrected)
  getListings: (params) => apiClient.get('/api/training/listings', { params }),
  getListing: (id) => apiClient.get(`/api/training/listings/${id}`), // <--- THE FIX
  createListing: (data) => apiClient.post('/api/training/listings', data),
  getMyListings: () => apiClient.get('/api/training/listings/mine'),
  
  // Applicants
  getApplicantsForListing: (listingId) => 
    apiClient.get(`/api/training/listings/${listingId}/applications`),

  // Apprentice Actions
  getMyApplications: () => apiClient.get('/api/training/applications/mine'),
  applyToListing: (listingId, data) => 
    apiClient.post(`/api/training/listings/${listingId}/applications`, data),
};
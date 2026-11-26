import { apiClient } from './client';

export const trainingApi = {
  // Trainer Profile
  getTrainerProfile: () => apiClient.get('/api/training/trainer/me'),
  updateTrainerProfile: (data) => apiClient.put('/api/training/trainer/me', data),

  // Trainer Listings
  getMyListings: () => apiClient.get('/api/training/listings/mine'),
  createListing: (data) => apiClient.post('/api/training/listings', data),
  
  // Applicants (Per Listing - Based on Swagger: /api/training/listings/{listingId}/applications)
  getApplicantsForListing: (listingId) => 
    apiClient.get(`/api/training/listings/${listingId}/applications`),

  // Apprentice Actions
  getMyApplications: () => apiClient.get('/api/training/applications/mine'),
  applyToListing: (listingId, data) => 
    apiClient.post(`/api/training/listings/${listingId}/applications`, data),
};
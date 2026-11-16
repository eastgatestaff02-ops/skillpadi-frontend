import { apiClient } from './client';

export const trainerApi = {
  // --- Profile Management ---
  getProfile: () => apiClient.get('/api/training/trainer/me'),
  updateProfile: (data) => apiClient.put('/api/training/trainer/me', data),

  // --- Apprenticeship Listings ---
  getMyListings: () => apiClient.get('/api/training/trainer/listings'),
  createListing: (data) => apiClient.post('/api/training/trainer/listings', data),
  updateListing: (id, data) => apiClient.put(`/api/training/trainer/listings/${id}`, data),
  deleteListing: (id) => apiClient.delete(`/api/training/trainer/listings/${id}`),

  // --- Applicant Management ---
  getApplicants: () => apiClient.get('/api/training/trainer/applicants'),
  getApplicantsForListing: (listingId) => 
    apiClient.get(`/api/training/trainer/listings/${listingId}/applicants`),
  updateApplicationStatus: (applicationId, status) => 
    apiClient.patch(`/api/training/trainer/applications/${applicationId}`, { status }),

  // --- Training Materials ---
  getMaterials: () => apiClient.get('/api/training/trainer/materials'),
  uploadMaterial: (data) => apiClient.post('/api/training/trainer/materials', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};
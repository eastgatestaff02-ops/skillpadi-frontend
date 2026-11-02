import { apiClient } from './client';

export const reviewsApi = {
  submitReview: (data) => apiClient.post('/api/reviews', data),
  getWorkerReviews: (workerId) => apiClient.get(`/api/reviews/worker/${workerId}`),
};
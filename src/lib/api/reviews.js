import { apiClient } from './client';

export const reviewsApi = {
  submitReview: (data) => apiClient.post('/reviews', data), // { jobId, rating, comment }
  getWorkerReviews: (workerId) => apiClient.get(`/reviews/worker/${workerId}`),
};
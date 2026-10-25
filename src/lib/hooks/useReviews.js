import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from '@/lib/api/reviews';

export const useSubmitReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reviewsApi.submitReview,
    onSuccess: (_, variables) => {
      // Refresh the worker's profile to show the new rating
      queryClient.invalidateQueries({ queryKey: ['publicProfile', variables.workerId] });
    },
  });
};
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from '@/lib/api/reviews';
import { unwrapList } from '@/lib/utils/api';
import { queryDefaults, mutationDefaults } from '@/lib/utils/network';

export const useWorkerReviews = (workerId) =>
  useQuery({
    queryKey: ['workerReviews', workerId],
    queryFn: () => reviewsApi.getWorkerReviews(workerId).then((res) => unwrapList(res.data)),
    enabled: !!workerId,
    ...queryDefaults,
  });

export const useSubmitReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => reviewsApi.submitReview(data).then((res) => res.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['publicProfile', variables.revieweeId] });
      queryClient.invalidateQueries({ queryKey: ['workerReviews', variables.revieweeId] });
    },
    ...mutationDefaults,
  });
};
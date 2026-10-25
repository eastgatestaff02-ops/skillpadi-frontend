import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workerApi } from '@/lib/api/worker';

export const useWorkerProfile = () => {
  return useQuery({
    queryKey: ['workerProfile'],
    queryFn: () => workerApi.getProfile().then(res => res.data),
  });
};

export const useUpdateWorkerProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: workerApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workerProfile'] });
    },
  });
};

export const useSearchWorkers = (filters) => {
  return useQuery({
    queryKey: ['searchWorkers', filters],
    queryFn: () => workerApi.searchWorkers(filters).then(res => res.data),
    enabled: !!(filters.trade || filters.location), // Only search if there's a filter
  });
};
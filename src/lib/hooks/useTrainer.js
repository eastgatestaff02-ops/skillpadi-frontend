import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trainerApi } from '@/lib/api/trainer';
import { queryDefaults, mutationDefaults } from '@/lib/utils/network';

export const useTrainerProfile = () => {
  return useQuery({
    queryKey: ['trainerProfile'],
    queryFn: () => trainerApi.getProfile().then((res) => res.data),
    ...queryDefaults,
  });
};

export const useUpdateTrainerProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => trainerApi.updateProfile(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainerProfile'] });
    },
    ...mutationDefaults,
  });
};
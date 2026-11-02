import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workerApi } from '@/lib/api/worker';
import { queryDefaults, mutationDefaults } from '@/lib/utils/network';

const unwrap = (res) => res.data?.data ?? res.data;

export const useWorkerProfile = () =>
  useQuery({
    queryKey: ['myWorkerProfile'],
    queryFn: () => workerApi.getMyProfile().then(unwrap),
    ...queryDefaults,
  });

export const useUpdateWorkerProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => workerApi.updateMyProfile(data).then(unwrap),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['myWorkerProfile'] }),
    ...mutationDefaults,
  });
};

export const useUploadPortfolio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => workerApi.uploadPortfolio(formData).then(unwrap),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['myWorkerProfile'] }),
    ...mutationDefaults,
  });
};
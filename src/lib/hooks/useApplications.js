import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationsApi } from '@/lib/api/applications';
import { queryDefaults, mutationDefaults } from '@/lib/utils/network';

export const useApply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => applicationsApi.apply(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myApplications'] });
    },
    ...mutationDefaults,
  });
};

export const useMyApplications = () => {
  return useQuery({
    queryKey: ['myApplications'],
    queryFn: () => applicationsApi.getMyApplications().then((res) => res.data),
    ...queryDefaults,
  });
};

export const useReceivedApplications = () => {
  return useQuery({
    queryKey: ['receivedApplications'],
    queryFn: () => applicationsApi.getReceivedApplications().then((res) => res.data),
    ...queryDefaults,
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => applicationsApi.updateStatus(id, status).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receivedApplications'] });
      queryClient.invalidateQueries({ queryKey: ['myApplications'] });
    },
    ...mutationDefaults,
  });
};
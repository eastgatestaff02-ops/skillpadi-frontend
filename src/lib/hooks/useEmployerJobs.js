import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employerApi } from '@/lib/api/employer';
import { jobsApi } from '@/lib/api/jobs';
import { queryDefaults, mutationDefaults } from '@/lib/utils/network';

export const useMyJobs = () => {
  return useQuery({
    queryKey: ['myJobs'],
    queryFn: () => employerApi.getMyJobs().then((res) => res.data),
    ...queryDefaults,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => jobsApi.createJob(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myJobs'] });
    },
    ...mutationDefaults,
  });
};

export const useUpdateJobStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => jobsApi.updateJobStatus(id, status).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myJobs'] });
    },
    ...mutationDefaults,
  });
};
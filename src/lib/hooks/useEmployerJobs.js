import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employerApi } from '@/lib/api/employer';
import { jobsApi } from '@/lib/api/jobs';
import { queryDefaults, mutationDefaults } from '@/lib/utils/network';

const unwrap = (res) => res.data?.data ?? res.data;

export const useMyJobs = () =>
  useQuery({
    queryKey: ['myJobs'],
    queryFn: () => employerApi.getMyJobs().then((res) => res.data),
    ...queryDefaults,
  });

export const useJob = (id) =>
  useQuery({
    queryKey: ['job', id],
    queryFn: () => jobsApi.getJobDetails(id).then(unwrap),
    enabled: !!id,
    ...queryDefaults,
  });

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => jobsApi.createJob(data).then(unwrap),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myJobs'] });
    },
    ...mutationDefaults,
  });
};

export const useUpdateJobStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, hiredWorkerId }) =>
      jobsApi
        .updateJobStatus(id, status, hiredWorkerId ? { hiredWorkerId } : {})
        .then(unwrap),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['myJobs'] });
      queryClient.invalidateQueries({ queryKey: ['job', variables.id] });
    },
    ...mutationDefaults,
  });
};
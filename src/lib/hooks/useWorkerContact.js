import { useMutation } from '@tanstack/react-query';
import { workerApi } from '@/lib/api/worker';
import { mutationDefaults } from '@/lib/utils/network';

export const useWorkerContact = () =>
  useMutation({
    mutationFn: (id) => workerApi.contactWorker(id).then((res) => res.data),
    ...mutationDefaults,
  });
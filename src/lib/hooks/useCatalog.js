import { useQuery } from '@tanstack/react-query';
import { catalogApi } from '@/lib/api/catalog';
import { unwrapList } from '@/lib/utils/api';
import { queryDefaults } from '@/lib/utils/network';

const ONE_DAY = 24 * 60 * 60 * 1000;

export const useTrades = () =>
  useQuery({
    queryKey: ['trades'],
    queryFn: () => catalogApi.getTrades().then((res) => unwrapList(res.data)),
    staleTime: ONE_DAY,
    ...queryDefaults,
  });

export const useStates = () =>
  useQuery({
    queryKey: ['states'],
    queryFn: () => catalogApi.getStates().then((res) => unwrapList(res.data)),
    staleTime: ONE_DAY,
    ...queryDefaults,
  });
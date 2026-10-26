import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listingsApi } from '@/lib/api/listings';
import { queryDefaults, mutationDefaults } from '@/lib/utils/network';

export const useListings = (filters = {}) => {
  return useQuery({
    queryKey: ['listings', filters],
    queryFn: () => listingsApi.getListings(filters).then((res) => res.data),
    ...queryDefaults,
  });
};

export const useListing = (id) => {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: () => listingsApi.getListing(id).then((res) => res.data),
    enabled: !!id,
    ...queryDefaults,
  });
};

export const useMyListings = () => {
  return useQuery({
    queryKey: ['myListings'],
    queryFn: () => listingsApi.getMyListings().then((res) => res.data),
    ...queryDefaults,
  });
};

export const useCreateListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => listingsApi.createListing(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
    ...mutationDefaults,
  });
};
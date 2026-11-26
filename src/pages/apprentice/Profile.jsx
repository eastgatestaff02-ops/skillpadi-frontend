import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { apprenticeApi } from '@/lib/api/apprentice'; 
import { apiClient } from '@/lib/api/client';
import { getApiErrorMessage } from '@/lib/utils/errors';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import TextField from '@/components/ui/TextField';
import SelectField from '@/components/ui/SelectField';
import TextAreaField from '@/components/ui/TextAreaField';
import Button from '@/components/ui/Button';
import FeedbackBanner from '@/components/ui/FeedbackBanner';
import Card from '@/components/ui/Card';

export default function ApprenticeProfile() {
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);

  // 1. Fetch the apprentice profile
  const { data: profile, isLoading, isError, error } = useQuery({
    queryKey: ['apprenticeProfile'],
    queryFn: () => apprenticeApi.getProfile().then(res => res.data.data || res.data),
    retry: false, 
  });

  // 2. Fetch Catalogs (Trades, States, LGAs)
  const { data: tradesData, isLoading: tradesLoading } = useQuery({
    queryKey: ['catalog-trades'],
    queryFn: () => apiClient.get('/api/catalog/trades').then((res) => res.data.data || res.data),
  });

  const { data: statesData, isLoading: statesLoading } = useQuery({
    queryKey: ['catalog-states'],
    queryFn: () => apiClient.get('/api/catalog/states?page=1&pageSize=100').then((res) => res.data.data || res.data),
  });

  const trades = tradesData || [];
  const states = statesData || [];

  // 3. Setup the form
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      tradeId: profile?.trade?.id || profile?.tradeId || '',
      stateId: profile?.state?.id || profile?.stateId || '',
      lgaId: profile?.lga?.id || profile?.lgaId || '',
      bio: profile?.bio || '',
    },
  });

  const watchedStateId = watch('stateId');
  const selectedState = states.find((s) => s.id === watchedStateId);
  const stateCode = selectedState?.code || selectedState?.stateCode;

  // 4. Fetch LGAs based on selected state
  const { data: lgasData, isLoading: lgasLoading } = useQuery({
    queryKey: ['catalog-lgas', stateCode],
    queryFn: () => apiClient.get(`/api/catalog/lgas?stateCode=${stateCode}`).then((res) => res.data.data || res.data),
    enabled: !!stateCode, 
  });

  const lgas = lgasData || [];

  // 5. Setup Mutation to save profile
  const updateProfile = useMutation({
    mutationFn: (data) => apprenticeApi.updateProfile(data),
    onSuccess: () => {
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['apprenticeProfile'] });
      setTimeout(() => setSuccess(false), 3000);
    },
  });

  const onSubmit = (values) => {
    updateProfile.mutate({
      tradeId: values.tradeId,
      stateId: values.stateId,
      lgaId: values.lgaId,
      bio: values.bio,
    });
  };

  if (isLoading) return <LoadingSpinner label="Loading profile..." />;

  return (
    <div className="max-w-2xl mx-auto space-y-4 text-left">
      
      <div className="mb-6">
        <h1 className="text-h2 font-bold text-navy-500">
          {isError && error?.response?.status === 404 ? 'Complete Your Apprentice Profile' : 'Update Your Apprentice Profile'}
        </h1>
        <p className="text-navy-500/70 mt-1">
          {isError && error?.response?.status === 404
            ? "You haven't set up your apprentice profile yet. Tell us what trade you want to learn so trainers can find you." 
            : "Keep your profile up to date to increase your chances of finding a trainer."}
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          <SelectField
            label={tradesLoading ? "Loading trades..." : "Trade of Interest"}
            error={errors.tradeId?.message}
            disabled={tradesLoading}
            {...register('tradeId', { required: 'Select a trade.' })}
          >
            <option value="">Select a trade</option>
            {trades.map((trade) => (
              <option key={trade.id} value={trade.id}>{trade.name}</option>
            ))}
          </SelectField>

          <SelectField
            label={statesLoading ? "Loading states..." : "State"}
            error={errors.stateId?.message}
            disabled={statesLoading}
            {...register('stateId', { required: 'Select your state.' })}
          >
            <option value="">Select your state</option>
            {states.map((state) => (
              <option key={state.id} value={state.id}>{state.name}</option>
            ))}
          </SelectField>

          <SelectField
            label={lgasLoading ? "Loading LGAs..." : "Local Government Area (LGA)"}
            error={errors.lgaId?.message}
            disabled={!watchedStateId || lgasLoading}
            {...register('lgaId', { required: 'Select your LGA.' })}
          >
            <option value="">Select your LGA</option>
            {lgas.map((lga) => (
              <option key={lga.id} value={lga.id}>{lga.name}</option>
            ))}
          </SelectField>

          <TextAreaField
            label="Short Bio (Optional)"
            placeholder="Tell trainers a little about yourself and why you want to learn this trade."
            maxLength={300}
            {...register('bio')}
          />

          {updateProfile.isError && (
            <FeedbackBanner tone="error">
              {getApiErrorMessage(updateProfile.error, 'Could not save your profile.')}
            </FeedbackBanner>
          )}

          {success && (
            <FeedbackBanner tone="success">
              Profile saved successfully!
            </FeedbackBanner>
          )}

          <Button type="submit" fullWidth loading={updateProfile.isPending}>
            {isError ? 'Create Profile' : 'Save Profile'}
          </Button>

        </form>
      </Card>
    </div>
  );
}
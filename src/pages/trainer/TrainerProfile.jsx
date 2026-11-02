import { useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import { useTrainerProfile, useUpdateTrainerProfile } from '@/lib/hooks/useTrainer';
import { useTrades } from '@/lib/hooks/useCatalog';
import { getApiErrorMessage } from '@/lib/utils/errors';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import TextField from '@/components/ui/TextField';
import TextAreaField from '@/components/ui/TextAreaField';
import SelectField from '@/components/ui/SelectField';
import FeedbackBanner from '@/components/ui/FeedbackBanner';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ErrorState from '@/components/shared/ErrorState';

function TrainerProfileForm({ profile }) {
  const { data: trades = [] } = useTrades();
  const updateProfile = useUpdateTrainerProfile();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      trade: profile?.trade?.name || profile?.trade || '',
      yearsOfTraining: profile?.yearsOfTraining ?? '',
      apprenticesTrained: profile?.apprenticesTrained ?? '',
      bio: profile?.bio || '',
    },
  });

  const bioLength = (watch('bio') || '').length;

  const onSubmit = (values) => {
    updateProfile.mutate({
      trade: values.trade,
      yearsOfTraining: Number(values.yearsOfTraining),
      apprenticesTrained: Number(values.apprenticesTrained),
      bio: values.bio.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
      <SelectField
        key={`trade-${trades.length}`}
        label="Trade"
        error={errors.trade?.message}
        {...register('trade', { required: 'Choose a trade.' })}
      >
        <option value="">Select a trade</option>
        {trades.map((trade) => (
          <option key={trade.id} value={trade.name}>
            {trade.name}
          </option>
        ))}
      </SelectField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          label="Years of training"
          type="number"
          inputMode="numeric"
          error={errors.yearsOfTraining?.message}
          {...register('yearsOfTraining', {
            required: 'Enter the number of years.',
            min: { value: 0, message: 'This cannot be negative.' },
          })}
        />
        <TextField
          label="Apprentices trained"
          type="number"
          inputMode="numeric"
          error={errors.apprenticesTrained?.message}
          {...register('apprenticesTrained', {
            required: 'Enter a number.',
            min: { value: 0, message: 'This cannot be negative.' },
          })}
        />
      </div>

      <TextAreaField
        label="Bio"
        labelRight={`${bioLength}/300`}
        placeholder="Tell apprentices about your experience and how you train"
        error={errors.bio?.message}
        {...register('bio', {
          required: 'Write a short bio.',
          minLength: { value: 10, message: 'Bio must be at least 10 characters.' },
          maxLength: { value: 300, message: 'Keep the bio under 300 characters.' },
        })}
      />

      {updateProfile.isError && (
        <FeedbackBanner tone="error">
          {getApiErrorMessage(updateProfile.error, 'Could not save your profile.')}
        </FeedbackBanner>
      )}

      {updateProfile.isSuccess && <FeedbackBanner tone="success">Profile saved.</FeedbackBanner>}

      <Button type="submit" size="lg" fullWidth loading={updateProfile.isPending}>
        Save profile
      </Button>
    </form>
  );
}

export default function TrainerProfile() {
  const { data, isLoading, isError, refetch } = useTrainerProfile();
  const profile = data?.data ?? data;

  let content;
  if (isLoading) {
    content = <LoadingSpinner label="Loading your profile..." />;
  } else if (isError) {
    content = <ErrorState message="We could not load your profile." onRetry={refetch} />;
  } else {
    content = <TrainerProfileForm profile={profile} />;
  }

  return (
    <div className="mx-auto max-w-xl text-left">
      <Button
        to="/trainer/dashboard"
        variant="text"
        size="sm"
        leftIcon={ArrowLeft}
        className="mb-3"
      >
        Back to dashboard
      </Button>

      <Card className="p-6">
        <h1 className="text-h2 font-bold text-navy-500">Trainer profile</h1>
        <p className="mt-1 text-body2 text-navy-500/70">
          This is what apprentices see before they apply.
        </p>
        {content}
      </Card>
    </div>
  );
}
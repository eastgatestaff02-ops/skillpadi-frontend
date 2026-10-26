import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useTrainerProfile, useUpdateTrainerProfile } from '@/lib/hooks/useTrainer';
import { TRADES } from '@/lib/utils/constants';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ErrorState from '@/components/shared/ErrorState';

const fieldClass = 'w-full rounded border p-2';
const errorClass = 'mt-1 text-xs text-red-600';

function TrainerProfileForm({ profile }) {
  const updateProfile = useUpdateTrainerProfile();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      trade: profile?.trade || '',
      yearsOfTraining: profile?.yearsOfTraining ?? '',
      apprenticesTrained: profile?.apprenticesTrained ?? '',
      bio: profile?.bio || '',
    },
  });

  const onSubmit = (data) => {
    updateProfile.mutate({
      ...data,
      yearsOfTraining: Number(data.yearsOfTraining),
      apprenticesTrained: Number(data.apprenticesTrained),
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-4 rounded-lg bg-white p-6 shadow"
    >
      <div>
        <label className="block text-sm font-medium">Trade</label>
        <select
          className={fieldClass}
          {...register('trade', { required: 'Please choose a trade' })}
        >
          <option value="">Select a trade</option>
          {TRADES.map((trade) => (
            <option key={trade} value={trade}>
              {trade}
            </option>
          ))}
        </select>
        {errors.trade && <p className={errorClass}>{errors.trade.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">Years of training</label>
          <input
            type="number"
            className={fieldClass}
            {...register('yearsOfTraining', {
              required: 'Please enter the number of years',
              min: { value: 0, message: 'Cannot be negative' },
            })}
          />
          {errors.yearsOfTraining && (
            <p className={errorClass}>{errors.yearsOfTraining.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Apprentices trained</label>
          <input
            type="number"
            className={fieldClass}
            {...register('apprenticesTrained', {
              required: 'Please enter a number',
              min: { value: 0, message: 'Cannot be negative' },
            })}
          />
          {errors.apprenticesTrained && (
            <p className={errorClass}>{errors.apprenticesTrained.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Bio</label>
        <textarea
          rows={4}
          placeholder="Tell apprentices about your experience and how you train"
          className={`${fieldClass} resize-none`}
          {...register('bio', {
            required: 'Please write a short bio',
            minLength: { value: 10, message: 'Bio must be at least 10 characters' },
            maxLength: { value: 300, message: 'Keep the bio under 300 characters' },
          })}
        />
        {errors.bio && <p className={errorClass}>{errors.bio.message}</p>}
      </div>

      {updateProfile.isError && (
        <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-700">
          Could not save your profile. Please try again.
        </p>
      )}

      {updateProfile.isSuccess && (
        <p role="status" className="rounded bg-green-50 p-3 text-sm text-green-700">
          Profile saved.
        </p>
      )}

      <button
        type="submit"
        disabled={updateProfile.isPending}
        className="w-full rounded bg-teal-600 py-2 text-white hover:bg-teal-700 disabled:opacity-50"
      >
        {updateProfile.isPending ? 'Saving...' : 'Save profile'}
      </button>
    </form>
  );
}

export default function TrainerProfile() {
  const { data: profile, isLoading, isError, refetch } = useTrainerProfile();

  let content;
  if (isLoading) {
    content = <LoadingSpinner label="Loading your profile..." />;
  } else if (isError) {
    content = <ErrorState message="We could not load your profile." onRetry={refetch} />;
  } else {
    content = <TrainerProfileForm profile={profile} />;
  }

  return (
    <div className="mx-auto max-w-2xl p-4 text-left md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Trainer Profile</h1>
        <Link to="/trainer/dashboard" className="text-sm font-medium text-teal-700 hover:text-teal-800">
          Back to dashboard
        </Link>
      </div>
      {content}
    </div>
  );
}
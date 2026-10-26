import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MapPin, Clock, User } from 'lucide-react';
import { useListing } from '@/lib/hooks/useListings';
import { useApply } from '@/lib/hooks/useApplications';
import { AVAILABILITY_OPTIONS } from '@/lib/utils/constants';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ErrorState from '@/components/shared/ErrorState';

const fieldClass = 'w-full rounded border p-2';
const errorClass = 'mt-1 text-xs text-red-600';

export default function Apply() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: listing, isLoading, isError, refetch } = useListing(id);
  const apply = useApply();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      whyInterested: '',
      availability: '',
    },
  });

  const onSubmit = (data) => {
    apply.mutate(
      { listingId: id, ...data },
      { onSuccess: () => navigate('/apprentice/applications') }
    );
  };

  const submitError =
    apply.error?.response?.data?.error?.message ||
    (apply.isError ? 'Could not send your application. Please try again.' : null);

  if (isLoading) {
    return <LoadingSpinner label="Loading listing..." />;
  }

  if (isError || !listing) {
    return (
      <div className="mx-auto max-w-2xl p-4 md:p-8">
        <ErrorState message="We could not load this listing." onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-4 text-left md:p-8">
      <Link
        to="/apprentice/listings"
        className="mb-4 inline-block text-sm font-medium text-teal-700 hover:text-teal-800"
      >
        Back to listings
      </Link>

      <div className="mb-6 rounded-lg bg-white p-6 shadow">
        <h1 className="text-2xl font-bold">{listing.trade} apprenticeship</h1>
        <div className="mt-3 space-y-1 text-sm text-gray-500">
          <p className="flex items-center gap-2">
            <User size={14} /> {listing.trainerName}
          </p>
          <p className="flex items-center gap-2">
            <MapPin size={14} /> {listing.location}
          </p>
          <p className="flex items-center gap-2">
            <Clock size={14} /> {listing.duration}
          </p>
        </div>
        {listing.requirements && (
          <p className="mt-3 text-sm text-gray-600">{listing.requirements}</p>
        )}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4 rounded-lg bg-white p-6 shadow"
      >
        <h2 className="text-lg font-semibold">Your application</h2>

        <div>
          <label className="block text-sm font-medium">Why are you interested?</label>
          <textarea
            rows={4}
            placeholder="Tell the trainer why you want to learn this trade"
            className={`${fieldClass} resize-none`}
            {...register('whyInterested', {
              required: 'Please tell the trainer why you are interested',
              minLength: { value: 10, message: 'Please write at least 10 characters' },
              maxLength: { value: 500, message: 'Keep it under 500 characters' },
            })}
          />
          {errors.whyInterested && (
            <p className={errorClass}>{errors.whyInterested.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Availability</label>
          <select
            className={fieldClass}
            {...register('availability', { required: 'Please choose your availability' })}
          >
            <option value="">Select your availability</option>
            {AVAILABILITY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.availability && <p className={errorClass}>{errors.availability.message}</p>}
        </div>

        {submitError && (
          <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-700">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={apply.isPending}
          className="w-full rounded bg-teal-600 py-2 text-white hover:bg-teal-700 disabled:opacity-50"
        >
          {apply.isPending ? 'Sending...' : 'Send application'}
        </button>
      </form>
    </div>
  );
}
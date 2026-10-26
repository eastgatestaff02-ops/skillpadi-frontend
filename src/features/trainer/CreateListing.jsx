import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateListing } from '@/lib/hooks/useListings';
import { TRADES, DURATION_OPTIONS } from '@/lib/utils/constants';

const fieldClass = 'w-full rounded border p-2';
const errorClass = 'mt-1 text-xs text-red-600';

export default function CreateListing() {
  const navigate = useNavigate();
  const createListing = useCreateListing();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      trade: '',
      location: '',
      duration: '',
      requirements: '',
    },
  });

  const onSubmit = (data) => {
    createListing.mutate(data, {
      onSuccess: () => navigate('/trainer/dashboard'),
    });
  };

  const submitError =
    createListing.error?.response?.data?.error?.message ||
    (createListing.isError ? 'Could not create the listing. Please try again.' : null);

  return (
    <div className="mx-auto max-w-2xl p-4 text-left md:p-8">
      <h1 className="mb-6 text-2xl font-bold">Create Training Listing</h1>

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
            <label className="block text-sm font-medium">Location</label>
            <input
              type="text"
              placeholder="e.g. Lagos"
              className={fieldClass}
              {...register('location', { required: 'Please enter a location' })}
            />
            {errors.location && <p className={errorClass}>{errors.location.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Duration</label>
            <select
              className={fieldClass}
              {...register('duration', { required: 'Please choose a duration' })}
            >
              <option value="">Select a duration</option>
              {DURATION_OPTIONS.map((duration) => (
                <option key={duration} value={duration}>
                  {duration}
                </option>
              ))}
            </select>
            {errors.duration && <p className={errorClass}>{errors.duration.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Requirements (optional)</label>
          <textarea
            rows={4}
            placeholder="What should an apprentice bring or already know?"
            className={`${fieldClass} resize-none`}
            {...register('requirements', {
              maxLength: { value: 300, message: 'Keep requirements under 300 characters' },
            })}
          />
          {errors.requirements && <p className={errorClass}>{errors.requirements.message}</p>}
        </div>

        {submitError && (
          <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-700">
            {submitError}
          </p>
        )}

        <div className="flex gap-3">
          <Link
            to="/trainer/dashboard"
            className="flex-1 rounded bg-gray-100 py-2 text-center text-gray-700 hover:bg-gray-200"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={createListing.isPending}
            className="flex-1 rounded bg-teal-600 py-2 text-white hover:bg-teal-700 disabled:opacity-50"
          >
            {createListing.isPending ? 'Saving...' : 'Create listing'}
          </button>
        </div>
      </form>
    </div>
  );
}
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateJob } from '@/lib/hooks/useEmployerJobs';
import { TRADES, URGENCY } from '@/lib/utils/constants';

const fieldClass = 'w-full rounded border p-2';
const errorClass = 'mt-1 text-xs text-red-600';

export default function NewJob() {
  const navigate = useNavigate();
  const createJob = useCreateJob();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      trade: '',
      location: '',
      budget: '',
      urgency: URGENCY.NORMAL,
    },
  });

  const onSubmit = (data) => {
    createJob.mutate(
      { ...data, budget: data.budget ? Number(data.budget) : null },
      { onSuccess: () => navigate('/employer/dashboard') }
    );
  };

  const submitError =
    createJob.error?.response?.data?.error?.message ||
    (createJob.isError ? 'Could not post the job. Please try again.' : null);

  return (
    <div className="mx-auto max-w-2xl p-4 text-left md:p-8">
      <h1 className="mb-6 text-2xl font-bold">Post a Job</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4 rounded-lg bg-white p-6 shadow"
      >
        <div>
          <label className="block text-sm font-medium">Job title</label>
          <input
            type="text"
            placeholder="e.g. Fix leaking kitchen pipe"
            className={fieldClass}
            {...register('title', {
              required: 'Please enter a job title',
              minLength: { value: 5, message: 'Title must be at least 5 characters' },
            })}
          />
          {errors.title && <p className={errorClass}>{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            rows={4}
            placeholder="Describe the work that needs to be done"
            className={`${fieldClass} resize-none`}
            {...register('description', {
              required: 'Please describe the job',
              minLength: { value: 10, message: 'Description must be at least 10 characters' },
            })}
          />
          {errors.description && <p className={errorClass}>{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Budget in naira (optional)</label>
            <input
              type="number"
              placeholder="e.g. 25000"
              className={fieldClass}
              {...register('budget', {
                min: { value: 1, message: 'Budget must be more than 0' },
              })}
            />
            {errors.budget && <p className={errorClass}>{errors.budget.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Urgency</label>
            <select className={fieldClass} {...register('urgency')}>
              <option value={URGENCY.LOW}>Low priority</option>
              <option value={URGENCY.NORMAL}>Normal</option>
              <option value={URGENCY.URGENT}>Urgent</option>
            </select>
          </div>
        </div>

        {submitError && (
          <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-700">
            {submitError}
          </p>
        )}

        <div className="flex gap-3">
          <Link
            to="/employer/dashboard"
            className="flex-1 rounded bg-gray-100 py-2 text-center text-gray-700 hover:bg-gray-200"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={createJob.isPending}
            className="flex-1 rounded bg-teal-600 py-2 text-white hover:bg-teal-700 disabled:opacity-50"
          >
            {createJob.isPending ? 'Posting...' : 'Post job'}
          </button>
        </div>
      </form>
    </div>
  );
}
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Briefcase, MapPin, CheckCircle2 } from 'lucide-react';
import { jobsApi } from '@/lib/api/jobs';
import { useTrades } from '@/lib/hooks/useCatalog';
import { getApiErrorMessage } from '@/lib/utils/errors';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import TextField from '@/components/ui/TextField';
import TextAreaField from '@/components/ui/TextAreaField';
import SelectField from '@/components/ui/SelectField';
import FeedbackBanner from '@/components/ui/FeedbackBanner';

const FIELDS = ['title', 'description', 'tradeId', 'location', 'budget'];

function NairaIcon({ className = '' }) {
  return <span className={`w-[18px] text-center text-body1 font-bold ${className}`}>₦</span>;
}

export default function NewJob() {
  const [postedJob, setPostedJob] = useState(null);
  const { data: trades = [], isLoading: tradesLoading, isError: tradesError } = useTrades();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: { title: '', description: '', tradeId: '', location: '', budget: '' },
  });

  const createMutation = useMutation({
    mutationFn: (payload) => jobsApi.createJob(payload),
    onSuccess: (_, payload) => setPostedJob({ title: payload.title }),
    onError: (err) => {
      const details = err.response?.data?.error?.details;
      if (Array.isArray(details)) {
        details.forEach((detail) => {
          if (FIELDS.includes(detail.path)) {
            setError(detail.path, { message: detail.message });
          }
        });
      }
    },
  });

  const onSubmit = (data) => {
    createMutation.mutate({
      title: data.title.trim(),
      description: data.description.trim(),
      tradeId: data.tradeId,
      location: data.location.trim(),
      budget: Number(data.budget),
    });
  };

  const fieldDetails = createMutation.error?.response?.data?.error?.details;
  const showBanner =
    createMutation.isError && !(Array.isArray(fieldDetails) && fieldDetails.length > 0);

  const handlePostAnother = () => {
    reset();
    createMutation.reset();
    setPostedJob(null);
  };

  if (postedJob) {
    return (
      <div className="mx-auto max-w-xl">
        <Card className="p-6 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-50">
            <CheckCircle2 size={28} className="text-success-500" />
          </span>
          <h1 className="mt-4 text-h2 font-bold text-navy-500">Job posted</h1>
          <p className="mt-1 text-body2 text-navy-500/70">
            {postedJob.title} is now open for workers to see.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button variant="outlined" fullWidth onClick={handlePostAnother}>
              Post another job
            </Button>
            <Button fullWidth to="/employer/dashboard">
              View my jobs
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl text-left">
      <Card className="p-6">
        <h1 className="text-h2 font-bold text-navy-500">Post a job</h1>
        <p className="mt-1 text-body2 text-navy-500/70">
          Describe the work clearly so the right worker can respond.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
          <TextField
            label="Job title"
            icon={Briefcase}
            placeholder="e.g. Repair shop wiring"
            error={errors.title?.message}
            {...register('title', {
              required: 'Add a clear job title.',
              minLength: { value: 5, message: 'Job title must be at least 5 characters.' },
            })}
          />

          <TextAreaField
            label="Description"
            placeholder="Describe the work you need done"
            helper="Include the problem and what a worker should bring."
            error={errors.description?.message}
            {...register('description', {
              required: 'Describe the work you need done.',
              minLength: { value: 10, message: 'Description must be at least 10 characters.' },
            })}
          />

          <SelectField
            label="Trade"
            error={errors.tradeId?.message}
            {...register('tradeId', { required: 'Choose a trade.' })}
          >
            <option value="">{tradesLoading ? 'Loading trades...' : 'Select a trade'}</option>
            {trades.map((trade) => (
              <option key={trade.id} value={trade.id}>
                {trade.name}
              </option>
            ))}
          </SelectField>

          {tradesError && (
            <FeedbackBanner tone="error">
              We could not load the trades. Refresh the page to try again.
            </FeedbackBanner>
          )}

          <TextField
            label="Location"
            icon={MapPin}
            placeholder="City and state"
            error={errors.location?.message}
            {...register('location', { required: 'Enter the job location.' })}
          />

          <TextField
            label="Budget (₦)"
            icon={NairaIcon}
            type="number"
            inputMode="numeric"
            placeholder="e.g. 45000"
            error={errors.budget?.message}
            {...register('budget', {
              required: 'Enter a budget greater than ₦0.',
              min: { value: 1, message: 'Enter a budget greater than ₦0.' },
            })}
          />

          {showBanner && (
            <FeedbackBanner tone="error">
              {getApiErrorMessage(createMutation.error, 'Could not post the job. Please try again.')}
            </FeedbackBanner>
          )}

          <Button type="submit" size="lg" fullWidth loading={createMutation.isPending}>
            Publish job
          </Button>
        </form>
      </Card>
    </div>
  );
}
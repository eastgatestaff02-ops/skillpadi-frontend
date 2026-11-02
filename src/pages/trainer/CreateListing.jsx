import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft } from 'lucide-react';
import { useCreateListing } from '@/lib/hooks/useListings';
import { useTrades } from '@/lib/hooks/useCatalog';
import { DURATION_OPTIONS } from '@/lib/utils/constants';
import { getApiErrorMessage } from '@/lib/utils/errors';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import TextField from '@/components/ui/TextField';
import TextAreaField from '@/components/ui/TextAreaField';
import SelectField from '@/components/ui/SelectField';
import FeedbackBanner from '@/components/ui/FeedbackBanner';

export default function CreateListing() {
  const navigate = useNavigate();
  const { data: trades = [] } = useTrades();
  const createListing = useCreateListing();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { trade: '', location: '', duration: '', requirements: '' },
  });

  const onSubmit = (values) => {
    createListing.mutate(
      {
        trade: values.trade,
        location: values.location.trim(),
        duration: values.duration,
        requirements: values.requirements.trim(),
      },
      { onSuccess: () => navigate('/trainer/dashboard') }
    );
  };

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
        <h1 className="text-h2 font-bold text-navy-500">Create training listing</h1>
        <p className="mt-1 text-body2 text-navy-500/70">
          Tell apprentices what you teach and what they need to bring.
        </p>

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

          <TextField
            label="Location"
            icon={MapPin}
            placeholder="City and state"
            error={errors.location?.message}
            {...register('location', { required: 'Enter the location.' })}
          />

          <SelectField
            label="Duration"
            error={errors.duration?.message}
            {...register('duration', { required: 'Choose a duration.' })}
          >
            <option value="">Select a duration</option>
            {DURATION_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </SelectField>

          <TextAreaField
            label="Requirements (optional)"
            placeholder="What should an apprentice bring or already know?"
            error={errors.requirements?.message}
            {...register('requirements', {
              maxLength: { value: 300, message: 'Keep requirements under 300 characters.' },
            })}
          />

          {createListing.isError && (
            <FeedbackBanner tone="error">
              {getApiErrorMessage(createListing.error, 'Could not create the listing.')}
            </FeedbackBanner>
          )}

          <Button type="submit" size="lg" fullWidth loading={createListing.isPending}>
            Create listing
          </Button>
        </form>
      </Card>
    </div>
  );
}
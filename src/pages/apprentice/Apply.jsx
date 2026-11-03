import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { User, Phone, MapPin, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useListing } from '@/lib/hooks/useListings';
import { useApply } from '@/lib/hooks/useApplications';
import { useAuthStore } from '@/lib/store/authStore';
import { AVAILABILITY_OPTIONS } from '@/lib/utils/constants';
import { normalizeNigerianPhone } from '@/lib/utils/phone';
import { getApiErrorMessage } from '@/lib/utils/errors';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import TextField from '@/components/ui/TextField';
import TextAreaField from '@/components/ui/TextAreaField';
import SelectField from '@/components/ui/SelectField';
import FeedbackBanner from '@/components/ui/FeedbackBanner';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ErrorState from '@/components/shared/ErrorState';

export default function Apply() {
  const { id } = useParams();
  const user = useAuthStore((s) => s.user);
  const [submitted, setSubmitted] = useState(false);

  const { data, isLoading, isError, refetch } = useListing(id);
  const listing = data?.data ?? data;
  const apply = useApply();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: user?.name || '',
      phone: user?.phone || '',
      location: '',
      whyInterested: '',
      availability: '',
    },
  });

  const onSubmit = (values) => {
    apply.mutate(
      {
        listingId: id,
        fullName: values.fullName.trim(),
        phone: normalizeNigerianPhone(values.phone),
        location: values.location.trim(),
        whyInterested: values.whyInterested.trim(),
        availability: values.availability,
      },
      { onSuccess: () => setSubmitted(true) }
    );
  };

  if (isLoading) return <LoadingSpinner label="Loading apprenticeship..." />;

  if (isError || !listing) {
    return <ErrorState message="We could not load this apprenticeship." onRetry={refetch} />;
  }

  const trade = listing.trade?.name || listing.trade;
  const trainer = listing.trainerName || 'the trainer';

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl">
        <Card className="p-6 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-50">
            <CheckCircle2 size={28} className="text-success-500" />
          </span>
          <h1 className="mt-4 text-h2 font-bold text-navy-500">Application submitted</h1>
          <p className="mt-1 text-body2 text-navy-500/70">
            Your application to learn {trade} has been sent to {trainer}.
          </p>
          <p className="mt-2 text-body2 text-navy-500/70">
            The trainer will review your details and contact you directly.
          </p>
          <Button to="/apprentice/applications" variant="outlined" fullWidth className="mt-6">
            View my application
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl text-left">
      <Button
        to="/apprentice/listings"
        variant="text"
        size="sm"
        leftIcon={ArrowLeft}
        className="mb-3"
      >
        Back to listings
      </Button>

      <Card className="p-6">
        <h1 className="text-h2 font-bold text-navy-500">Apply to learn {trade}</h1>
        <p className="mt-1 text-body2 text-navy-500/70">
          With {trainer} · {listing.location}
        </p>
        {listing.requirements && (
          <p className="mt-3 text-body2 text-navy-500">{listing.requirements}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
          <TextField
            label="Full name"
            icon={User}
            autoComplete="name"
            error={errors.fullName?.message}
            {...register('fullName', { required: 'Enter your full name.' })}
          />

          <TextField
            label="Phone number"
            icon={Phone}
            type="tel"
            autoComplete="tel"
            placeholder="+234 802 345 6789"
            error={errors.phone?.message}
            {...register('phone', {
              validate: (value) =>
                !!normalizeNigerianPhone(value) || 'Enter +234 followed by 10 digits.',
            })}
          />

          <TextField
            label="Location"
            icon={MapPin}
            placeholder="City and state"
            error={errors.location?.message}
            {...register('location', { required: 'Enter your location.' })}
          />

          <TextAreaField
            label="Why do you want to learn?"
            placeholder="Tell the trainer about your interest"
            helper="A short personal statement is enough."
            error={errors.whyInterested?.message}
            {...register('whyInterested', {
              required: 'Tell the trainer why you are interested.',
              minLength: { value: 10, message: 'Please write at least 10 characters.' },
              maxLength: { value: 500, message: 'Keep it under 500 characters.' },
            })}
          />

          <SelectField
            label="Availability"
            error={errors.availability?.message}
            {...register('availability', { required: 'Choose your availability.' })}
          >
            <option value="">Select your availability</option>
            {AVAILABILITY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </SelectField>

          {apply.isError && (
            <FeedbackBanner tone="error">
              {getApiErrorMessage(apply.error, 'Could not send your application. Please try again.')}
            </FeedbackBanner>
          )}

          <Button type="submit" size="lg" fullWidth loading={apply.isPending}>
            Submit application
          </Button>
        </form>
      </Card>
    </div>
  );
}
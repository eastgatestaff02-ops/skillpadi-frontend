import { useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import imageCompression from 'browser-image-compression';
import { Check, Upload, Loader2 } from 'lucide-react';
import {
  useWorkerProfile,
  useUpdateWorkerProfile,
  useUploadPortfolio,
} from '@/lib/hooks/useWorker';
import { apiClient } from '@/lib/api/client';
import { getApiErrorMessage } from '@/lib/utils/errors';
import MyReviews from '@/features/worker/MyReviews';
import CompletenessCard from '@/features/worker/CompletenessCard';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import TextField from '@/components/ui/TextField';
import SelectField from '@/components/ui/SelectField';
import FeedbackBanner from '@/components/ui/FeedbackBanner';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ErrorState from '@/components/shared/ErrorState';

const imageUrl = (item) => (typeof item === 'string' ? item : item?.url || item?.imageUrl || null);

const getSteps = (profile) => {
  const years = profile.yearsExperience;
  return [
    { done: !!(profile.trade?.id || profile.tradeId), tip: 'Choose your trade so employers can find you.' },
    { done: typeof years === 'number', tip: 'Add your years of experience.' },
    { done: !!(profile.state?.id || profile.stateId), tip: 'Set your state so nearby employers find you.' },
    { done: !!(profile.lga?.id || profile.lgaId), tip: 'Set your local government area.' },
    { done: (profile.skills || []).length > 0, tip: 'Pick at least one skill.' },
    { done: (profile.portfolio || []).length > 0, tip: 'Add a work photo. Profiles with photos get more contacts.' },
  ];
};

function DetailsSection({ profile }) {
  const updateProfile = useUpdateWorkerProfile();
  const [skillIds, setSkillIds] = useState((profile.skills || []).map((skill) => skill.id));
  
  // Track selected state to fetch LGAs dynamically
  const [selectedStateId, setSelectedStateId] = useState(profile.state?.id || profile.stateId || '');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tradeId: profile.trade?.id || profile.tradeId || '',
      stateId: profile.state?.id || profile.stateId || '',
      lgaId: profile.lga?.id || profile.lgaId || '',
      yearsExperience: profile.yearsExperience ?? 0,
    },
  });

  // Watch the stateId field to update LGAs
  const watchedStateId = watch('stateId');

  // 1. Fetch REAL Trades from Backend
  const { data: tradesResponse, isLoading: tradesLoading } = useQuery({
    queryKey: ['catalog-trades'],
    queryFn: () => apiClient.get('/api/catalog/trades').then((res) => res.data.data || res.data),
  });

  // 2. Fetch REAL States from Backend
  const { data: statesResponse, isLoading: statesLoading } = useQuery({
    queryKey: ['catalog-states'],
    queryFn: () => apiClient.get('/api/catalog/states').then((res) => res.data.data || res.data),
  });

  // 3. Fetch LGAs based on selected State
  const { data: lgasResponse, isLoading: lgasLoading } = useQuery({
    queryKey: ['catalog-lgas', watchedStateId],
    queryFn: () => apiClient.get(`/api/catalog/lgas?stateId=${watchedStateId}`).then((res) => res.data.data || res.data),
    enabled: !!watchedStateId, // Only fetch if a state is selected
  });

  // 4. Fetch REAL Skills from Backend
  const { data: skillsResponse, isLoading: skillsLoading } = useQuery({
    queryKey: ['catalog-skills'],
    queryFn: () => apiClient.get('/api/catalog/skills').then((res) => res.data.data || res.data),
  });

  const trades = tradesResponse || [];
  const states = statesResponse || [];
  const lgas = lgasResponse || [];
  const skills = skillsResponse || [];

  const toggleSkill = (id) =>
    setSkillIds((ids) => (ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]));

  const onSubmit = (values) => {
    if (skillIds.length === 0) {
      alert('Please select at least one skill.');
      return;
    }

    updateProfile.mutate({
      tradeId: values.tradeId,
      stateId: values.stateId,
      lgaId: values.lgaId, // Added LGA
      yearsExperience: Number(values.yearsExperience),
      skillIds, // Now contains real UUIDs
    });
  };

  return (
    <Card className="p-5">
      <h2 className="text-h3 font-bold text-navy-500">About your work</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 space-y-4">
        <SelectField
          label={tradesLoading ? "Loading trades..." : "Trade"}
          error={errors.tradeId?.message}
          disabled={tradesLoading}
          {...register('tradeId', { required: 'Choose your trade.' })}
        >
          <option value="">Select a trade</option>
          {trades.map((trade) => (
            <option key={trade.id} value={trade.id}>{trade.name}</option>
          ))}
        </SelectField>

        <TextField
          label="Years of experience"
          type="number"
          inputMode="numeric"
          placeholder="e.g. 5"
          helper="Enter 0 if you are just starting out."
          error={errors.yearsExperience?.message}
          {...register('yearsExperience', {
            required: 'Enter your years of experience.',
            min: { value: 0, message: 'This cannot be negative.' },
          })}
        />

        <SelectField
          label={statesLoading ? "Loading states..." : "State"}
          helper="Only your state is public, not your exact address."
          error={errors.stateId?.message}
          disabled={statesLoading}
          {...register('stateId', { required: 'Choose your state.' })}
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
          {...register('lgaId', { required: 'Choose your LGA.' })}
        >
          <option value="">Select your LGA</option>
          {lgas.map((lga) => (
            <option key={lga.id} value={lga.id}>{lga.name}</option>
          ))}
        </SelectField>

        <div>
          <p className="mb-1.5 text-caption font-bold text-navy-500">Skills (Select 1-20)</p>
          {skillsLoading ? (
             <p className="text-body2 text-navy-500/70">Loading skills...</p>
          ) : skills.length === 0 ? (
            <p className="text-body2 text-navy-500/70">Skills are not available right now.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => {
                const selected = skillIds.includes(skill.id);
                return (
                  <button
                    key={skill.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleSkill(skill.id)}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-body2 font-medium transition-colors ${
                      selected ? 'bg-ochre-200 text-navy-500' : 'bg-cream text-navy-500/80 hover:bg-ochre-50'
                    }`}
                  >
                    {skill.name}
                    {selected && <Check size={14} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {updateProfile.isError && (
          <FeedbackBanner tone="error">
            {getApiErrorMessage(updateProfile.error, 'Could not save your profile.')}
          </FeedbackBanner>
        )}

        {updateProfile.isSuccess && <FeedbackBanner tone="success">Profile saved.</FeedbackBanner>}

        <Button type="submit" size="lg" fullWidth loading={updateProfile.isPending} disabled={skillIds.length === 0}>
          Save profile
        </Button>
      </form>
    </Card>
  );
}

function PhotosSection({ photos }) {
  const inputRef = useRef(null);
  const upload = useUploadPortfolio();
  const [preparing, setPreparing] = useState(false);
  const [error, setError] = useState('');
  const busy = preparing || upload.isPending;

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setError('');
    setPreparing(true);
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 1000,
        useWebWorker: false,
      });
      const formData = new FormData();
      formData.append('image', compressed, file.name);
      await upload.mutateAsync(formData);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Upload failed. Check your connection and try again.'));
    } finally {
      setPreparing(false);
    }
  };

  return (
    <Card className="p-5">
      <h2 className="text-h3 font-bold text-navy-500">Work photos</h2>
      <p className="mt-1 text-body2 text-navy-500/70">
        Show employers what you can do. Photos are shrunk to about 100 KB to save your data.
      </p>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {photos.map((photo) => (
          <img
            key={photo.key}
            src={photo.url}
            alt="Your previous work"
            className="aspect-square w-full rounded-lg object-cover"
          />
        ))}

        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-navy-200 bg-cream text-caption font-medium text-navy-500 hover:bg-ochre-50 disabled:opacity-60"
        >
          {busy ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
          {busy ? 'Uploading...' : 'Add work photo'}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      {error && (
        <FeedbackBanner tone="error" className="mt-4">
          {error}
        </FeedbackBanner>
      )}
    </Card>
  );
}

export default function WorkerProfile() {
  const { data: profile, isLoading, isError, error, refetch } = useWorkerProfile();

  if (isLoading) return <LoadingSpinner label="Loading your profile..." />;

  if (isError && error?.response?.status === 404) {
    return (
      <div className="mx-auto max-w-xl space-y-4 text-left">
        <h1 className="text-h2 font-bold text-navy-500">My profile</h1>
        
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-navy-500 mb-2">Complete Your Profile</h2>
          <p className="text-gray-500">
            You haven't set up your profile yet. Fill out the form below to get discovered by employers.
          </p>
        </div>

        <DetailsSection profile={{}} />
      </div>
    );
  }

  if (isError || !profile) {
    return <ErrorState message="We could not load your profile." onRetry={refetch} />;
  }

  const steps = getSteps(profile);
  const doneCount = steps.filter((step) => step.done).length;
  const percent = Math.round((doneCount / steps.length) * 100);
  const nextTip = steps.find((step) => !step.done)?.tip;

  const photos = (profile.portfolio || [])
    .map((item, index) => ({ key: item.id || index, url: imageUrl(item) }))
    .filter((item) => item.url);

  return (
    <div className="mx-auto max-w-xl space-y-4 text-left">
      <h1 className="text-h2 font-bold text-navy-500">My profile</h1>

      <CompletenessCard
        percent={percent}
        tip={nextTip}
        action={
          percent >= 100 && profile.id ? (
            <Button to={`/profile/${profile.id}`} variant="outlined" fullWidth>
              View public profile
            </Button>
          ) : null
        }
      />

      <DetailsSection key={profile.id || 'me'} profile={profile} />
      <PhotosSection photos={photos} />      
      <MyReviews workerId={profile.id} />
    </div>
  );
}

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import imageCompression from 'browser-image-compression';
import { Check, Upload, Loader2, User } from 'lucide-react';
import { useWorkerProfile, useUpdateWorkerProfile } from '@/lib/hooks/useWorker';
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

const imageUrl = (item) =>
  typeof item === 'string'
    ? item
    : item?.url || item?.imageUrl || null;

const getSteps = (profile) => {
  const years = profile.yearsExperience;

  return [
    {
      done: !!(profile.trade?.id || profile.tradeId),
      tip: 'Choose your trade so employers can find you.',
    },
    {
      done: typeof years === 'number',
      tip: 'Add your years of experience.',
    },
    {
      done: !!(profile.state?.id || profile.stateId),
      tip: 'Set your state so nearby employers find you.',
    },
    {
      done: !!(profile.lga?.id || profile.lgaId),
      tip: 'Set your local government area.',
    },
    {
      done: (profile.skills || []).length > 0,
      tip: 'Pick at least one skill.',
    },
    {
      done: (profile.portfolio || []).length > 0,
      tip: 'Add a work photo. Profiles with photos get more contacts.',
    },
  ];
};

function DetailsSection({ profile }) {
  const updateProfile = useUpdateWorkerProfile();

  const [skillIds, setSkillIds] = useState(
    (profile.skills || []).map((skill) => skill.id)
  );

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

  const watchedStateId = watch('stateId');

  const { data: statesData, isLoading: statesLoading } = useQuery({
    queryKey: ['catalog-states'],
    queryFn: () =>
      apiClient
        .get('/api/catalog/states?page=1&pageSize=100')
        .then((res) => res.data.data || res.data),
  });

  const { data: tradesData, isLoading: tradesLoading } = useQuery({
    queryKey: ['catalog-trades'],
    queryFn: () =>
      apiClient
        .get('/api/catalog/trades')
        .then((res) => res.data.data || res.data),
  });

  const { data: skillsData, isLoading: skillsLoading } = useQuery({
    queryKey: ['catalog-skills'],
    queryFn: () =>
      apiClient
        .get('/api/catalog/skills')
        .then((res) => res.data.data || res.data),
  });

  const states = statesData || [];
  const trades = tradesData || [];
  const skills = skillsData || [];

  const selectedState = states.find(
    (state) => state.id === watchedStateId
  );

  const stateCode = selectedState?.code || selectedState?.stateCode;

  const { data: lgasData, isLoading: lgasLoading } = useQuery({
    queryKey: ['catalog-lgas', stateCode],
    queryFn: () =>
      apiClient
        .get(`/api/catalog/lgas?stateCode=${stateCode}`)
        .then((res) => res.data.data || res.data),
    enabled: !!stateCode,
  });

  const lgas = lgasData || [];

  const toggleSkill = (id) =>
    setSkillIds((ids) =>
      ids.includes(id)
        ? ids.filter((item) => item !== id)
        : [...ids, id]
    );

  const onSubmit = (values) => {
    if (skillIds.length === 0) {
      alert('Please select at least one skill.');
      return;
    }

    updateProfile.mutate({
      tradeId: values.tradeId,
      stateId: values.stateId,
      lgaId: values.lgaId,
      yearsExperience: Number(values.yearsExperience),
      skillIds,
    });
  };

  return (
    <Card className="p-5">
      <h2 className="text-h3 font-bold text-navy-500">
        About your work
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-4 space-y-4"
      >
        <SelectField
          label={tradesLoading ? 'Loading...' : 'Trade'}
          error={errors.tradeId?.message}
          disabled={tradesLoading}
          {...register('tradeId', { required: 'Required' })}
        >
          <option value="">Select a trade</option>
          {trades.map((trade) => (
            <option key={trade.id} value={trade.id}>
              {trade.name}
            </option>
          ))}
        </SelectField>

        <TextField
          label="Years of experience"
          type="number"
          {...register('yearsExperience', {
            required: 'Required',
            min: 0,
          })}
        />

        <SelectField
          label={statesLoading ? 'Loading...' : 'State'}
          error={errors.stateId?.message}
          disabled={statesLoading}
          {...register('stateId', { required: 'Required' })}
        >
          <option value="">Select your state</option>
          {states.map((state) => (
            <option key={state.id} value={state.id}>
              {state.name}
            </option>
          ))}
        </SelectField>

        <SelectField
          label={
            lgasLoading
              ? 'Loading...'
              : 'Local Government Area (LGA)'
          }
          error={errors.lgaId?.message}
          disabled={!watchedStateId || lgasLoading}
          {...register('lgaId', { required: 'Required' })}
        >
          <option value="">Select your LGA</option>
          {lgas.map((lga) => (
            <option key={lga.id} value={lga.id}>
              {lga.name}
            </option>
          ))}
        </SelectField>

        <div>
          <p className="mb-1.5 text-caption font-bold text-navy-500">
            Skills
          </p>

          {skillsLoading ? (
            <p className="text-body2 text-navy-500/70">
              Loading skills...
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => {
                const selected = skillIds.includes(skill.id);

                return (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => toggleSkill(skill.id)}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-body2 font-medium ${
                      selected
                        ? 'bg-ochre-200 text-navy-500'
                        : 'bg-cream text-navy-500/80'
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
            {getApiErrorMessage(
              updateProfile.error,
              'Could not save your profile.'
            )}
          </FeedbackBanner>
        )}

        {updateProfile.isSuccess && (
          <FeedbackBanner tone="success">
            Profile saved.
          </FeedbackBanner>
        )}

        <Button
          type="submit"
          size="lg"
          fullWidth
          loading={updateProfile.isPending}
          disabled={skillIds.length === 0}
        >
          Save profile
        </Button>
      </form>
    </Card>
  );
}

function PhotosSection({ photos }) {
  const inputRef = useRef(null);
  const [preparing, setPreparing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';

    if (!file) return;

    setError('');
    setSuccess(false);
    setPreparing(true);

    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 1000,
        useWebWorker: false,
      });

      const contentType =
        compressed.type || file.type || 'image/jpeg';

      const { data: urlRes } = await apiClient.post(
        '/api/portfolio/images/upload-url',
        {
          contentType,
        }
      );

      const uploadUrl =
        urlRes.data?.uploadUrl || urlRes.uploadUrl;

      const fileKey =
        urlRes.data?.fileKey || urlRes.fileKey;

      if (!uploadUrl) {
        throw new Error('No upload URL returned.');
      }

      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: compressed,
        headers: {
          'Content-Type': contentType,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload to storage.');
      }

      await apiClient.post('/api/portfolio/images/finalize', {
        fileKey,
      });

      setSuccess(true);
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      console.error('Upload Error:', err);
      setError(getApiErrorMessage(err, 'Upload failed.'));
    } finally {
      setPreparing(false);
    }
  };

  return (
    <Card className="p-5">
      <h2 className="text-h3 font-bold text-navy-500">
        Work photos
      </h2>

      <p className="mt-1 text-body2 text-navy-500/70">
        Show employers what you can do.
      </p>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {photos.map((photo) => (
          <img
            key={photo.key}
            src={photo.url}
            alt="Work"
            className="aspect-square w-full rounded-lg object-cover"
          />
        ))}

        <button
          type="button"
          disabled={preparing}
          onClick={() => inputRef.current?.click()}
          className="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-navy-200 bg-cream hover:bg-ochre-50 disabled:opacity-60"
        >
          {preparing ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Upload size={20} />
          )}

          {preparing ? 'Uploading...' : 'Add photo'}
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

      {success && (
        <FeedbackBanner tone="success" className="mt-4">
          Photo uploaded successfully!
        </FeedbackBanner>
      )}
    </Card>
  );
}

function AvatarSection({ profile }) {
  const inputRef = useRef(null);
  const [preparing, setPreparing] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';

    if (!file) return;

    setError('');
    setPreparing(true);

    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 500,
        useWebWorker: false,
      });

      // FIX: Always send a valid contentType string.
      const contentType =
        compressed.type || file.type || 'image/jpeg';

      const { data: urlRes } = await apiClient.post(
        '/api/profiles/worker/me/avatar/upload-url',
        {
          contentType,
        }
      );

      const uploadUrl =
        urlRes.data?.uploadUrl || urlRes.uploadUrl;

      const fileKey =
        urlRes.data?.fileKey || urlRes.fileKey;

      if (!uploadUrl) {
        throw new Error('No upload URL returned.');
      }

      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: compressed,
        headers: {
          'Content-Type': contentType,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload avatar to storage.');
      }

      await apiClient.post(
        '/api/profiles/worker/me/avatar/finalize',
        {
          fileKey,
        }
      );

      window.location.reload();
    } catch (err) {
      console.error('Avatar Upload Error:', err);
      setError(
        getApiErrorMessage(err, 'Could not upload photo.')
      );
    } finally {
      setPreparing(false);
    }
  };

  const avatarUrl =
    profile?.avatarUrl ||
    profile?.avatar?.url ||
    profile?.imageUrl;

  return (
    <div className="flex flex-col items-center mb-6">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={preparing}
        className="relative group h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-ochre-100 flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
      >
        {preparing ? (
          <Loader2
            size={32}
            className="animate-spin text-navy-500"
          />
        ) : avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        ) : (
          <User size={40} className="text-navy-500/50" />
        )}

        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Upload size={24} className="text-white" />
        </div>
      </button>

      <p className="mt-2 text-caption text-navy-500/70 font-medium">
        {preparing ? 'Uploading...' : 'Tap to change photo'}
      </p>

      {error && (
        <FeedbackBanner tone="error" className="mt-2 text-xs">
          {error}
        </FeedbackBanner>
      )}
    </div>
  );
}

export default function WorkerProfile() {
  const {
    data: profile,
    isLoading,
    isError,
    error,
    refetch,
  } = useWorkerProfile();

  if (isLoading) {
    return <LoadingSpinner label="Loading your profile..." />;
  }

  if (isError && error?.response?.status === 404) {
    return (
      <div className="mx-auto max-w-xl space-y-4 text-left">
        <h1 className="text-h2 font-bold text-navy-500">
          My profile
        </h1>

        <AvatarSection profile={{}} />

        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-navy-500 mb-2">
            Complete Your Profile
          </h2>

          <p className="text-gray-500">
            You haven't set up your profile yet. Fill out the
            form below to get discovered by employers.
          </p>
        </div>

        <DetailsSection profile={{}} />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <ErrorState
        message="We could not load your profile."
        onRetry={refetch}
      />
    );
  }

  const steps = getSteps(profile);
  const doneCount = steps.filter((step) => step.done).length;
  const percent = Math.round((doneCount / steps.length) * 100);
  const nextTip = steps.find((step) => !step.done)?.tip;

  const photos = (profile.portfolio || [])
    .map((item, index) => ({
      key: item.id || index,
      url: imageUrl(item),
    }))
    .filter((item) => item.url);

  return (
    <div className="mx-auto max-w-xl space-y-4 text-left">
      <h1 className="text-h2 font-bold text-navy-500">
        My profile
      </h1>

      <AvatarSection profile={profile} />

      <CompletenessCard
        percent={percent}
        tip={nextTip}
        action={
          percent >= 100 && profile.id ? (
            <Button
              to={`/profile/${profile.id}`}
              variant="outlined"
              fullWidth
            >
              View public profile
            </Button>
          ) : null
        }
      />

      <DetailsSection
        key={profile.id || 'me'}
        profile={profile}
      />

      <PhotosSection photos={photos} />

      <MyReviews workerId={profile.id} />
    </div>
  );
}

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import imageCompression from 'browser-image-compression';
import { Check, Upload, Loader2 } from 'lucide-react';
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
    queryFn: () => apiClient.get('/api/catalog/states?page=1&pageSize=100').then((res) => res.data.data || res.data),
  });

  const { data: tradesData, isLoading: tradesLoading } = useQuery({
    queryKey: ['catalog-trades'],
    queryFn: () => apiClient.get('/api/catalog/trades').then((res) => res.data.data || res.data),
  });

  const { data: skillsData, isLoading: skillsLoading } = useQuery({
    queryKey: ['catalog-skills'],
    queryFn: () => apiClient.get('/api/catalog/skills').then((res) => res.data.data || res.data),
  });

  const states = statesData || [];
  const trades = tradesData || [];
  const skills = skillsData || [];

  const selectedState = states.find((s) => s.id === watchedStateId);
  const stateCode = selectedState?.code || selectedState?.stateCode;

  const { data: lgasData, isLoading: lgasLoading } = useQuery({
    queryKey: ['catalog-lgas', stateCode],
    queryFn: () => apiClient.get(`/api/catalog/lgas?stateCode=${stateCode}`).then((res) => res.data.data || res.data),
    enabled: !!stateCode, 
  });

  const lgas = lgasData || [];

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
      lgaId: values.lgaId,     
      yearsExperience: Number(values.yearsExperience),
      skillIds,
    });
  };

  return (
    <Card className="p-5">
      <h2 className="text-h3 font-bold text-navy-500">About your work</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 space-y-4">
        
        <SelectField label={tradesLoading ? "Loading..." : "Trade"} error={errors.tradeId?.message} disabled={tradesLoading} {...register('tradeId', { required: 'Required' })}>
          <option value="">Select a trade</option>
          {trades.map((trade) => <option key={trade.id} value={trade.id}>{trade.name}</option>)}
        </SelectField>

        <TextField
          label="Years of experience"
          type="number"
          {...register('yearsExperience', { required: 'Required', min: 0 })}
        />

        <SelectField label={statesLoading ? "Loading..." : "State"} error={errors.stateId?.message} disabled={statesLoading} {...register('stateId', { required: 'Required' })}>
          <option value="">Select your state</option>
          {states.map((state) => <option key={state.id} value={state.id}>{state.name}</option>)}
        </SelectField>

        <SelectField 
          label={lgasLoading ? "Loading..." : "Local Government Area (LGA)"}
          error={errors.lgaId?.message} 
          disabled={!watchedStateId || lgasLoading}
          {...register('lgaId', { required: 'Required' })}
        >
          <option value="">Select your LGA</option>
          {lgas.map((lga) => <option key={lga.id} value={lga.id}>{lga.name}</option>)}
        </SelectField>

        <div>
          <p className="mb-1.5 text-caption font-bold text-navy-500">Skills</p>
          {skillsLoading ? (
             <p className="text-body2 text-navy-500/70">Loading skills...</p>
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
                      selected ? 'bg-ochre-200 text-navy-500' : 'bg-cream text-navy-500/80'
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
      // 1. Compress image
      const compressed = await imageCompression(file, { 
        maxSizeMB: 0.1, 
        maxWidthOrHeight: 1000, 
        useWebWorker: false 
      });
      
      // 2. Get the signed upload URL from backend (ONLY sending contentType)
      const { data: urlRes } = await apiClient.post('/api/portfolio/images/upload-url', {
        contentType: compressed.type,
      });
      
      // Extract uploadUrl from the response (adjusting for possible nested data)
      const uploadUrl = urlRes.data?.uploadUrl || urlRes.uploadUrl;
      const fileKey = urlRes.data?.fileKey || urlRes.fileKey;

      if (!uploadUrl) throw new Error('No upload URL returned from server.');

      // 3. Upload directly to Supabase storage using the signed URL
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: compressed,
        headers: { 'Content-Type': compressed.type },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload to Supabase storage.');
      }

      // 4. Finalize with the backend
      await apiClient.post('/api/portfolio/images/finalize', {
        fileKey: fileKey, 
      });

      setSuccess(true);
      // Reload the page after 1.5 seconds to show the new image
      setTimeout(() => window.location.reload(), 1500); 
      
    } catch (err) {
      // Log the actual error to console for debugging
      console.error("Upload Error:", err);
      setError(getApiErrorMessage(err, 'Upload failed. Please try again.'));
    } finally {
      setPreparing(false);
    }
  };

  return (
    <Card className="p-5">
      <h2 className="text-h3 font-bold text-navy-500">Work photos</h2>
      <p className="mt-1 text-body2 text-navy-500/70">Show employers what you can do.</p>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {photos.map((photo) => (
          <img key={photo.key} src={photo.url} alt="Work" className="aspect-square w-full rounded-lg object-cover" />
        ))}

        <button
          type="button"
          disabled={preparing}
          onClick={() => inputRef.current?.click()}
          className="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-navy-200 bg-cream hover:bg-ochre-50 disabled:opacity-60"
        >
          {preparing ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
          {preparing ? 'Uploading...' : 'Add photo'}
        </button>
      </div>

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      {error && <FeedbackBanner tone="error" className="mt-4">{error}</FeedbackBanner>}
      {success && <FeedbackBanner tone="success" className="mt-4">Photo uploaded successfully!</FeedbackBanner>}
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
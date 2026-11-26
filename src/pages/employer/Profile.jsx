import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import imageCompression from 'browser-image-compression';
import { User, Upload, Loader2, Building2, MapPin } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { getApiErrorMessage } from '@/lib/utils/errors';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import TextField from '@/components/ui/TextField';
import SelectField from '@/components/ui/SelectField';
import FeedbackBanner from '@/components/ui/FeedbackBanner';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ErrorState from '@/components/shared/ErrorState';

// --- API HOOKS ---
const useEmployerProfile = () => {
  return useQuery({
    queryKey: ['employerProfile'],
    queryFn: () => apiClient.get('/api/profiles/employer/me').then((res) => res.data.data || res.data),
    retry: false,
  });
};

const useUpdateEmployerProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => apiClient.put('/api/profiles/employer/me', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employerProfile'] });
    },
  });
};

// --- SECTIONS ---

function AvatarSection({ avatarUrl }) {
  const inputRef = useRef(null);
  const [preparing, setPreparing] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(avatarUrl);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setError('');
    setPreparing(true);

    try {
      // 1. Compress
      const compressed = await imageCompression(file, { maxSizeMB: 0.1, maxWidthOrHeight: 500, useWebWorker: false });
      
      // 2. Get Signed URL for Employer Avatar
      const { data: urlRes } = await apiClient.post('/api/profiles/employer/me/avatar/upload-url', {
        contentType: compressed.type,
      });
      const uploadUrl = urlRes.data?.uploadUrl || urlRes.uploadUrl;
      const fileKey = urlRes.data?.fileKey || urlRes.fileKey;

      if (!uploadUrl) throw new Error('No upload URL returned from server.');

      // 3. Upload to storage
      await fetch(uploadUrl, {
        method: 'PUT',
        body: compressed,
        headers: { 'Content-Type': compressed.type },
      });

      // 4. Finalize
      const finalizeRes = await apiClient.post('/api/profiles/employer/me/avatar/finalize', {
        fileKey: fileKey, 
      });

      // 5. Update preview
      const newUrl = finalizeRes.data?.data?.avatarUrl || finalizeRes.data?.avatarUrl || URL.createObjectURL(compressed);
      setPreview(newUrl);
      
    } catch (err) {
      console.error("Avatar Upload Error:", err);
      setError(getApiErrorMessage(err, 'Could not upload photo. Please try again.'));
    } finally {
      setPreparing(false);
    }
  };

  return (
    <Card className="p-5 flex flex-col items-center sm:flex-row sm:items-start gap-6">
      <div className="relative h-24 w-24 shrink-0 rounded-full bg-cream border-2 border-navy-100 overflow-hidden flex items-center justify-center">
        {preview ? (
          <img src={preview} alt="Profile" className="h-full w-full object-cover" />
        ) : (
          <User size={40} className="text-navy-300" />
        )}
        {preparing && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <Loader2 size={24} className="animate-spin text-navy-500" />
          </div>
        )}
      </div>
      
      <div className="flex-1 text-center sm:text-left">
        <h2 className="text-h3 font-bold text-navy-500">Profile Photo</h2>
        <p className="text-body2 text-navy-500/70 mt-1 mb-3">
          A clear photo helps workers recognise your business.
        </p>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        <Button variant="outlined" size="sm" onClick={() => inputRef.current?.click()} disabled={preparing}>
          {preparing ? 'Uploading...' : 'Change Photo'}
        </Button>
        {error && <p className="text-body2 text-danger-500 mt-2">{error}</p>}
      </div>
    </Card>
  );
}

function DetailsSection({ profile }) {
  const updateProfile = useUpdateEmployerProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      companyName: profile.companyName || '',
      contactName: profile.contactName || '',
      phone: profile.phone || '',
      address: profile.address || '',
    },
  });

  const onSubmit = (values) => {
    updateProfile.mutate(values);
  };

  return (
    <Card className="p-5">
      <h2 className="text-h3 font-bold text-navy-500">Business Details</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 space-y-4">
        
        <TextField
          label="Company / Business Name"
          icon={Building2}
          placeholder="e.g. BuildCo Ltd"
          error={errors.companyName?.message}
          {...register('companyName', { required: 'Company name is required.' })}
        />

        <TextField
          label="Contact Person"
          icon={User}
          placeholder="e.g. Adeola Johnson"
          error={errors.contactName?.message}
          {...register('contactName', { required: 'Contact name is required.' })}
        />

        <TextField
          label="Phone Number"
          type="tel"
          placeholder="e.g. 08012345678"
          error={errors.phone?.message}
          {...register('phone', { required: 'Phone number is required.' })}
        />

        <TextField
          label="Business Address"
          icon={MapPin}
          placeholder="e.g. 12 Allen Avenue, Ikeja"
          error={errors.address?.message}
          {...register('address', { required: 'Address is required.' })}
        />

        {updateProfile.isError && (
          <FeedbackBanner tone="error">
            {getApiErrorMessage(updateProfile.error, 'Could not save your profile.')}
          </FeedbackBanner>
        )}
        {updateProfile.isSuccess && <FeedbackBanner tone="success">Profile saved.</FeedbackBanner>}

        <Button type="submit" size="lg" fullWidth loading={updateProfile.isPending}>
          Save profile
        </Button>
      </form>
    </Card>
  );
}

// --- MAIN PAGE ---

export default function EmployerProfile() {
  const { data: profile, isLoading, isError, error, refetch } = useEmployerProfile();

  if (isLoading) return <LoadingSpinner label="Loading your profile..." />;

  // Handle new employer (no profile created yet)
  if (isError && error?.response?.status === 404) {
    return (
      <div className="mx-auto max-w-xl space-y-4 text-left">
        <h1 className="text-h2 font-bold text-navy-500">My profile</h1>
        
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-navy-500 mb-2">Complete Your Profile</h2>
          <p className="text-gray-500">
            You haven't set up your employer profile yet. Fill out the form below to start posting jobs.
          </p>
        </div>

        <AvatarSection avatarUrl={null} />
        <DetailsSection profile={{}} />
      </div>
    );
  }

  if (isError || !profile) {
    return <ErrorState message="We could not load your profile." onRetry={refetch} />;
  }

  // Render existing profile
  return (
    <div className="mx-auto max-w-xl space-y-4 text-left">
      <h1 className="text-h2 font-bold text-navy-500">My profile</h1>
      
      <AvatarSection avatarUrl={profile.avatarUrl} />
      
      <DetailsSection profile={profile} />
    </div>
  );
}
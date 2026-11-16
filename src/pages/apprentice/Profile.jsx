import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
// Assuming you have an apprenticeApi set up similar to workerApi
import { apprenticeApi } from '@/lib/api/apprentice'; 
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import TextField from '@/components/ui/TextField';
import SelectField from '@/components/ui/SelectField';
import TextAreaField from '@/components/ui/TextAreaField';
import Button from '@/components/ui/Button';

export default function ApprenticeProfile() {
  // 1. Fetch the apprentice profile
  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['apprenticeProfile'],
    queryFn: () => apprenticeApi.getProfile().then(res => res.data.data || res.data),
    retry: false, // Don't retry 404s infinitely
  });

  // 2. Setup the form with React Hook Form
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      tradeInterest: profile?.tradeInterest || '',
      experienceLevel: profile?.experienceLevel || '',
      availability: profile?.availability || '',
      bio: profile?.bio || '',
    },
  });

  const onSubmit = (data) => {
    // Handle the update/create logic here
    console.log(data);
  };

  // 3. Loading State
  if (isLoading) return <LoadingSpinner label="Loading profile..." />;

  // 4. Render Form (Handles both 404 for new users and existing users)
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        {isError ? 'Complete Your Apprentice Profile' : 'Update Your Apprentice Profile'}
      </h1>
      <p className="text-gray-500 mb-6">
        {isError 
          ? "You haven't set up your apprentice profile yet. Tell us what trade you want to learn so trainers can find you." 
          : "Keep your profile up to date to increase your chances of finding a trainer."}
      </p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <SelectField
          label="Trade of Interest"
          error={errors.tradeInterest?.message}
          {...register('tradeInterest', { required: 'Select a trade.' })}
        >
          <option value="">Select a trade</option>
          <option value="electrical">Electrical</option>
          <option value="plumbing">Plumbing</option>
          <option value="welding">Welding</option>
          <option value="carpentry">Carpentry</option>
          <option value="tailoring">Tailoring</option>
          <option value="hvac">HVAC</option>
        </SelectField>

        <SelectField
          label="Experience Level"
          error={errors.experienceLevel?.message}
          {...register('experienceLevel', { required: 'Select your experience level.' })}
        >
          <option value="">Select experience level</option>
          <option value="none">No experience (Beginner)</option>
          <option value="some">Some experience</option>
          <option value="intermediate">Intermediate</option>
        </SelectField>

        <SelectField
          label="Availability"
          error={errors.availability?.message}
          {...register('availability', { required: 'Select your availability.' })}
        >
          <option value="">Select availability</option>
          <option value="full_time">Full time</option>
          <option value="part_time">Part time</option>
          <option value="weekends">Weekends only</option>
        </SelectField>

        <TextAreaField
          label="Short Bio (Optional)"
          placeholder="Tell trainers a little about yourself and why you want to learn this trade."
          maxLength={300}
          {...register('bio')}
        />

        <div className="pt-4">
          <Button type="submit" fullWidth>
            {isError ? 'Create Profile' : 'Save Profile'}
          </Button>
        </div>
      </form>
    </div>
  );
}
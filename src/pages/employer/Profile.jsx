import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
// Assuming you have an employerApi set up similar to workerApi
import { employerApi } from '@/lib/api/employer'; 
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import TextField from '@/components/ui/TextField';
import SelectField from '@/components/ui/SelectField';
import Button from '@/components/ui/Button';

export default function EmployerProfile() {
  // 1. Fetch the employer profile
  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['employerProfile'],
    queryFn: () => employerApi.getProfile().then(res => res.data.data || res.data),
    retry: false, // Don't retry 404s infinitely
  });

  // 2. Setup the form with React Hook Form
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      companyName: profile?.companyName || '',
      industry: profile?.industry || '',
      companySize: profile?.companySize || '',
      stateId: profile?.state?.id || profile?.stateId || '',
      website: profile?.website || '',
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
        {isError ? 'Complete Your Company Profile' : 'Update Your Company Profile'}
      </h1>
      <p className="text-gray-500 mb-6">
        {isError 
          ? "You haven't set up your company profile yet. Add your details to start posting jobs and finding workers." 
          : "Keep your company details up to date so workers know who they are applying to."}
      </p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextField
          label="Company Name"
          placeholder="e.g. BuildRight Construction Ltd"
          error={errors.companyName?.message}
          {...register('companyName', { required: 'Company name is required.' })}
        />

        <SelectField
          label="Industry"
          error={errors.industry?.message}
          {...register('industry', { required: 'Select an industry.' })}
        >
          <option value="">Select an industry</option>
          <option value="construction">Construction</option>
          <option value="property">Property Management</option>
          <option value="sme">SME / General Business</option>
          <option value="individual">Individual / Homeowner</option>
        </SelectField>

        <SelectField
          label="Company Size"
          error={errors.companySize?.message}
          {...register('companySize', { required: 'Select company size.' })}
        >
          <option value="">Select company size</option>
          <option value="1-10">1 - 10 employees</option>
          <option value="11-50">11 - 50 employees</option>
          <option value="51-200">51 - 200 employees</option>
          <option value="200+">200+ employees</option>
        </SelectField>

        <TextField
          label="Website (Optional)"
          placeholder="https://yourcompany.com"
          error={errors.website?.message}
          {...register('website')}
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
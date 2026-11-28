import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { trainingApi } from '@/lib/api/training';
import { useAuthStore } from '@/lib/store/authStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';
import FeedbackBanner from '@/components/ui/FeedbackBanner';

export default function TrainerProfile() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  
  const [yearsExperience, setYearsExperience] = useState('');
  const [error, setError] = useState('');

  const setupMutation = useMutation({
    mutationFn: (data) => trainingApi.createOrUpdateTrainerProfile(data),
    onSuccess: () => {
      const updatedUser = {
        ...user,
        roles: [...(user.roles || []), 'trainer'],
        role: user.role === 'worker' ? 'worker' : 'trainer',
      };
      setUser(updatedUser);
      alert('You are now a Trainer!');
      // Force reload so the new token includes the trainer role
      window.location.href = '/worker/training/dashboard'; 
    },
    onError: (err) => {
      // Log the FULL error response from the backend
      console.error("Full Backend Error:", err.response?.data);
      
      // Try to extract the exact validation message
      const details = err.response?.data?.error?.details;
      if (Array.isArray(details) && details.length > 0) {
        setError(`Validation Error: ${details[0].path} - ${details[0].message}`);
      } else {
        setError(err.response?.data?.error?.message || 'Failed to upgrade to trainer. Make sure your Worker Profile is complete first.');
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!yearsExperience) {
      setError('Please enter your years of training experience.');
      return;
    }

    const payload = { 
      yearsTraining: Number(yearsExperience) 
    };

    console.log("Sending Payload to Backend:", payload);
    setupMutation.mutate(payload);
  };

  return (
    <div className="mx-auto max-w-xl text-left">
      <Card className="p-6">
        <h1 className="text-h2 font-bold text-navy-500">Set up Trainer Profile</h1>
        <p className="mt-1 text-body2 text-navy-500/70 mb-6">
          Tell us about your experience so apprentices can trust you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <TextField
            label="Years of Training Experience"
            type="number"
            placeholder="e.g. 5"
            value={yearsExperience}
            onChange={(e) => setYearsExperience(e.target.value)}
            required
          />

          {error && <FeedbackBanner tone="error">{error}</FeedbackBanner>}

          <Button 
            type="submit" 
            size="lg" 
            fullWidth 
            loading={setupMutation.isPending}
          >
            Create Trainer Profile
          </Button>
        </form>
      </Card>
    </div>
  );
}
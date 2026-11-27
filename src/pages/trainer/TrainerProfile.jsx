import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { trainingApi } from '@/lib/api/training';
import { catalogApi } from '@/lib/api/catalog';
import { useAuthStore } from '@/lib/store/authStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';
import TextAreaField from '@/components/ui/TextAreaField';
import SelectField from '@/components/ui/SelectField';
import FeedbackBanner from '@/components/ui/FeedbackBanner';

export default function TrainerProfile() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  
  const [bio, setBio] = useState('');
  const [tradeId, setTradeId] = useState('');
  const [stateId, setStateId] = useState('');
  const [lgaId, setLgaId] = useState('');
  const [yearsTraining, setYearsTraining] = useState('');
  const [error, setError] = useState('');

  // 1. Fetch Trades
  const { data: trades = [] } = useQuery({
    queryKey: ['trades'],
    queryFn: catalogApi.getTrades,
  });

  // 2. Fetch States
  const { data: states = [] } = useQuery({
    queryKey: ['states'],
    queryFn: catalogApi.getStates,
  });

  // 3. Find stateCode for LGA fetch
  const selectedState = states.find(s => s.id === stateId);
  const stateCode = selectedState?.code || selectedState?.stateCode;

  // 4. Fetch LGAs
  const { data: lgas = [] } = useQuery({
    queryKey: ['lgas', stateCode],
    queryFn: () => catalogApi.getLgas(stateCode),
    enabled: !!stateCode,
  });

  const setupMutation = useMutation({
    mutationFn: (data) => trainingApi.createOrUpdateTrainerProfile(data),
    onSuccess: () => {
      const updatedUser = {
        ...user,
        roles: [...(user.roles || []), 'trainer'],
        role: user.role === 'worker' ? 'worker' : 'trainer',
      };
      setUser(updatedUser);
      alert('Trainer profile created successfully!');
      window.location.href = '/worker/training/dashboard'; 
    },
    onError: (err) => {
      // 🚨 THIS WILL SHOW US EXACTLY WHY IT FAILED
      console.error("FULL BACKEND ERROR:", err.response?.data);
      
      const details = err.response?.data?.error?.details;
      if (Array.isArray(details) && details.length > 0) {
        setError(details.map(d => `${d.path}: ${d.message}`).join(', '));
      } else {
        setError(err.response?.data?.error?.message || 'Failed to create trainer profile.');
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bio || !tradeId || !stateId || !lgaId || !yearsTraining) {
      setError('Please fill in all fields.');
      return;
    }
    
    // Sending the FULL payload that backend likely expects
    const payload = { 
      bio: bio,
      tradeId: tradeId, 
      stateId: stateId,
      lgaId: lgaId,
      yearsTraining: Number(yearsTraining) 
    };

    console.log("Submitting to Backend:", payload);
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
          <SelectField 
            label="Primary Trade"
            value={tradeId}
            onChange={(e) => setTradeId(e.target.value)}
            required
          >
            <option value="">Select a trade</option>
            {trades.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </SelectField>

          <div className="grid grid-cols-2 gap-4">
            <SelectField 
              label="State"
              value={stateId}
              onChange={(e) => setStateId(e.target.value)}
              required
            >
              <option value="">Select state</option>
              {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </SelectField>

            <SelectField 
              label="LGA"
              value={lgaId}
              onChange={(e) => setLgaId(e.target.value)}
              disabled={!stateId}
              required
            >
              <option value="">Select LGA</option>
              {lgas.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </SelectField>
          </div>

          <TextField
            label="Years of Training Experience"
            type="number"
            placeholder="e.g. 5"
            value={yearsTraining}
            onChange={(e) => setYearsTraining(e.target.value)}
            required
          />

          <TextAreaField
            label="Professional Bio"
            placeholder="e.g. I am a master electrician with 10 years of experience..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
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
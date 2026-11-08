import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, CheckCircle2 } from 'lucide-react';

import { jobsApi } from '@/lib/api/jobs';
import { catalogApi } from '@/lib/api/catalog';
import { getApiErrorMessage } from '@/lib/utils/errors';

// Dev B's custom components
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import TextField from '@/components/ui/TextField';
import TextAreaField from '@/components/ui/TextAreaField';
import SelectField from '@/components/ui/SelectField';
import FeedbackBanner from '@/components/ui/FeedbackBanner';

const FIELDS = ['title', 'description', 'tradeId', 'stateId', 'lgaId', 'urgency', 'budget'];

function NairaIcon({ className = '' }) {
  return <span className={`w-[18px] text-center text-body1 font-bold ${className}`}>₦</span>;
}

export default function NewJob() {
  const navigate = useNavigate();
  const [postedJob, setPostedJob] = useState(null);
  const [selectedStateCode, setSelectedStateCode] = useState('');

  // Fetch Trades and States dynamically
  const { data: trades = [], isLoading: tradesLoading } = useQuery({ 
    queryKey: ['trades'], 
    queryFn: catalogApi.getTrades 
  });
  
  const { data: states = [] } = useQuery({ 
    queryKey: ['states'], 
    queryFn: catalogApi.getStates 
  });

  // Fetch LGAs based on the selected state's 'code'
  const { data: lgas = [] } = useQuery({
    queryKey: ['lgas', selectedStateCode],
    queryFn: () => catalogApi.getLgas(selectedStateCode),
    enabled: !!selectedStateCode,
  });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm();

  const createMutation = useMutation({
    mutationFn: (payload) => jobsApi.createJob(payload),
    onSuccess: (_, payload) => setPostedJob({ title: payload.title }),
    onError: (err) => {
      const details = err.response?.data?.error?.details;
      if (Array.isArray(details)) {
        details.forEach((detail) => {
          if (FIELDS.includes(detail.path)) {
            setError(detail.path, { message: detail.message });
          }
        });
      }
    },
  });

  const onSubmit = (data) => {
    // Construct the exact payload the backend expects
    const payload = {
      title: data.title.trim(),
      description: data.description.trim(),
      tradeId: data.tradeId,
      stateId: data.stateId,
      lgaId: data.lgaId,
      urgency: data.urgency,
      budget: data.budget ? Number(data.budget) : undefined,
    };
    createMutation.mutate(payload);
  };

  const showBanner = createMutation.isError;

  const handlePostAnother = () => {
    reset();
    createMutation.reset();
    setPostedJob(null);
    setSelectedStateCode('');
  };

  if (postedJob) {
    return (
      <div className="mx-auto max-w-xl">
        <Card className="p-6 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-50">
            <CheckCircle2 size={28} className="text-success-500" />
          </span>
          <h1 className="mt-4 text-h2 font-bold text-navy-500">Job posted</h1>
          <p className="mt-1 text-body2 text-navy-500/70">
            {postedJob.title} is now open for workers to see.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button variant="outlined" fullWidth onClick={handlePostAnother}>
              Post another job
            </Button>
            <Button fullWidth onClick={() => navigate('/employer/dashboard')}>
              View my jobs
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl text-left">
      <Card className="p-6">
        <h1 className="text-h2 font-bold text-navy-500">Post a job</h1>
        <p className="mt-1 text-body2 text-navy-500/70">
          Describe the work clearly so the right worker can respond.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
          <TextField
            label="Job title"
            icon={Briefcase}
            placeholder="e.g. Repair shop wiring"
            error={errors.title?.message}
            {...register('title', { required: 'Add a clear job title.', minLength: { value: 5, message: 'Job title must be at least 5 characters.' } })}
          />

          <TextAreaField
            label="Description"
            placeholder="Describe the work you need done"
            error={errors.description?.message}
            {...register('description', { required: 'Describe the work you need done.', minLength: { value: 10, message: 'Description must be at least 10 characters.' } })}
          />

          <SelectField
            label="Trade"
            error={errors.tradeId?.message}
            {...register('tradeId', { required: 'Choose a trade.' })}
          >
            <option value="">{tradesLoading ? 'Loading trades...' : 'Select a trade'}</option>
            {trades.map((trade) => (
              <option key={trade.id} value={trade.id}>{trade.name}</option>
            ))}
          </SelectField>

          {/* State and LGA Grid */}
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="State"
              error={errors.stateId?.message}
              {...register('stateId', { 
                required: 'Choose a state.',
                onChange: (e) => {
                  const stateObj = states.find(s => s.id === e.target.value);
                  setSelectedStateCode(stateObj?.code || '');
                }
              })}
            >
              <option value="">Select state</option>
              {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </SelectField>

            <SelectField
              label="LGA"
              error={errors.lgaId?.message}
              disabled={!selectedStateCode}
              {...register('lgaId', { required: 'Choose an LGA.' })}
            >
              <option value="">Select LGA</option>
              {lgas.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </SelectField>
          </div>

          <SelectField
            label="Urgency"
            error={errors.urgency?.message}
            {...register('urgency', { required: 'Select urgency.' })}
          >
            <option value="">Select urgency</option>
            <option value="low">Low (Within a week)</option>
            <option value="medium">Medium (Within 2-3 days)</option>
            <option value="high">High (ASAP)</option>
          </SelectField>

          <TextField
            label="Budget (₦) - Optional"
            icon={NairaIcon}
            type="number"
            placeholder="e.g. 45000"
            error={errors.budget?.message}
            {...register('budget')}
          />

          {showBanner && (
            <FeedbackBanner tone="error">
              {getApiErrorMessage(createMutation.error, 'Could not post the job. Please try again.')}
            </FeedbackBanner>
          )}

          <Button type="submit" size="lg" fullWidth loading={createMutation.isPending}>
            Publish job
          </Button>
        </form>
      </Card>
    </div>
  );
}
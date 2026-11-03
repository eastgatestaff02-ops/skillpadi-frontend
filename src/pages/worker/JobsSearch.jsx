import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, MapPin, Check, Briefcase } from 'lucide-react';
import { jobsApi } from '@/lib/api/jobs';
import { unwrapList } from '@/lib/utils/api';
import { getApiErrorMessage } from '@/lib/utils/errors';
import { queryDefaults, mutationDefaults } from '@/lib/utils/network';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Chip from '@/components/ui/Chip';
import Modal from '@/components/ui/Modal';
import TextField from '@/components/ui/TextField';
import TextAreaField from '@/components/ui/TextAreaField';
import FeedbackBanner from '@/components/ui/FeedbackBanner';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import ErrorState from '@/components/shared/ErrorState';

const emptyFilters = { trade: '', location: '' };
const DEFAULT_MESSAGE = 'I am interested';
const MAX_MESSAGE = 500;

const toParams = (filters) =>
  Object.fromEntries(Object.entries(filters).filter(([, value]) => value.trim()));

const jobIdOf = (application) =>
  application.job?.id ?? application.jobId ?? application.job_id;

const formatBudget = (value) =>
  value
    ? new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 0,
      }).format(value)
    : 'Budget not set';

export default function JobsSearch() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState(emptyFilters);
  const [applied, setApplied] = useState(emptyFilters);
  const [appliedIds, setAppliedIds] = useState([]);
  const [applyJob, setApplyJob] = useState(null);
  const [message, setMessage] = useState('');

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['openJobs', applied],
    queryFn: () => jobsApi.getOpenJobs(toParams(applied)).then((res) => unwrapList(res.data)),
    ...queryDefaults,
  });

  const myApplications = useQuery({
    queryKey: ['myApplications'],
    queryFn: () => jobsApi.getMyApplications().then((res) => unwrapList(res.data)),
    ...queryDefaults,
  });

  const applyMutation = useMutation({
    mutationFn: ({ jobId, text }) => jobsApi.applyForJob(jobId, { message: text }),
    onSuccess: (_, { jobId }) => {
      setAppliedIds((ids) => [...ids, jobId]);
      queryClient.invalidateQueries({ queryKey: ['myApplications'] });
      setApplyJob(null);
    },
    ...mutationDefaults,
  });

  const jobs = data || [];
  const appliedSet = new Set(
    [...appliedIds, ...(myApplications.data || []).map(jobIdOf)].filter(Boolean).map(String)
  );

  const handleSearch = (e) => {
    e.preventDefault();
    setApplied(filters);
  };

  const handleReset = () => {
    setFilters(emptyFilters);
    setApplied(emptyFilters);
  };

  const openApply = (job) => {
    applyMutation.reset();
    setMessage('');
    setApplyJob(job);
  };

  const closeApply = () => setApplyJob(null);

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!applyJob || applyMutation.isPending) return;
    applyMutation.mutate({ jobId: applyJob.id, text: message.trim() || DEFAULT_MESSAGE });
  };

  let content;
  if (isLoading) {
    content = <LoadingSpinner label="Finding jobs..." variant="list" />;
  } else if (isError) {
    content = <ErrorState message="We could not load jobs." onRetry={refetch} />;
  } else if (jobs.length === 0) {
    content = (
      <EmptyState
        icon={Briefcase}
        title="No jobs found"
        message="Try a different trade or nearby location."
        action={<Button onClick={handleReset}>Change search</Button>}
      />
    );
  } else {
    content = (
      <div className="space-y-4">
        {jobs.map((job) => {
          const trade = job.trade?.name || job.trade || job.tradeName;
          const location = typeof job.location === 'string' ? job.location : job.location?.name;
          const hasApplied = appliedSet.has(String(job.id));

          return (
            <Card key={job.id}>
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-body1 font-bold text-navy-500">{job.title}</h2>
                {trade && <Chip>{trade}</Chip>}
              </div>
              <p className="mt-1 flex items-center gap-1 text-caption text-navy-500/70">
                <MapPin size={12} className="shrink-0" />
                {location}
              </p>
              {job.description && (
                <p className="mt-2 line-clamp-2 text-body2 text-navy-500">{job.description}</p>
              )}
              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-body1 font-bold text-navy-500">{formatBudget(job.budget)}</p>
                <Button
                  size="md"
                  leftIcon={hasApplied ? Check : undefined}
                  disabled={hasApplied}
                  onClick={() => openApply(job)}
                >
                  {hasApplied ? 'Applied' : 'Apply'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <div className="text-left">
      <h1 className="text-h2 font-bold text-navy-500">Find jobs</h1>

      <Card className="mb-6 mt-4 p-4">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextField
              label="Trade"
              icon={Search}
              placeholder="e.g. Electrician"
              value={filters.trade}
              onChange={(e) => setFilters({ ...filters, trade: e.target.value })}
            />
            <TextField
              label="Location"
              icon={MapPin}
              placeholder="City or state"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            />
          </div>
          <Button type="submit" size="lg" fullWidth>
            Search jobs
          </Button>
        </form>
      </Card>

      {content}

      <Modal
        open={!!applyJob}
        onClose={closeApply}
        title={applyJob ? `Apply to ${applyJob.title}` : 'Apply'}
      >
        <form onSubmit={handleApplySubmit} noValidate className="space-y-4">
          <TextAreaField
            label="Message to the employer (optional)"
            labelRight={`${message.length}/${MAX_MESSAGE}`}
            placeholder="Tell them why you are a good fit"
            maxLength={MAX_MESSAGE}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {applyMutation.isError && (
            <FeedbackBanner tone="error">
              {getApiErrorMessage(
                applyMutation.error,
                'Could not apply. You may have already applied to this job.'
              )}
            </FeedbackBanner>
          )}

          <div className="space-y-3">
            <Button type="submit" fullWidth loading={applyMutation.isPending}>
              Send application
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={closeApply}
              disabled={applyMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
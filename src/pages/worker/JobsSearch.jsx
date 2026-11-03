import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Search, MapPin, Check, Briefcase } from 'lucide-react';
import { jobsApi } from '@/lib/api/jobs';
import { unwrapList } from '@/lib/utils/api';
import { getApiErrorMessage } from '@/lib/utils/errors';
import { queryDefaults, mutationDefaults } from '@/lib/utils/network';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Chip from '@/components/ui/Chip';
import TextField from '@/components/ui/TextField';
import FeedbackBanner from '@/components/ui/FeedbackBanner';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import ErrorState from '@/components/shared/ErrorState';

const emptyFilters = { trade: '', location: '' };

const toParams = (filters) =>
  Object.fromEntries(Object.entries(filters).filter(([, value]) => value.trim()));

const formatBudget = (value) =>
  value
    ? new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 0,
      }).format(value)
    : 'Budget not set';

export default function JobsSearch() {
  const [filters, setFilters] = useState(emptyFilters);
  const [applied, setApplied] = useState(emptyFilters);
  const [appliedIds, setAppliedIds] = useState([]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['openJobs', applied],
    queryFn: () => jobsApi.getOpenJobs(toParams(applied)).then((res) => unwrapList(res.data)),
    ...queryDefaults,
  });

  const applyMutation = useMutation({
    mutationFn: (jobId) => jobsApi.applyForJob(jobId, { message: 'I am interested' }),
    onSuccess: (_, jobId) => setAppliedIds((ids) => [...ids, jobId]),
    ...mutationDefaults,
  });

  const jobs = data || [];

  const handleSearch = (e) => {
    e.preventDefault();
    setApplied(filters);
  };

  const handleReset = () => {
    setFilters(emptyFilters);
    setApplied(emptyFilters);
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
          const hasApplied = appliedIds.includes(job.id);
          const isApplying = applyMutation.isPending && applyMutation.variables === job.id;

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
                  loading={isApplying}
                  disabled={hasApplied || applyMutation.isPending}
                  onClick={() => applyMutation.mutate(job.id)}
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

      {applyMutation.isError && (
        <FeedbackBanner tone="error" className="mb-4">
          {getApiErrorMessage(
            applyMutation.error,
            'Could not apply. You may have already applied to this job.'
          )}
        </FeedbackBanner>
      )}

      {content}
    </div>
  );
}
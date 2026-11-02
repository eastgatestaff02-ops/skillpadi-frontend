import { useState } from 'react';
import { Plus, Briefcase } from 'lucide-react';
import { useMyJobs } from '@/lib/hooks/useEmployerJobs';
import { JOB_STATUS } from '@/lib/utils/constants';
import { unwrapList } from '@/lib/utils/api';
import JobCard from '@/features/employer/JobCard';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import ErrorState from '@/components/shared/ErrorState';

const isStatus = (job, status) => String(job.status || '').toLowerCase() === status;

export default function EmployerDashboard() {
  const [tab, setTab] = useState(JOB_STATUS.OPEN);
  const { data, isLoading, isError, refetch } = useMyJobs();

  const jobs = unwrapList(data);
  const openJobs = jobs.filter((job) => isStatus(job, JOB_STATUS.OPEN));
  const filledJobs = jobs.filter((job) => isStatus(job, JOB_STATUS.FILLED));
  const visibleJobs = tab === JOB_STATUS.OPEN ? openJobs : filledJobs;

  const postJobButton = (
    <Button to="/employer/jobs/new" leftIcon={Plus}>
      Post a job
    </Button>
  );

  const tabs = [
    { id: JOB_STATUS.OPEN, label: 'Open jobs', count: openJobs.length },
    { id: JOB_STATUS.FILLED, label: 'Filled jobs', count: filledJobs.length },
  ];

  let content;
  if (isLoading) {
    content = <LoadingSpinner label="Loading your jobs..." />;
  } else if (isError) {
    content = <ErrorState message="We could not load your jobs." onRetry={refetch} />;
  } else if (visibleJobs.length === 0) {
    content =
      tab === JOB_STATUS.OPEN ? (
        <EmptyState
          icon={Briefcase}
          title="Your first job starts here"
          message="The workers who match your trade will see it."
          action={postJobButton}
        />
      ) : (
        <EmptyState
          icon={Briefcase}
          title="No filled jobs yet"
          message="Jobs you mark as filled will show up here."
        />
      );
  } else {
    content = (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {visibleJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    );
  }

  return (
    <div className="text-left">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-h2 font-bold text-navy-500">My jobs</h1>
        {postJobButton}
      </div>

      <div role="tablist" className="mb-5 flex gap-1 rounded-lg border border-navy-50 bg-white p-1">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            className={`flex-1 rounded-md px-3 py-2 text-body2 font-medium transition-colors ${
              tab === item.id ? 'bg-ochre-100 text-navy-500' : 'text-navy-500/70 hover:bg-cream'
            }`}
          >
            {item.label} ({item.count})
          </button>
        ))}
      </div>

      {content}
    </div>
  );
}
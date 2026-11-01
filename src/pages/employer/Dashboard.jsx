import { Link } from 'react-router-dom';
import { Plus, Briefcase } from 'lucide-react';
import { useMyJobs, useUpdateJobStatus } from '@/lib/hooks/useEmployerJobs';
import { JOB_STATUS } from '@/lib/utils/constants';
import JobCard from '@/features/employer/JobCard';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import ErrorState from '@/components/shared/ErrorState';

const postJobLink = (
  <Link
    to="/employer/jobs/new"
    className="inline-flex items-center gap-2 rounded bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
  >
    <Plus size={18} /> Post a job
  </Link>
);

export default function EmployerDashboard() {
  const { data: jobs, isLoading, isError, refetch } = useMyJobs();
  const updateStatus = useUpdateJobStatus();

  const handleMarkFilled = (id) => {
    updateStatus.mutate({ id, status: JOB_STATUS.FILLED });
  };

  let content;
  if (isLoading) {
    content = <LoadingSpinner label="Loading your jobs..." />;
  } else if (isError) {
    content = <ErrorState message="We could not load your jobs." onRetry={refetch} />;
  } else if (!jobs || jobs.length === 0) {
    content = (
      <EmptyState
        icon={Briefcase}
        title="No jobs posted yet"
        message="Post your first job and skilled workers will be able to find it."
        action={postJobLink}
      />
    );
  } else {
    content = (
      <div className="space-y-4">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onMarkFilled={handleMarkFilled}
            isUpdating={updateStatus.isPending && updateStatus.variables?.id === job.id}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-4 text-left md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">My Jobs</h1>
        <div className="flex gap-3">
          <Link
            to="/employer/search"
            className="rounded bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
          >
            Find workers
          </Link>
          {postJobLink}
        </div>
      </div>

      {updateStatus.isError && (
        <p role="alert" className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">
          Could not update the job. Please try again.
        </p>
      )}

      {content}
    </div>
  );
}
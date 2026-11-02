import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Users } from 'lucide-react';
import { useJob, useUpdateJobStatus } from '@/lib/hooks/useEmployerJobs';
import { JOB_STATUS } from '@/lib/utils/constants';
import { getApiErrorMessage } from '@/lib/utils/errors';
import ApplicantCard from '@/features/employer/ApplicantCard';
import MarkFilledPrompt from '@/features/employer/MarkFilledPrompt';
import RatingModal from '@/components/shared/RatingModal';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Chip from '@/components/ui/Chip';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import ErrorState from '@/components/shared/ErrorState';

const formatBudget = (value) =>
  value
    ? new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 0,
      }).format(value)
    : 'Budget not set';

const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function JobDetail() {
  const { id } = useParams();
  const { data: job, isLoading, isError, refetch } = useJob(id);
  const updateStatus = useUpdateJobStatus();
  const [promptOpen, setPromptOpen] = useState(false);
  const [completed, setCompleted] = useState(null);
  const [ratingTarget, setRatingTarget] = useState(null);

  if (isLoading) return <LoadingSpinner label="Loading job..." />;

  if (isError || !job) {
    return <ErrorState message="We could not load this job." onRetry={refetch} />;
  }

  const isOpen = String(job.status || '').toLowerCase() === 'open';
  const trade = job.trade?.name || job.trade || job.tradeName;
  const location = typeof job.location === 'string' ? job.location : job.location?.name;
  const posted = formatDate(job.createdAt);
  const applicants = Array.isArray(job.applicants) ? job.applicants : [];

  const handleConfirm = (jobItem, hired) => {
    updateStatus.mutate(
      { id: jobItem.id, status: JOB_STATUS.FILLED, hiredWorkerId: hired?.id },
      { onSuccess: () => setCompleted({ hired }) }
    );
  };

  const closePrompt = () => {
    updateStatus.reset();
    setPromptOpen(false);
    setCompleted(null);
  };

  const handleRate = (hired) => {
    setRatingTarget(hired);
    closePrompt();
  };

  let applicantsContent;
  if (applicants.length === 0) {
    applicantsContent = (
      <EmptyState
        icon={Users}
        title="No applicants yet"
        message="Workers who match your trade will see this job and can apply."
      />
    );
  } else {
    applicantsContent = (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {applicants.map((applicant) => (
          <ApplicantCard key={applicant.id} applicant={applicant} jobTitle={job.title} />
        ))}
      </div>
    );
  }

  return (
    <div className="text-left">
      <Button
        to="/employer/dashboard"
        variant="text"
        size="sm"
        leftIcon={ArrowLeft}
        className="mb-3"
      >
        Back to my jobs
      </Button>

      <Card className="p-5">
        <div className="flex items-center justify-between gap-2">
          <Chip tone={isOpen ? 'success' : 'danger'}>{isOpen ? 'Open' : 'Filled'}</Chip>
          {trade && <Chip>{trade}</Chip>}
        </div>

        <h1 className="mt-3 text-h2 font-bold text-navy-500">{job.title}</h1>

        <p className="mt-1 flex items-center gap-1 text-body2 text-navy-500/70">
          <MapPin size={14} className="shrink-0" />
          {location}
          {posted && ` · Posted ${posted}`}
        </p>

        <p className="mt-3 text-body2 text-navy-500">{job.description}</p>

        <p className="mt-3 text-h3 font-bold text-navy-500">{formatBudget(job.budget)}</p>

        {isOpen && (
          <Button variant="outlined" fullWidth className="mt-4" onClick={() => setPromptOpen(true)}>
            Mark as filled
          </Button>
        )}
      </Card>

      <h2 className="mb-3 mt-8 text-h3 font-bold text-navy-500">
        Applicants ({applicants.length})
      </h2>
      {applicantsContent}

      <MarkFilledPrompt
        job={promptOpen ? job : null}
        applicants={applicants}
        loading={updateStatus.isPending}
        error={
          updateStatus.isError
            ? getApiErrorMessage(updateStatus.error, 'Could not update the job. Please try again.')
            : ''
        }
        completed={completed}
        onConfirm={handleConfirm}
        onCancel={closePrompt}
        onRate={handleRate}
      />

      <RatingModal
        isOpen={!!ratingTarget}
        onClose={() => setRatingTarget(null)}
        jobId={job.id}
        revieweeId={ratingTarget?.id}
        revieweeName={ratingTarget?.name}
      />
    </div>
  );
}
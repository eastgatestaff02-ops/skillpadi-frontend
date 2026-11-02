import { MapPin, Users } from 'lucide-react';
import Card from '@/components/ui/Card';
import Chip from '@/components/ui/Chip';
import Button from '@/components/ui/Button';

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
  return date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
};

export default function JobCard({ job, onMarkFilled }) {
  const isOpen = String(job.status || '').toLowerCase() === 'open';
  const trade = job.trade?.name || job.trade || job.tradeName;
  const location = typeof job.location === 'string' ? job.location : job.location?.name;
  const posted = formatDate(job.createdAt);
  const applicantCount =
    job.applicantCount ??
    job.applicantsCount ??
    (Array.isArray(job.applicants) ? job.applicants.length : null);

  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between gap-2">
        <Chip tone={isOpen ? 'success' : 'danger'}>{isOpen ? 'Open' : 'Filled'}</Chip>
        {trade && <Chip>{trade}</Chip>}
      </div>

      <h3 className="mt-3 text-body1 font-bold text-navy-500">{job.title}</h3>

      <p className="mt-1 flex items-center gap-1 text-caption text-navy-500/70">
        <MapPin size={12} className="shrink-0" />
        {location}
        {posted && ` · Posted ${posted}`}
      </p>

      <p className="mt-2 line-clamp-2 text-body2 text-navy-500">{job.description}</p>

      <p className="mt-3 text-body1 font-bold text-navy-500">{formatBudget(job.budget)}</p>

      {applicantCount !== null && (
        <p className="mt-1 flex items-center gap-1 text-caption text-navy-500/70">
          <Users size={14} />
          {applicantCount} {applicantCount === 1 ? 'applicant' : 'applicants'}
        </p>
      )}

      {isOpen && onMarkFilled && (
        <Button variant="outlined" fullWidth className="mt-4" onClick={() => onMarkFilled(job)}>
          Mark as filled
        </Button>
      )}
    </Card>
  );
}
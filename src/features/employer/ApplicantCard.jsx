import { ArrowUpRight } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { StarDisplay } from '@/components/ui/StarRating';

export default function ApplicantCard({ applicant, jobTitle }) {
  const name = applicant.name || 'Applicant';
  const trade = applicant.trade?.name || applicant.trade;
  const location =
    typeof applicant.location === 'string'
      ? applicant.location
      : [applicant.lga?.name, applicant.state?.name].filter(Boolean).join(', ');
  const years = applicant.yearsExperience;
  const rating = Number(applicant.rating) || 0;

  return (
    <Card>
      <div className="flex items-start gap-3">
        <Avatar name={name} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body1 font-bold text-navy-500">{name}</h3>
          <p className="truncate text-caption text-navy-500/70">
            {[trade, location].filter(Boolean).join(' · ')}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-navy-500/70">
            {rating > 0 && (
              <span className="flex items-center gap-1">
                <StarDisplay value={rating} size={12} /> {rating.toFixed(1)}
              </span>
            )}
            {typeof years === 'number' && (
              <span>
                {years} {years === 1 ? 'year' : 'years'} experience
              </span>
            )}
          </div>
        </div>
      </div>

      {jobTitle && (
        <p className="mt-3 text-caption text-navy-500/60">Applied for: {jobTitle}</p>
      )}

      {applicant.message && (
        <p className="mt-2 text-body2 text-navy-500">{applicant.message}</p>
      )}

      <Button
        to={`/profile/${applicant.id}`}
        fullWidth
        className="mt-4"
        rightIcon={ArrowUpRight}
      >
        View profile
      </Button>
    </Card>
  );
}
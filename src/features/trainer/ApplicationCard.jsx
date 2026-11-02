import { MessageCircle } from 'lucide-react';
import { APPLICATION_STATUS } from '@/lib/utils/constants';
import { buildWhatsappLink } from '@/lib/utils/contact';
import StatusBadge from '@/features/apprenticeship/StatusBadge';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
};

export default function ApplicationCard({ application, onDecide, isUpdating }) {
  const isPending = String(application.status || '').toLowerCase() === APPLICATION_STATUS.PENDING;
  const listing = application.listing;
  const trade = listing?.trade?.name || listing?.trade;
  const whatsappLink = buildWhatsappLink(application.apprenticePhone);

  return (
    <Card>
      <div className="flex items-start gap-3">
        <Avatar name={application.apprenticeName} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body1 font-bold text-navy-500">
            {application.apprenticeName}
          </h3>
          {listing && (
            <p className="text-caption text-navy-500/70">
              Applied for {trade} apprenticeship · {listing.location}
            </p>
          )}
        </div>
        <StatusBadge status={application.status} />
      </div>

      <p className="mt-3 text-body2 text-navy-500">{application.whyInterested}</p>
      <p className="mt-2 text-caption text-navy-500/60">
        {application.availability && `${application.availability} · `}
        Applied {formatDate(application.createdAt)}
      </p>

      <div className="mt-4 space-y-3">
        {whatsappLink && (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-ochre-500 bg-white text-body2 font-medium text-navy-500 transition-colors hover:bg-ochre-50 active:bg-ochre-200"
          >
            <MessageCircle size={18} /> Contact on WhatsApp
          </a>
        )}

        {isPending && (
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outlined"
              disabled={isUpdating}
              onClick={() => onDecide(application.id, APPLICATION_STATUS.DECLINED)}
            >
              Decline
            </Button>
            <Button
              loading={isUpdating}
              onClick={() => onDecide(application.id, APPLICATION_STATUS.ACCEPTED)}
            >
              Accept
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
import { MapPin, Clock, MessageCircle } from 'lucide-react';
import { APPLICATION_STATUS } from '@/lib/utils/constants';
import StatusBadge from '@/features/apprenticeship/StatusBadge';

export default function ApplicationCard({ application, onDecide, isUpdating }) {
  const isPending = application.status === APPLICATION_STATUS.PENDING;
  const listing = application.listing;
  const whatsappLink = `https://wa.me/${application.apprenticePhone.replace('+', '')}`;

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-5 text-left shadow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{application.apprenticeName}</h3>
          {listing && (
            <p className="mt-1 text-sm font-medium text-teal-700">
              Applied for: {listing.trade} apprenticeship
            </p>
          )}
        </div>
        <StatusBadge status={application.status} />
      </div>

      {listing && (
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin size={14} /> {listing.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} /> {listing.duration}
          </span>
        </div>
      )}

      <div className="mt-4 space-y-2 text-sm">
        <p className="text-gray-700">
          <span className="font-medium">Why interested: </span>
          {application.whyInterested}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Availability: </span>
          {application.availability}
        </p>
        <p className="text-gray-500">
          Applied {new Date(application.createdAt).toLocaleDateString('en-NG')}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700"
        >
          <MessageCircle size={16} /> Contact on WhatsApp
        </a>

        {isPending && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onDecide(application.id, APPLICATION_STATUS.DECLINED)}
              disabled={isUpdating}
              className="rounded bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 disabled:opacity-50"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={() => onDecide(application.id, APPLICATION_STATUS.ACCEPTED)}
              disabled={isUpdating}
              className="rounded bg-teal-600 px-4 py-2 text-sm text-white hover:bg-teal-700 disabled:opacity-50"
            >
              {isUpdating ? 'Saving...' : 'Accept'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
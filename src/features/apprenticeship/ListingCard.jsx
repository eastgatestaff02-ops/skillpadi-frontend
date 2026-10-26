import { Link } from 'react-router-dom';
import { MapPin, Clock, User } from 'lucide-react';

export default function ListingCard({ listing }) {
  return (
    <div className="flex flex-col rounded-lg border border-gray-100 bg-white p-5 text-left shadow">
      <h3 className="text-lg font-bold text-gray-900">{listing.trade} apprenticeship</h3>

      <div className="mt-3 space-y-1 text-sm text-gray-500">
        <p className="flex items-center gap-2">
          <User size={14} /> {listing.trainerName}
        </p>
        <p className="flex items-center gap-2">
          <MapPin size={14} /> {listing.location}
        </p>
        <p className="flex items-center gap-2">
          <Clock size={14} /> {listing.duration}
        </p>
      </div>

      {listing.requirements && (
        <p className="mt-3 text-sm text-gray-600">{listing.requirements}</p>
      )}

      <Link
        to={`/apprentice/listings/${listing.id}/apply`}
        className="mt-5 rounded bg-teal-600 py-2 text-center text-white hover:bg-teal-700"
      >
        Apply
      </Link>
    </div>
  );
}
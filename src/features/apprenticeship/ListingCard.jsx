import { MapPin, Clock } from 'lucide-react';
import Card from '@/components/ui/Card';
import Chip from '@/components/ui/Chip';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';

export default function ListingCard({ listing }) {
  const trade = listing.trade?.name || listing.trade;
  const trainer = listing.trainerName || 'Trainer';

  return (
    <Card className="flex flex-col">
      <Chip tone="ochre" className="self-start">
        {trade} apprenticeship
      </Chip>
      <h3 className="mt-3 text-body1 font-bold text-navy-500">Apprenticeship with {trainer}</h3>

      {listing.requirements && (
        <p className="mt-2 line-clamp-3 text-body2 text-navy-500">{listing.requirements}</p>
      )}

      <div className="mt-4 flex items-center gap-3">
        <Avatar name={trainer} size="sm" />
        <div className="min-w-0">
          <p className="truncate text-body2 font-bold text-navy-500">{trainer}</p>
          <p className="flex items-center gap-1 text-caption text-navy-500/70">
            <MapPin size={12} className="shrink-0" />
            Trainer · {listing.location}
          </p>
        </div>
      </div>

      <p className="mt-3 flex items-center gap-1 text-caption text-navy-500/70">
        <Clock size={12} /> {listing.duration}
      </p>

      <Button to={`/apprentice/listings/${listing.id}/apply`} fullWidth className="mt-4">
        Apply for apprenticeship
      </Button>
    </Card>
  );
}
import { MapPin, User } from 'lucide-react';
import Card from '@/components/ui/Card';
import Chip from '@/components/ui/Chip';
import Button from '@/components/ui/Button';

export default function WorkerCard({ worker }) {
  const location = [worker.lga?.name, worker.state?.name].filter(Boolean).join(', ');
  const years = worker.yearsExperience;
  const skills = worker.skills || [];

  return (
    <Card className="flex flex-col">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ochre-100 text-navy-500">
          <User size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body1 font-bold text-navy-500">
            {worker.trade?.name || 'Skilled worker'}
          </h3>
          {location && (
            <p className="mt-0.5 flex items-center gap-1 text-body2 text-navy-500/70">
              <MapPin size={14} className="shrink-0" />
              <span className="truncate">{location}</span>
            </p>
          )}
        </div>
      </div>

      {typeof years === 'number' && (
        <p className="mt-3 text-body2 text-navy-500">
          {years} {years === 1 ? 'year' : 'years'} of experience
        </p>
      )}

      {skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {skills.slice(0, 3).map((skill) => (
            <Chip key={skill.id}>{skill.name}</Chip>
          ))}
          {skills.length > 3 && <Chip>+{skills.length - 3}</Chip>}
        </div>
      )}

      <Button to={`/profile/${worker.id}`} variant="outlined" fullWidth className="mt-4">
        View profile
      </Button>
    </Card>
  );
}
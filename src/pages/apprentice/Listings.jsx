import { useState } from 'react';
import { Search, MapPin, GraduationCap } from 'lucide-react';
import { useListings } from '@/lib/hooks/useListings';
import { useTrades } from '@/lib/hooks/useCatalog';
import { unwrapList } from '@/lib/utils/api';
import ListingCard from '@/features/apprenticeship/ListingCard';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import SelectField from '@/components/ui/SelectField';
import TextField from '@/components/ui/TextField';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import ErrorState from '@/components/shared/ErrorState';

const emptyFilters = { trade: '', location: '' };

const toParams = (filters) =>
  Object.fromEntries(Object.entries(filters).filter(([, value]) => value.trim()));

export default function ApprenticeListings() {
  const [filters, setFilters] = useState(emptyFilters);
  const [applied, setApplied] = useState(emptyFilters);

  const { data: trades = [] } = useTrades();
  const { data, isLoading, isError, refetch } = useListings(toParams(applied));
  const listings = unwrapList(data);

  const handleSearch = (e) => {
    e.preventDefault();
    setApplied(filters);
  };

  const handleReset = () => {
    setFilters(emptyFilters);
    setApplied(emptyFilters);
  };

  let content;
  if (isLoading) {
    content = <LoadingSpinner label="Finding apprenticeships..." variant="cards" />;
  } else if (isError) {
    content = <ErrorState message="We could not load the listings." onRetry={refetch} />;
  } else if (listings.length === 0) {
    content = (
      <EmptyState
        icon={GraduationCap}
        title="No apprenticeships found"
        message="Try a different trade or location, or check back soon."
        action={<Button onClick={handleReset}>Change search</Button>}
      />
    );
  } else {
    content = (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    );
  }

  return (
    <div className="text-left">
      <h1 className="text-h2 font-bold text-navy-500">Find an apprenticeship</h1>
      <p className="mt-1 text-body2 text-navy-500/70">
        A clear path into a trade: pick a trainer and apply with a short personal statement.
      </p>

      <Card className="mb-6 mt-4 p-4">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SelectField
              label="Trade"
              icon={Search}
              value={filters.trade}
              onChange={(e) => setFilters({ ...filters, trade: e.target.value })}
            >
              <option value="">All trades</option>
              {trades.map((trade) => (
                <option key={trade.id} value={trade.name}>
                  {trade.name}
                </option>
              ))}
            </SelectField>
            <TextField
              label="Location"
              icon={MapPin}
              placeholder="City or state"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            />
          </div>
          <Button type="submit" size="lg" fullWidth>
            Search apprenticeships
          </Button>
        </form>
      </Card>

      {content}
    </div>
  );
}
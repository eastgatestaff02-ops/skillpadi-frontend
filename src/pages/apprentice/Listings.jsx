import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, GraduationCap } from 'lucide-react';
import { useListings } from '@/lib/hooks/useListings';
import { TRADES } from '@/lib/utils/constants';
import ListingCard from '@/features/apprenticeship/ListingCard';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import ErrorState from '@/components/shared/ErrorState';

export default function ApprenticeListings() {
  const [filters, setFilters] = useState({ trade: '', location: '' });
  const [appliedFilters, setAppliedFilters] = useState({ trade: '', location: '' });

  const { data: listings, isLoading, isError, refetch } = useListings(appliedFilters);

  const handleSearch = (e) => {
    e.preventDefault();
    setAppliedFilters(filters);
  };

  let content;
  if (isLoading) {
    content = <LoadingSpinner label="Finding apprenticeships..." />;
  } else if (isError) {
    content = <ErrorState message="We could not load the listings." onRetry={refetch} />;
  } else if (!listings || listings.length === 0) {
    content = (
      <EmptyState
        icon={GraduationCap}
        title="No apprenticeships found"
        message="Try a different trade or location, or check back soon."
      />
    );
  } else {
    content = (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-4 text-left md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Find an Apprenticeship</h1>
        <Link
          to="/apprentice/applications"
          className="rounded bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
        >
          My applications
        </Link>
      </div>

      <form
        onSubmit={handleSearch}
        className="mb-8 flex flex-col gap-4 rounded-lg bg-white p-4 shadow md:flex-row"
      >
        <select
          value={filters.trade}
          onChange={(e) => setFilters({ ...filters, trade: e.target.value })}
          className="flex-1 rounded border p-2"
        >
          <option value="">All trades</option>
          {TRADES.map((trade) => (
            <option key={trade} value={trade}>
              {trade}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Location (e.g. Lagos)"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="flex-1 rounded border p-2"
        />
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded bg-teal-600 px-6 py-2 text-white hover:bg-teal-700"
        >
          <Search size={18} /> Search
        </button>
      </form>

      {content}
    </div>
  );
}
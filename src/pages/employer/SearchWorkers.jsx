import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Search, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { workerApi } from '@/lib/api/worker';
import { useTrades, useStates } from '@/lib/hooks/useCatalog';
import { queryDefaults } from '@/lib/utils/network';
import WorkerCard from '@/features/employer/WorkerCard';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import SelectField from '@/components/ui/SelectField';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import ErrorState from '@/components/shared/ErrorState';

const PAGE_SIZE = 12;
const emptyFilters = { tradeId: '', stateId: '' };

const toParams = (filters) =>
  Object.fromEntries(Object.entries(filters).filter(([, value]) => value));

export default function SearchWorkers() {
  const [filters, setFilters] = useState(emptyFilters);
  const [applied, setApplied] = useState(emptyFilters);
  const [page, setPage] = useState(1);

  const { data: trades = [] } = useTrades();
  const { data: states = [] } = useStates();

  const {
    data: response,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['searchWorkers', applied, page],
    queryFn: () =>
      workerApi
        .searchWorkers({ ...toParams(applied), page, pageSize: PAGE_SIZE })
        .then((res) => res.data),
    placeholderData: keepPreviousData,
    ...queryDefaults,
  });

  const workers = response?.data || [];
  const pagination = response?.pagination;
  const totalPages = pagination?.totalPages || 1;

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setApplied(filters);
  };

  const handleReset = () => {
    setFilters(emptyFilters);
    setApplied(emptyFilters);
    setPage(1);
  };

  let content;
  if (isLoading) {
     content = <LoadingSpinner label="Finding workers..." variant="cards" />;
  } else if (isError) {
    content = <ErrorState message="We could not load workers." onRetry={refetch} />;
  } else if (workers.length === 0) {
    content = (
      <EmptyState
        icon={Search}
        title="No workers found"
        message="Try a different trade or nearby location."
        action={<Button onClick={handleReset}>Change search</Button>}
      />
    );
  } else {
    content = (
      <>
        <p className="mb-3 text-body2 text-navy-500/70">
          {pagination?.total ?? workers.length} workers found
        </p>
        <div
          className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${
            isFetching ? 'opacity-60' : ''
          }`}
        >
          {workers.map((worker) => (
            <WorkerCard key={worker.id} worker={worker} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="outlined"
              size="sm"
              leftIcon={ChevronLeft}
              disabled={page <= 1}
              onClick={() => setPage((value) => value - 1)}
            >
              Previous
            </Button>
            <span className="text-body2 text-navy-500/70">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outlined"
              size="sm"
              rightIcon={ChevronRight}
              disabled={page >= totalPages}
              onClick={() => setPage((value) => value + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="text-left">
      <h1 className="text-h2 font-bold text-navy-500">Find skilled workers</h1>

      <Card className="mb-6 mt-4 p-4">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SelectField
              label="Find workers by trade"
              icon={Search}
              value={filters.tradeId}
              onChange={(e) => setFilters({ ...filters, tradeId: e.target.value })}
            >
              <option value="">All trades</option>
              {trades.map((trade) => (
                <option key={trade.id} value={trade.id}>
                  {trade.name}
                </option>
              ))}
            </SelectField>

            <SelectField
              label="Location"
              icon={MapPin}
              value={filters.stateId}
              onChange={(e) => setFilters({ ...filters, stateId: e.target.value })}
            >
              <option value="">All states</option>
              {states.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </SelectField>
          </div>

          <Button type="submit" size="lg" fullWidth>
            Search workers
          </Button>
        </form>
      </Card>

      {content}
    </div>
  );
}